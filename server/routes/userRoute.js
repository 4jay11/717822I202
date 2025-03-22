const express = require("express");
const axios = require("axios");
const AccessToken = require("../middleware/AccessToken");

const userRoute = express.Router();

// Top 5 users with highest number of posts
userRoute.post("/users", AccessToken, async (req, res) => {
  try {
    // Fetch users data from test server
    const { data } = await axios.get("http://20.244.56.144/test/users", {
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.Authorization,
      },
    });

    // Extract users object
    const users = data.users;

    // Convert users object into an array of user objects with id and name
    const usersArray = Object.entries(users).map(([id, name]) => ({
      id,
      name,
      postCount: 0, // Initialize post count
    }));

    // Fetch post count for each user in parallel
    const userPosts = await Promise.all(
      usersArray.map(async (user) => {
        try {
          // Fetch posts for the specific user
          const { data: postsData } = await axios.get(
            `http://20.244.56.144/test/users/${user.id}/posts`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: req.headers.Authorization,
              },
            }
          );

          // Ensure postsData contains 'posts' array
          const postCount = postsData.posts ? postsData.posts.length : 0;

          return { ...user, postCount };
        } catch (error) {
          console.error(
            `Error fetching posts for user ${user.id}:`,
            error.message
          );
          return { ...user, postCount: 0 };
        }
      })
    );

    // Sort users by post count in descending order to get top 5
    const topUsers = userPosts
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, 5);

    // Format the response
    const response = {
      topUsers: topUsers.map((user) => ({
        id: user.id,
        name: user.name,
        postCount: user.postCount,
      })),
    };

    res.status(200).json(response);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = { userRoute };

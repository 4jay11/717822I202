const express = require("express");
const axios = require("axios");
const AccessToken = require("../middleware/AccessToken");

const postRoute = express.Router();

postRoute.post("/posts", async (req, res) => {
  try {
      const { type } = req.query;
    // Access token is not generating
    // const authHeader = req.headers.Authorization;

    // if (!authHeader) {
    //   return res
    //     .status(401)
    //     .json({ message: "Unauthorized: No token provided." });
    // }

    if (!type || !["latest", "popular"].includes(type)) {
      return res
        .status(400)
        .json({
          message: "Invalid query parameter. Use 'latest' or 'popular'.",
        });
    }

    // Mock Users Data
    const usersData = {
      users: {
        1: "John Doe",
        10: "Helen Moore",
        11: "Ivy Taylor",
        12: "Jack Anderson",
        13: "Kathy Thomas",
        14: "Liam Jackson",
        15: "Mona Harris",
        16: "Nathan Clark",
        17: "Olivia Lewis",
        18: "Paul Walker",
        19: "Quinn Scott",
        2: "Jane Doe",
        20: "Rachel Young",
        3: "Alice Smith",
        4: "Bob Johnson",
        5: "Charlie Brown",
        6: "Diana White",
        7: "Edward Davis",
        8: "Fiona Miller",
        9: "George Wilson",
      },
    };

    // Convert usersData.users object to an array
    const users = Object.entries(usersData.users).map(([id, name]) => ({
      id: parseInt(id),
      name,
    }));

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found." });
    }

    // Mock Posts Data
    const postsData = {
      posts: [
        { id: 808, userid: 1, content: "Post about giraffe" },
        { id: 793, userid: 1, content: "Post about dog" },
      ],
    };

    // Attach usernames to posts
    const posts = postsData.posts.map((post) => ({
      ...post,
      username:
        users.find((user) => user.id === post.userid)?.name || "Unknown User",
    }));

    let filteredPosts = [];

    if (type === "latest") {
      // Sort by ID descending and take the latest 5
      filteredPosts = posts.sort((a, b) => b.id - a.id).slice(0, 5);
    } else if (type === "popular") {
      // Mock Comments Data
      const commentsData = {
        comments: [
          { id: 133, postid: 808, content: "Nice!" },
          { id: 134, postid: 808, content: "Amazing post!" },
        ],
      };

      // Count comments per post
      const postCommentCounts = posts.map((post) => {
        const commentCount = commentsData.comments.filter(
          (comment) => comment.postid === post.id
        ).length;
        return { ...post, commentCount };
      });

      // Find the highest comment count
      const maxComments = Math.max(
        ...postCommentCounts.map((post) => post.commentCount),
        0
      );

      // Filter posts that have the highest comment count
      filteredPosts = postCommentCounts.filter(
        (post) => post.commentCount === maxComments
      );
    }

    res.status(200).json({ posts: filteredPosts });
  } catch (err) {
    console.error("Error fetching posts:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = { postRoute };

const axios = require("axios");

// Middleware to fetch and attach access token to request headers
const AccessToken = async (req, res, next) => {
  try {
    const { data } = await axios.post("http://20.244.56.144/test/auth", {
      companyName: "",
      clientID: "",
      clientSecret: "",
      ownerName: "",
      ownerEmail: "",
      rollNo: "",
    });

    if (!data || !data.access_token) {
      return res.status(401).json({ message: "Failed to fetch access token" });
    }

    // Attach token to request headers
    req.headers.Authorization = `Bearer ${data.access_token}`;
    next(); // Move to next middleware
  } catch (err) {
    console.error("Error fetching access token:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = AccessToken;

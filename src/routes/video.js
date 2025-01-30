const express = require('express');
const router = express.Router();
const axios = require("axios");

const API_SECRET_KEY = "DJqUdCcTvILjOPhYSDHHE8WrY71IHSTzKpah8RK2q6qWGnSMXgLrN7Gm9BJ4yDRP";

router.post("/vdocipher/otp", async (req, res) => {
    const { code } = req.body;
  
    if (!code) {
      return res.status(400).json({ error: "Video code is required" });
    }
  
    try {
      const response = await axios.post(
        `https://dev.vdocipher.com/api/videos/${code}/otp`,
        { ttl: 300 },
        {
          headers: {
            Authorization: `Apisecret ${API_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching OTP:", error.message);
      res.status(500).json({ error: "Failed to fetch OTP from VdoCipher" });
    }
  });
module.exports = router;
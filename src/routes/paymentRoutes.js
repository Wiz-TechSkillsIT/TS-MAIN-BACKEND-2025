const express = require("express");
const fetch = require("node-fetch");
const crypto = require("crypto");
const { default: axios } = require("axios");

const router = express.Router();

require("dotenv").config();
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;


 // Create Order API
router.post("/create-order", async (req, res) => {
     try {
      const { amount, currency } = req.body;
  
      const options = {
        amount: 6 * 100, // Convert to paise
        currency: currency || "INR",
        receipt: `receipt_${Date.now()}`
      };
  
      console.log("Creating Razorpay Order:", options);
      const encodedAuth = Buffer.from(RAZORPAY_KEY_ID + ":" + RAZORPAY_KEY_SECRET).toString("base64");

       const response = await axios.post("https://api.razorpay.com/v1/orders", options, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic " + encodedAuth
          }
      });
  
      console.log("Order Created Successfully:", response.data);
  
      res.json({
        success: true,
        order_id: response.data.id,
        amount: response.data.amount,
        currency: response.data.currency
      });
  
    } catch (error) {
      console.error("Error Creating Razorpay Order:", error.response?.data || error.message);
      res.status(500).json({ success: false, message: error.message, error: error.response?.data });
    }
  });

// Payment Verification API
 // Payment Verification API
// Payment Verification API
// Payment Verification API
router.post("/verify", async (req, res) => {
    try {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature, userEmail, courseId, token } = req.body;
  
      // 🔹 Ensure required fields are present
      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !userEmail || !courseId || !token) {
        return res.status(400).json({ success: false, message: "Missing required details" });
      }
  
      // 🔹 Generate expected signature
      const generated_signature = crypto
        .createHmac("sha256", RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");
  
      if (generated_signature === razorpay_signature) {
        console.log("✅ Payment Verified Successfully!");
  
        // 🔹 Step 2: Enroll User After Payment Verification (Pass token)
        const enrollResponse = await axios.post(
          "http://localhost:5005/api/courses/enroll",
          { userEmail, courseId },
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}` // ✅ Pass Token Here
            }
          }
        );
  
        if (enrollResponse.data.message === "User enrolled successfully!") {
          return res.json({ success: true, message: "Payment Verified & User Enrolled!" });
        } else {
          return res.status(500).json({ success: false, message: "Payment Verified, but Enrollment Failed!" });
        }
      } else {
        console.error("❌ Invalid Signature. Payment Verification Failed.");
        return res.status(400).json({ success: false, message: "Invalid Signature. Payment Verification Failed." });
      }
    } catch (error) {
      console.error("Error in Payment Verification or Enrollment:", error.response?.data || error.message);
      res.status(500).json({ success: false, message: "Server Error. Try Again.", error: error.response?.data });
    }
  });

 
module.exports = router;

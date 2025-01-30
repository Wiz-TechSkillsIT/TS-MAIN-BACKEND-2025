const express = require('express');
const router = express.Router();
const crypto = require('crypto'); // For checksum generation
const axios = require('axios'); // For API requests

// Configuration
const MERCHANT_ID = 'PGTESTPAYUAT'; // Use production ID for production
const MERCHANT_KEY = '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399'; // Use your production API key
const MERCHANT_KEY_INDEX = '1';
const SALT_KEY = 'my_secure_salt_15111983'; // Use a secure salt key
const BASE_URL = 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay'; // Use production URL for production

// Initiate Payment Route
router.post('/initiate', async (req, res) => {
  try {
    const { amount, transactionId, mobileNumber, email } = req.body;

    // Validate inputs
    if (!amount || !transactionId || !mobileNumber || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Construct payload
    const payload = {
      merchantId: MERCHANT_ID,
      transactionId: transactionId,
      amount: amount * 100, // Convert to paisa (₹ to paisa)
      merchantUserId: mobileNumber,
      redirectUrl: 'https://techskillsit.com/payment/callback', // Replace with your actual redirect URL
      message: 'Payment for your order',
      email: email,
      mobileNumber: mobileNumber,
    };

    // Encode payload in Base64
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');

    // Generate checksum using HMAC-SHA256
    const checksum = crypto.createHmac('sha256', SALT_KEY).update(encodedPayload).digest('base64');

    // Configure Axios options
    const options = {
      method: 'post',
      url: BASE_URL,
      headers: {
        accept: 'application/json', // Explicitly set the accept header
        'Content-Type': 'application/json', // Ensure Content-Type is JSON
        'X-VERIFY': `${checksum}###${MERCHANT_KEY_INDEX}`, // Include checksum and key index
      },
      data: payload,
    };

    // Make the API request
    const response = await axios.request(options);

    // Handle the PhonePe response
    if (response.data.success) {
      res.status(200).json({
        success: true,
        paymentUrl: response.data.data.instrumentResponse.redirectUrl,
      });
    } else {
      console.error('PhonePe API Error:', response.data);
      res.status(400).json({ success: false, message: response.data.message });
    }
  } catch (error) {
    console.error('Error initiating payment:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      details: error.response?.data || error.message,
    });
  }
});

module.exports = router;

const axios = require('axios');
const Transaction = require('../models/Transaction');

const getDarajaAccessToken = async () => {
  const { SAFARICOM_CONSUMER_KEY, SAFARICOM_CONSUMER_SECRET, DAR_AJA_BASE_URL } = process.env;

  if (!SAFARICOM_CONSUMER_KEY || !SAFARICOM_CONSUMER_SECRET || !DAR_AJA_BASE_URL) {
    throw new Error('Missing Daraja environment variables');
  }

  const auth = Buffer.from(`${SAFARICOM_CONSUMER_KEY}:${SAFARICOM_CONSUMER_SECRET}`).toString('base64');
  const response = await axios.get(`${DAR_AJA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  return response.data.access_token;
};

const initiateStkPush = async (req, res) => {
  try {
    const { phone, amount, orderId } = req.body;
    const { BUSINESS_SHORT_CODE, DAR_AJA_PASSKEY, DAR_AJA_BASE_URL, CALLBACK_URL, PAYBILL_SHORTCODE } = process.env;

    if (!phone || !amount || !orderId) {
      return res.status(400).json({ error: 'phone, amount, and orderId are required' });
    }

    const accessToken = await getDarajaAccessToken();
    const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
    const password = Buffer.from(`${BUSINESS_SHORT_CODE}${DAR_AJA_PASSKEY}${timestamp}`).toString('base64');

    const payload = {
      BusinessShortCode: BUSINESS_SHORT_CODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phone,
      PartyB: PAYBILL_SHORTCODE || BUSINESS_SHORT_CODE,
      PhoneNumber: phone,
      CallBackURL: CALLBACK_URL,
      AccountReference: orderId,
      TransactionDesc: `Payment for order ${orderId}`,
    };

    const response = await axios.post(`${DAR_AJA_BASE_URL}/mpesa/stkpush/v1/processrequest`, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const transaction = new Transaction({
      orderId,
      phone,
      amount,
      status: 'Pending',
      checkoutRequestID: response.data.CheckoutRequestID,
      merchantRequestID: response.data.MerchantRequestID,
      responseBody: response.data,
    });

    await transaction.save();

    return res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error('STK Push initiation failed:', error.response?.data || error.message || error);
    return res.status(500).json({
      error: 'Failed to initiate STK Push',
      details: error.response?.data || error.message,
    });
  }
};

const paymentCallback = async (req, res) => {
  try {
    const callbackData = req.body;
    const callbackBody = callbackData.Body?.stkCallback;
    const callbackMetadata = callbackBody?.CallbackMetadata;
    const checkoutRequestID = callbackBody?.CheckoutRequestID || null;
    const resultCode = callbackBody?.ResultCode;
    const resultDesc = callbackBody?.ResultDesc;

    const transaction = await Transaction.findOne({ checkoutRequestID });
    if (!transaction) {
      console.warn('Payment callback received for unknown transaction:', checkoutRequestID);
      return res.status(404).json({ error: 'Transaction not found' });
    }

    transaction.status = resultCode === 0 ? 'Completed' : 'Failed';
    transaction.callbackPayload = callbackData;
    transaction.resultCode = resultCode;
    transaction.resultDesc = resultDesc;
    transaction.metadata = callbackMetadata;

    await transaction.save();

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Payment callback error:', error.message || error);
    return res.status(500).json({ error: 'Failed to process payment callback' });
  }
};

module.exports = {
  initiateStkPush,
  paymentCallback,
};

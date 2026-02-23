const twilio = require("twilio");
require("dotenv").config();

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const fromPhone = process.env.TWILIO_PHONE;

/**
 * Sends an SMS via Twilio.
 * Falls back gracefully if credentials are not configured.
 */
module.exports = async function sendSMS(to, message) {
    if (!accountSid || accountSid === "YOUR_TWILIO_ACCOUNT_SID") {
        console.log(`[SMS - NOT SENT - no credentials]\nTo: ${to}\nMsg: ${message}`);
        return;
    }

    try {
        const client = twilio(accountSid, authToken);
        const result = await client.messages.create({
            body: message,
            from: fromPhone,
            to: to
        });
        console.log(`✅ SMS sent: ${result.sid}`);
    } catch (error) {
        console.error("❌ SMS error:", error.message);
    }
};

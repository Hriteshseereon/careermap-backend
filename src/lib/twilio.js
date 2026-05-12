import twilio from "twilio";
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendOTPViaTwilio= async (mobile) => {
  return client.verify.v2
    .services(process.env.TWILIO_VERIFY_SID)
    .verifications.create({
      to: mobile,
      channel: "sms",
    });
};

export const verifyOTPViaTwilio = async (mobile, code) => {
  const res = await client.verify.v2
    .services(process.env.TWILIO_VERIFY_SID)
    .verificationChecks.create({
      to: mobile,
      code,
    });

  return res.status === "approved";
};
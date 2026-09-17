import { sendOTPViaTwilio, verifyOTPViaTwilio } from "../../lib/twilio.js";
import jwt from "jsonwebtoken";
import {AuthRepository} from "../auth/auth.repository.js";

import bcrypt from "bcryptjs";
import {generateTokens,generateTempToken} from "../../utils/helpers.js";
import { UserRepository } from "../user/user.repository.js";



// In-memory OTP Store for Dev / Free OTP mode (mobile -> { otp, expiresAt })
const otpStore = new Map();

// helper for profile update check
const isProfileComplete = (user) => {
  return !!(
    user.firstName &&
    user.lastName &&
    user.mobile &&
    user.gender &&
    user.country &&
    user.state &&
    user.city &&
    user.address &&
    user.dataOfBirth &&
    user.image
  );
};

export const otpService = async (mobile, type) => {
  try {
    if (!mobile) {
      throw new Error("Mobile number is required");
    }
    if (!type) {
      throw new Error("Type is required (login/signup)");
    }

    // Check if already registered
    const existingUser = await AuthRepository.findByMobile(mobile);

    if (type === "signup" && existingUser) {
      throw new Error("User already registered. Please login.");
    }
    if (type === "login" && !existingUser) {
      throw new Error("User not found. Please signup.");
    }

    // ----------------------------------------------------
    // Twilio SMS (temporarily commented out for free/dummy mode)
    // await sendOTPViaTwilio(mobile);
    // ----------------------------------------------------

    // Generate 6-digit dynamic OTP (valid for 10 mins)
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(mobile.toString(), {
      otp: generatedOtp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    console.log(`\n========================================`);
    console.log(`🔥 [OTP GENERATED] Mobile: ${mobile} | OTP: ${generatedOtp}`);
    console.log(`========================================\n`);

    return {
      success: true,
      message: "OTP sent successfully",
      otp: generatedOtp, // 🔥 Returning OTP in response for popup/testing
    };
  } catch (error) {
    console.error("OTP Service Error:", error);
    return { success: false, message: error.message || "Failed to send OTP" };
  }
};

export const verifyOTPService = async (mobile, code, type) => {
  try {
    // ----------------------------------------------------
    // Twilio Verification (temporarily commented out)
    // const result = await verifyOTPViaTwilio(mobile, code);
    // if (!result.valid) { ... }
    // ----------------------------------------------------

    // Verify against generated OTP or master testing OTP '123456'
    const stored = otpStore.get(mobile.toString());
    const isValid =
      code === "123456" ||
      (stored && stored.otp === code.toString() && stored.expiresAt > Date.now());

    if (!isValid) {
      return {
        success: false,
        message: "Invalid or expired OTP. Please try again.",
      };
    }

    // Clean up used OTP
    otpStore.delete(mobile.toString());

    // ✅ Handle signup vs login separately
    if (type === "signup") {
      // 🔥 generate temp token
      const tempToken = generateTempToken(mobile);

      return {
        success: true,
        message: "Mobile verified successfully. Proceed to signup.",
        tempToken, // ✅ send token
      };
    }

    if (type === "login") {
      const user = await AuthRepository.findByMobile(mobile);
      if (!user) {
        return { success: false, message: "User not found. Please signup." };
      }
      // 🔥 BAN CHECK
      if (user.status === "banned") {
        return {
          success: false,
          message: "Your account has been banned. Contact support.",
        };
      }
      const tokens = generateTokens(user);
      return { success: true, message: "Login successful", user, ...tokens };
    }

    return { success: false, message: "Invalid type" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};


// login with email and password

export const loginWithEmailPassword = async (email, password) => {
  try {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    if (user.status === "banned") {
  throw new Error(
    "Your account has been banned. Contact support."
  );
}

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
    const profileIncomplete = user.isInstituteStudent && !isProfileComplete(user);

    const tokens = generateTokens(user);
    return { success: true, message: "Login successful",
         user: {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    mobile: user.mobile,
    status: user.status,
    isInstituteStudent: user.isInstituteStudent,
    instituteId: user.instituteId,
  },
       profileIncomplete, 
      ...tokens };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

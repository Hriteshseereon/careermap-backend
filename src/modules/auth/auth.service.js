import { sendOTPViaTwilio, verifyOTPViaTwilio } from "../../lib/twilio.js";
import jwt from "jsonwebtoken";
import {AuthRepository} from "../auth/auth.repository.js";

import bcrypt from "bcryptjs";
import {generateTokens} from "../../utils/helpers.js";
import { UserRepository } from "../user/user.repository.js";

export const otpService = async (mobile,type) => {
  try {
    if (!mobile) {
    throw new Error("Mobile number is required");
  }
 if (!type) {
      throw new Error("Type is required (login/signup)");
    }
  // 🔥 Check if already registered
  const existingUser = await AuthRepository.findByMobile(mobile);

  if (type === "signup" && existingUser) {
    throw new Error("User already registered. Please login.");
  }
  if (type === "login" && !existingUser) {
      throw new Error("User not found. Please signup.");
    }
    await sendOTPViaTwilio(mobile);
    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
      console.error("Twilio Error:", error);
    return { success: false, message: "Failed to send OTP" };
  }
};

export const verifyOTPService = async (mobile, code) => {
  try {
    const isValid = await verifyOTPViaTwilio(mobile, code);

    if (!isValid) {
      return { success: false, message: "Invalid OTP" };
    }

    const user = await AuthRepository.findByMobile(mobile);

    if (!user) {
      return { success: false, message: "User not found. Please signup." };
    }

    const tokens = generateTokens(user);

    return {
      success: true,
      message: "Login successful",
      user,
      ...tokens,
    };
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
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
    const tokens = generateTokens(user);
    return { success: true, message: "Login successful", ...tokens };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

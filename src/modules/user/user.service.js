import bcrypt from "bcryptjs";
import { UserRepository } from "./user.repository.js";
import { generateTokens } from "../../utils/helpers.js";

export const registerUser = async (body, mobileFromToken) => {
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    landingData,
    ...profileFields
  } = body;

  // ✅ Check email only (mobile already verified via OTP)
  const existingUser = await UserRepository.findByEmail(email);
  if (existingUser) {
    throw new Error("User with this email already exists.");
  }

  // ✅ Double safety: check mobile again
  const existingMobile = await UserRepository.findByMobile(mobileFromToken);
  if (existingMobile) {
    throw new Error("Mobile already registered");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const newUser = await UserRepository.createUserWithLandingData(
    {
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      mobile: mobileFromToken, // 🔥 from token only
      ...profileFields,
    },
    landingData
  );

  // ✅ Now generate REAL auth tokens
  const { accessToken, refreshToken } = generateTokens(newUser);

  return { user: newUser, accessToken, refreshToken };
};
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

export const updateProfile = async (
  userId,
  body
) => {

  const user =
    await UserRepository.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const updated =
    await UserRepository.updateUser(
      userId,
      {
        firstName: body.firstName,
        lastName: body.lastName,
        username: body.username,
        email: body.email,

        country: body.country,
        state: body.state,
        city: body.city,
        district: body.district,

        gender: body.gender,
        address: body.address,

        dataOfBirth: body.dataOfBirth
          ? new Date(body.dataOfBirth)
          : undefined,

        image: body.image,
      }
    );

  return updated;
};

// change password logic 
export const changePassword = async (
  userId,
  body
) => {

  const {
    currentPassword,
    newPassword,
    confirmPassword,
  } = body;

  const user =
    await UserRepository.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // check current password

  const isMatch =
    await bcrypt.compare(
      currentPassword,
      user.password
    );

  if (!isMatch) {
    throw new Error(
      "Current password is incorrect"
    );
  }

  // check confirm password

  if (newPassword !== confirmPassword) {
    throw new Error(
      "New password and confirm password do not match"
    );
  }

  // optional validation

  if (newPassword.length < 6) {
    throw new Error(
      "Password must be at least 6 characters"
    );
  }

  const hashedPassword =
    await bcrypt.hash(
      newPassword,
      12
    );

  await UserRepository.updatePassword(
    userId,
    hashedPassword
  );

  return {
    success: true,
    message:
      "Password changed successfully",
  };
};
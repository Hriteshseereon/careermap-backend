import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
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

// forgot password and reset password logic can be added here in future
export const forgotPassword = async (email) => {

  const user =
    await UserRepository.findByEmail(email);

  if (!user) {
    throw new Error("User not found");
  }

  const token = jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_RESET_SECRET,
    {
      expiresIn: "15m",
    }
  );

  const resetLink =
    `${process.env.FRONTEND_URL}/reset-password/${token}`;

  const transporter =
    nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,

    to: user.email,

    subject: "Reset Password",

    html: `
      <h3>Reset Password</h3>

      <p>Click below link:</p>

      <a href="${resetLink}">
        Reset Password
      </a>

      <p>Link valid for 15 minutes.</p>
    `,
  });

  return {
    success: true,
    message: "Reset link sent successfully",
  };
};

// reset password logic can be implemented in future as well
export const resetPassword = async (
  token,
  newPassword,
  confirmPassword
) => {

  if (
    newPassword !==
    confirmPassword
  ) {
    throw new Error(
      "Passwords do not match"
    );
  }

  const decoded =
    jwt.verify(
      token,
      process.env.JWT_RESET_SECRET
    );

  const hashedPassword =
    await bcrypt.hash(
      newPassword,
      12
    );

  await UserRepository.updatePassword(
    decoded.id,
    hashedPassword
  );

  return {
    success: true,
    message:
      "Password reset successful",
  };
};

export const getAllUsers = async () => {
  try {

    const users =
      await UserRepository.getAllUsers();

    return {
      success: true,
      data: users,
    };

  } catch (error) {

    return {
      success: false,
      message: error.message,
    };
  }
  
};

// 🔥 ADMIN GET USER BY ID

export const getUserById = async (id) => {
  try {

    const user =
      await UserRepository.getUserById(
        Number(id)
      );

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    return {
      success: true,
      data: user,
    };

  } catch (error) {

    return {
      success: false,
      message: error.message,
    };
  }
};

// 🔥 BAN USER

export const banUser = async (id) => {
  try {

    const user =
      await UserRepository.findById(
        Number(id)
      );

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const updated =
      await UserRepository.banUser(
        Number(id)
      );

    return {
      success: true,
      message:
        "User banned successfully",
      data: updated,
    };

  } catch (error) {

    return {
      success: false,
      message: error.message,
    };
  }
};

// 🔥 UNBAN USER

export const unbanUser = async (id) => {
  try {

    const user =
      await UserRepository.findById(
        Number(id)
      );

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const updated =
      await UserRepository.unbanUser(
        Number(id)
      );

    return {
      success: true,
      message:
        "User activated successfully",
      data: updated,
    };

  } catch (error) {

    return {
      success: false,
      message: error.message,
    };
  }
};

// 🔥 GET ALL BANNED USERS

export const getBannedUsers = async () => {
  try {

    const users =
      await UserRepository.getBannedUsers();

    return {
      success: true,
      data: users,
    };

  } catch (error) {

    return {
      success: false,
      message: error.message,
    };
  }
};

// 🔥 GET USER TRANSACTIONS

export const getUserTransactions = async (userId) => {
  try {

    const transactions =
      await UserRepository.getUserTransactions(
        Number(userId)
      );

    return {
      success: true,
      data: transactions,
    };

  } catch (error) {

    return {
      success: false,
      message: error.message,
    };
  }
};

// 🔥 GET LOGIN HISTORY

export const getLoginHistory = async (userId) => {
  try {

    const history =
      await UserRepository.getLoginHistory(
        Number(userId)
      );

    return {
      success: true,
      data: history,
    };

  } catch (error) {

    return {
      success: false,
      message: error.message,
    };
  }
};
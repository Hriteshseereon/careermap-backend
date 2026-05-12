import bcrypt from "bcryptjs";
import { AdminAuthRepository } from "./adminauth.repository.js";
import { generateAdminTokens } from "../../utils/helpers.js";

// 🔹 Signup (optional)
export const adminSignup = async (body) => {
  try {
    console.log("📩 Incoming body:", body);

    const { email, password, ...rest } = body;

    console.log("🔍 Checking existing admin...");
    const existing = await AdminAuthRepository.findByEmail(email);

    console.log("👤 Existing admin:", existing);

    if (existing) {
      return { success: false, message: "Admin already exists" };
    }

    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 12);

    console.log("💾 Creating admin...");
    const admin = await AdminAuthRepository.createAdmin({
      email,
      password: hashedPassword,
      ...rest,
    });

    console.log("✅ Admin created:", admin);

    // const tokens = generateAdminTokens(admin);

    return {
      success: true,
      message: "Admin created successfully",
      admin,

    };

  } catch (error) {
    console.error("❌ Service Error (adminSignup):", error);
    return { success: false, message: error.message };
  }
};
// 🔹 Login
export const adminLogin = async (email, password) => {
  const admin = await AdminAuthRepository.findByEmail(email);

  if (!admin) {
    return { success: false, message: "Admin not found" };
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    return { success: false, message: "Invalid credentials" };
  }

  const tokens = generateAdminTokens(admin);

  return {
    success: true,
    message: "Admin login successful",
    admin,
    ...tokens,
  };
};
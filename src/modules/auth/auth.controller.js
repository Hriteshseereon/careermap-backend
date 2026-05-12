import { otpService, verifyOTPService,loginWithEmailPassword} from "./auth.service.js";

export const sendOTP = async (req, res) => {
    const { mobile,type } = req.body;
    const result = await otpService(mobile,type);
    if (result.success) {
        return res.status(200).json(result);
    } else {
        return res.status(500).json(result);
    }
};

export const verifyOTP = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Body missing" });
    }

    const { mobile, code } = req.body;

    if (!mobile || !code) {
      return res.status(400).json({ message: "Mobile and code required" });
    }

    const result = await verifyOTPService(mobile, code);

    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// login with email and password
export const loginWithPassword = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Body missing" });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const result = await loginWithEmailPassword(email, password);

    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

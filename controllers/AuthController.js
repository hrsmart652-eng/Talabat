const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Jsend = require("../utils/Jsend");
const Constants = require("../utils/Constants");
const sendMail = require("../utils/Mailer");
const Token = require("../models/Token");
const crypto = require("crypto");
const BlackListedToken = require("../models/BlackListedToken");

const registerUser = async (req, res, next) => {
  try {
    let { name, email, password, phone } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const role = "customer";

    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
    });
    await user.save();

    const otp = crypto.randomInt(100000, 1000000).toString();
    const token = new Token({ userId: user._id, token: otp });
    await token.save();

    const html = `
      Welcome to Talabat
      <br>
      Your OTP code is: ${otp}
      <br>
      This code will expire in ${Constants.EXPIRE.OTP} minutes
    `;
    await sendMail(user.email, "Talabat Verification Mail", html);

    return res.status(Constants.STATUSCODE.CREATED).json(
      Jsend.success({
        message: "User created successfully. Check your email to verify your account.",
        userId: user._id,
      })
    );
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.isVerified) {
      return res.status(Constants.STATUSCODE.UNAUTHORIZED).json(
        Jsend.fail({ credentials: "Invalid email or password" })
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(Constants.STATUSCODE.UNAUTHORIZED).json(
        Jsend.fail({ credentials: "Invalid email or password" })
      );
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: Constants.EXPIRE.JWT }
    );

    return res.status(Constants.STATUSCODE.SUCCESS).json(
      Jsend.success({
        auth: {
          userId: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          token,
        },
      })
    );
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(Constants.STATUSCODE.UNAUTHORIZED).json(
        Jsend.fail({ message: "No token provided" })
      );
    }

    const decoded = jwt.decode(token);
    const expire = new Date(decoded.exp * 1000);

    const blacklistedToken = new BlackListedToken({ token, expireAt: expire });
    await blacklistedToken.save();

    return res.status(Constants.STATUSCODE.SUCCESS).json(
      Jsend.success({ message: "User logged out successfully" })
    );
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { code, email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    const tokenRecord = await Token.findOne({ userId: user._id, token: code });
    if (!tokenRecord) return res.status(400).json({ message: "Invalid Code" });

    user.isVerified = true;
    await user.save();

    return res.json({ message: "Email verified successfully" });
  } catch (error) {
    next(error);
  }
};

const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(Constants.STATUSCODE.NOT_FOUND).json(
      Jsend.fail({ message: "User not exist" })
    );

    const otp = crypto.randomInt(100000, 1000000).toString();
    const token = new Token({ userId: user._id, token: otp });
    await token.save();

    const html = `
      Password Reset 
      <br>
      Your OTP is: ${otp}
      <br>
      This code expires in ${Constants.EXPIRE.OTP} minutes
    `;
    await sendMail(user.email, "Talabat Password Reset", html);

    return res.status(Constants.STATUSCODE.SUCCESS).json(
      Jsend.success({ message: "Check your mail for password reset" })
    );
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, code, newpassword } = req.body;
    const user = await User.findOne({ email });
    const tokenRecord = await Token.findOne({ userId: user._id, token: code });

    if (!user || !tokenRecord) return res.status(Constants.STATUSCODE.BAD_REQUEST).json(
      Jsend.fail({ message: "Invalid code or email" })
    );

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newpassword, salt);
    user.password = hashedPassword;
    await user.save();

    return res.status(Constants.STATUSCODE.SUCCESS).json(
      Jsend.success({ message: "Password reset successfully." })
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  forgetPassword,
  resetPassword,
};
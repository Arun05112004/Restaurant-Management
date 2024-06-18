import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import nodemailer from "nodemailer";
import crypto from "crypto";
import Query from "../models/queryModel.js";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Wrong Password" });
    }

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export const registerUser = async (req, res, next) => {
  const { name, password, email } = req.body;
  try {
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "Email already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid Email" });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password should contain at least 8 characters",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPw = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPw,
    });

    const user = await newUser.save();

    const token = createToken(user._id);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error!" });
  }
};

export const sendEmailFb = async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: "Feedback/Contact Form Submission",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Error sending email" });
  }
};

export const sendQuery = async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const newQuery = new Query({
      name,
      emailId: email,
      message,
    });
    await newQuery.save();
    res
      .status(201)
      .json({ success: true, message: "Query saved successfully!" });
  } catch (error) {
    console.error("Error saving query:", error);
    res.status(500).json({ success: false, message: "Error saving query" });
  }
};

export const queryList = async (req, res) => {
  try {
    const queries = await Query.find({});
    res.status(200).json(queries);
  } catch (error) {
    console.error("Error fetching queries:", error);
    res.status(500).json({ success: false, message: "Error fetching queries" });
  }
};

export const postReset = async (req, res, next) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.json({
        success: false,
        message: "No account with that email found.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await user.save();
    const userId = user._id;

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: req.body.email,
      subject: "Password Reset",
      html: `<p>You requested a password reset</p>
             <p>Click this <a href='http://localhost:5173/reset/${userId}'>link</a> to set a new password</p>`,
    });

    res
      .status(200)
      .json({ success: true, message: "Reset link sent to your email." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again.",
    });
  }
};

// export const getReset = async (req, res, next) => {
//   const token = req.params.token;
//   try {
//     const user = await userModel.findOne({
//       resetToken: token,
//       resetTokenExpiration: { $gt: Date.now() },
//     });

//     if (!user) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid or expired token." });
//     }

//     res.status(200).json({ success: true, message: "Token is valid." });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({
//         success: false,
//         message: "An error occurred. Please try again.",
//       });
//   }
// };

// export const postReset = async (req, res, next) => {
//   try {
//     const user = await userModel.findOne({ email: req.body.email });
//     if (!user) {
//       return res.json({
//         success: false,
//         message: "No account with that email found.",
//       });
//     }

//     const token = crypto.randomBytes(32).toString("hex");
//     user.resetToken = token;
//     user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
//     await user.save();

//     await transporter.sendMail({
//       from: process.env.GMAIL_USER,
//       to: req.body.email,
//       subject: "Password Reset",
//       html: `<p>You requested a password reset</p>
//              <p>Click this <a href='http://localhost:5173/reset/${token}'>link</a> to set a new password</p>`,
//     });

//     res
//       .status(200)
//       .json({ success: true, message: "Reset link sent to your email." });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred. Please try again.",
//     });
//   }
// };
// export const getReset = async (req, res, next) => {
//   const token = req.params.token;
//   try {
//     const user = await userModel.findOne({
//       resetToken: token,
//       resetTokenExpiration: { $gt: Date.now() },
//     });

//     if (!user) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid or expired token." });
//     }

//     res.status(200).json({ success: true, message: "Token is valid." });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred. Please try again.",
//     });
//   }
// };

export const getNewPassword = (req, res, next) => {
  // const token = req.params.token;
  userModel
    .findOne({})
    .then((user) => {
      res.status(200).json({
        success: true,
        userId: user._id.toString(),
      });
    })
    .catch((err) => {
      res
        .status(400)
        .json({ success: false, message: "Invalid or expired token." });
    });
};

export const postNewPassword = async (req, res, next) => {
  console.log("inside new password ", req.body.userId);
  const newPassword = req.body.password;
  const userId = req.body.userId;
  // const passwordToken = req.body.passwordToken;

  try {
    const user = await userModel.findOne({ _id: userId });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token." });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();
    console.log(user);
    res
      .status(200)
      .json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again.",
    });
  }
};

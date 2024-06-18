import orderModel from "../models/orderModel.js";
import foodModel from "../models/foodModel.js";
import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});
export const dashList = async (req, res) => {
  const orders = await orderModel.find({});

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((acc, order) => acc + order.amount, 0);

  const weeklyRevenue = orders.reduce((acc, order) => {
    const weekNumber = getWeekNumber(order.date);
    acc[weekNumber] = (acc[weekNumber] || 0) + order.amount;
    return acc;
  }, {});

  res.json({ totalOrders, totalRevenue, weeklyRevenue });
};

function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return weekNo;
}

export const getPie = async (req, res) => {
  const orders = await orderModel.find({});
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((acc, order) => acc + order.amount, 0);

  const categorySales = orders.reduce((acc, order) => {
    order.items.forEach((item) => {
      if (!acc[item.category]) {
        acc[item.category] = 0;
      }
      acc[item.category] += item.price * item.quantity;
    });
    return acc;
  }, {});

  const categorySalesData = Object.keys(categorySales).map((category) => ({
    name: category,
    value: categorySales[category],
  }));

  res.json({ totalOrders, totalRevenue, categorySales: categorySalesData });
};

export const sendReply = async (req, res) => {
  const { email, message } = req.body;
  console.log(req.body);
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email, // Corrected here
    subject: "Reply from BlinkBite",
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Error sending email" });
  }
};

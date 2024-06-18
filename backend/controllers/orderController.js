import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit";
import nodemailer from "nodemailer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export const placeOrder = async (req, res, next) => {
  const frontend_url = "http://localhost:5173";

  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 100 * 60,
      },
      quantity: 1,
    });
    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findOneAndDelete(orderId);
      res.json({ success: false, message: "Payment failed!" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error!" });
  }
};

export const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error" });
  }
};

export const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error" });
  }
};

const generateInvoice = (order) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const fileName = `invoice_${order._id}.pdf`;
    const invoicesDir = path.join(__dirname, "invoices");

    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir);
    }

    const filePath = path.join(invoicesDir, fileName);
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    doc.font("Helvetica-Bold").fontSize(15).text("BlinkBite", 50, 50);
    doc
      .font("Helvetica")
      .fontSize(12)
      .text("New Bangali Tola Mahavir Path, Mithapur, Patna", 50, 70);

    doc.moveDown(2);
    doc.font("Helvetica-Bold").text("BILL TO", { underline: true });
    console.log(order.address.name);
    doc.fontSize(12).text(`Name: ${order.address.firstName}`);
    doc
      .fontSize(12)
      .text(`Address: ${order.address.street}, ${order.address.city}`);
    doc.fontSize(12).text(`E-mail: ${order.address.email}`);
    doc.fontSize(12).text(`Customer Phone: ${order.address.phone}`);

    const invoiceDetailsX = doc.page.width - 200;
    const invoiceTableTop = 100;

    doc.rect(invoiceDetailsX, invoiceTableTop, 150, 75).stroke();
    doc
      .font("Helvetica")
      .text(
        `Date: ${new Date().toLocaleDateString()}`,
        invoiceDetailsX + 10,
        invoiceTableTop + 10
      );
    doc.text(
      `Invoice #: ${order._id}`,
      invoiceDetailsX + 10,
      invoiceTableTop + 30
    );

    doc.moveDown(1);
    doc.moveDown(1);

    doc.moveDown(1);
    doc.moveDown(1);
    doc.moveDown(1);

    const orderDetailsX =
      (doc.page.width - doc.widthOfString("Order Details")) / 2;

    doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .text("Order Details", orderDetailsX, doc.y, { underline: true });

    doc.moveDown(1);

    const tableTop = doc.y + 20;
    const itemCodeX = 80;
    const quantityX = 280;
    const priceX = 350;
    const amountX = 430;

    doc
      .moveTo(itemCodeX, tableTop)
      .lineTo(amountX + 50, tableTop)
      .stroke();

    doc.font("Helvetica-Bold").text("Item", itemCodeX, tableTop + 10);
    doc.text("Quantity", quantityX, tableTop + 10);
    doc.text("Price", priceX, tableTop + 10);
    doc.text("Amount", amountX, tableTop + 10);

    doc
      .moveTo(itemCodeX, tableTop + 25)
      .lineTo(amountX + 50, tableTop + 25)
      .stroke();

    let currentY = tableTop + 35;

    order.items.forEach((item) => {
      doc.font("Helvetica").text(item.name, itemCodeX, currentY, {
        width: quantityX - itemCodeX - 10,
      });
      doc.text(item.quantity, quantityX, currentY, {
        width: priceX - quantityX - 10,
      });
      doc.text(`₹${item.price}`, priceX, currentY, {
        width: amountX - priceX - 10,
      });
      doc.text(`₹${item.price * item.quantity}`, amountX, currentY, {
        width: doc.page.width - amountX - 10,
      });
      currentY += 20;
    });

    currentY += 10;

    doc.font("Helvetica").text("Delivery", priceX, currentY);
    doc.text(`₹60`, amountX, currentY);

    currentY += 10;
    doc
      .moveTo(itemCodeX, currentY)
      .lineTo(amountX + 50, currentY)
      .stroke();
    currentY += 10;

    doc.font("Helvetica-Bold").text("Total", priceX, currentY + 20);
    doc.text(`₹${order.amount}`, amountX, currentY + 20);

    doc.moveDown(1);
    doc.moveDown(1);
    doc.moveDown(1);
    doc.moveDown(1);
    doc.moveDown(1);
    doc.moveDown(1);
    doc.moveDown(1);
    doc.moveDown(1);
    doc.moveDown(1);
    doc.moveDown(1);
    doc.moveDown(1);

    doc.moveDown(1);
    doc.moveDown(1);
    const footerTextX =
      (doc.page.width -
        doc.widthOfString(
          "If you have any queries, contact us at contact@blinkbite.com "
        )) /
      2;
    doc
      .font("Helvetica")
      .fontSize(10)
      .text(
        "If you have any queries, please email us at contact@blinkbite.com or call us at +91-982244525",
        footerTextX,
        doc.y,
        { align: "center" }
      );

    doc.end();

    writeStream.on("finish", () => resolve(filePath));
    writeStream.on("error", (err) => reject(err));
  });
};

const sendEmailWithInvoice = async (to, subject, text, filePath) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject,
    text,
    attachments: [
      {
        filename: path.basename(filePath),
        path: filePath,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};

export const updateStatus = async (req, res) => {
  try {
    const order = await orderModel.findOneAndUpdate(
      { _id: req.body.orderId },
      { status: req.body.status },
      { new: true }
    );

    if (order.status === "Delivered") {
      const customerEmail = order.address.email;
      const subject = "Your order has been delivered";

      const text = `Dear ${order.address.firstName},

      Thank you for choosing BlinkBite! We hope you enjoyed your meal.
      
      Your order with ID ${order._id} has been successfully delivered. We truly appreciate your business and look forward to serving you again soon.
      
      If you have any feedback or questions about your order, please feel free to contact us at blinkbite14@gmail.com.
      
      Best regards,
      BlinkBite
      New Bangali Tola Mahavir Path, Mithapur, Patna
      blinkbite14@gmail.com
      +91-982244525
      
      Thank you once again for dining with us!
      
      Best,
      [Restaurant Name] Team
          `;

      const invoicePath = await generateInvoice(order);
      await sendEmailWithInvoice(customerEmail, subject, text, invoicePath);

      fs.unlinkSync(invoicePath);
    }

    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating status" });
  }
};

export const pdfFile = async (req, res) => {
  try {
    const order = await orderModel.findById(req.body.orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    const invoicePath = await generateInvoice(order);
    res.download(invoicePath, (err) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ success: false, message: "Error downloading file" });
      }
      fs.unlinkSync(invoicePath);
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error generating invoice" });
  }
};

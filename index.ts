import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// メール送信関数
async function sendEmail(to: string, subject: string, text: string) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("メールが送信されました:", info.response);
  } catch (error) {
    console.error("メール送信に失敗しました:", error);
  }
}

// テストメール送信
await sendEmail(
  "ohayousagi.ac.kook0727@gmail.com",
  "テストメール",
  "これはテストメールです。"
);

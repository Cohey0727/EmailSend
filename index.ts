import nodemailer from "nodemailer";
import imaps from "imap-simple";

// SMTP トランスポーター設定
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

type MailOptions = {
  from: string;
  to: string;
  subject: string;
  text: string;
};

// メール送信関数
async function sendEmail(to: string, subject: string, text: string) {
  const mailOptions: MailOptions = {
    from: process.env.SMTP_USER!,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("メールが送信されました:", info.response);

    // メール送信後に送信済みフォルダに保存
    await saveToSentFolder(mailOptions);
  } catch (error) {
    console.error("メール送信に失敗しました:", error);
  }
}

// IMAP経由で送信済みフォルダに保存する関数
async function saveToSentFolder(mailOptions: MailOptions) {
  const config = {
    imap: {
      user: process.env.IMAP_USER!,
      password: process.env.IMAP_PASS!,
      host: process.env.IMAP_HOST!,
      port: Number(process.env.IMAP_PORT!),
      tls: true,
      authTimeout: 3000,
    },
  };

  try {
    const connection = await imaps.connect({ imap: config.imap });

    const message = [
      `from: ${mailOptions.from}`,
      `to: ${mailOptions.to}`,
      `subject: ${mailOptions.subject}`,
      `date: ${new Date().toUTCString()}`,
      "",
      mailOptions.text,
    ].join("\n");

    // メールを送信済みフォルダに保存
    await connection.append(message, {
      mailbox: "INBOX.Sent",
      flags: ["Seen"],
    });

    console.log("送信済みフォルダに保存されました");
    await connection.end(); // 接続を閉じる
  } catch (error) {
    console.error("送信済みフォルダへの保存に失敗しました:", error);
  }
}

// テストメール送信
await sendEmail(
  "ohayousagi.ac.kook0727@gmail.com",
  "テストメール",
  "これはテストメールです。"
);

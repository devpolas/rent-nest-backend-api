import transporter from "../lib/nodemailer";
import config from "../config";

export const emailTemplate = ({
  title,
  description,
  link,
  actionText,
}: {
  title: string;
  description: string;
  link?: string;
  actionText?: string;
}) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Rent Rest</title>
  </head>
  
  <body style="
  margin:0;
  padding:0;
  background:#f8fafc;
  font-family:Arial, Helvetica, sans-serif;
  ">
  
  
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
  <td align="center" style="padding:40px 16px;">
  
  
  <table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="
  max-width:560px;
  background:#ffffff;
  border-radius:20px;
  overflow:hidden;
  "
  >
  
  
  <!-- HEADER -->
  
  <tr>
  <td
  align="center"
  style="
  background:#0f172a;
  padding:36px 20px;
  "
  >
  
  <img
  src="https://res.cloudinary.com/db7ar6ox9/image/upload/v1785686099/logo_k4ylgm.png"
  alt="Rent Rest"
  width="192"
  height="48"
  style="
  display:block;
  border:0;
  "
  />
  
  
  <p
  style="
  margin:18px 0 0;
  font-size:13px;
  line-height:20px;
  color:#cbd5e1;
  "
  >
  Your trusted rental experience platform
  </p>
  
  
  </td>
  </tr>
  
  
  <!-- BLUE ACCENT -->
  
  <tr>
  <td
  style="
  height:5px;
  background:#2563eb;
  font-size:0;
  "
  >
  </td>
  </tr>
  
  
  
  <!-- CONTENT -->
  
  <tr>
  <td
  style="
  padding:40px 36px;
  "
  >
  
  
  <!-- Greeting -->
  
  <p
  style="
  margin:0 0 12px;
  font-size:15px;
  color:#64748b;
  "
  >
  Hello 👋
  </p>
  
  
  
  <!-- Title -->
  
  <h1
  style="
  margin:0 0 20px;
  font-size:26px;
  line-height:34px;
  font-weight:700;
  color:#0f172a;
  "
  >
  ${title}
  </h1>
  
  
  
  <!-- Description -->
  
  <p
  style="
  margin:0;
  font-size:16px;
  line-height:28px;
  color:#475569;
  "
  >
  ${description}
  </p>
  
  
  
  ${
    link
      ? `
  <!-- CTA -->
  
  <table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  >
  <tr>
  <td
  align="center"
  style="
  padding:35px 0 20px;
  "
  >
  
  <a
  href="${link}"
  style="
  display:inline-block;
  background:#2563eb;
  color:#ffffff;
  padding:15px 34px;
  border-radius:12px;
  font-size:16px;
  font-weight:700;
  text-decoration:none;
  "
  >
  ${actionText ?? "Continue"}
  </a>
  
  
  </td>
  </tr>
  </table>
  `
      : ""
  }
  
  
  
  <!-- Security Card -->
  
  <table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="
  margin-top:25px;
  background:#eff6ff;
  border-radius:12px;
  "
  >
  
  <tr>
  <td
  style="
  padding:18px;
  "
  >
  
  <p
  style="
  margin:0;
  font-size:14px;
  line-height:22px;
  color:#1e40af;
  "
  >
  
  <strong>Security reminder</strong>
  
  <br/>
  
  If you recognize this activity, no further action is required.
  
  If you do not recognize it, please secure your account immediately.
  
  </p>
  
  </td>
  </tr>
  
  </table>
  
  
  
  </td>
  </tr>
  
  
  
  
  
  <!-- FOOTER -->
  
  <tr>
  <td
  align="center"
  style="
  background:#f8fafc;
  padding:28px 25px;
  "
  >
  
  
  <p
  style="
  margin:0 0 10px;
  font-size:15px;
  font-weight:700;
  color:#334155;
  "
  >
  Rent Rest
  </p>
  
  
  
  <p
  style="
  margin:0;
  font-size:13px;
  line-height:22px;
  color:#64748b;
  "
  >
  Find your perfect place.
  <br/>
  Manage rentals with confidence.
  </p>
  
  
  
  <p
  style="
  margin:18px 0 0;
  font-size:12px;
  color:#94a3b8;
  "
  >
  © ${new Date().getFullYear()} Rent Rest.
  <br/>
  All rights reserved.
  </p>
  
  
  </td>
  </tr>
  
  
  
  </table>
  
  
  </td>
  </tr>
  </table>
  
  
  </body>
  </html>
`;
};

export const sendEmail = async ({
  to,
  subject,
  title,
  description,
  link,
  actionText,
}: {
  to: string;
  subject: string;
  title: string;
  description: string;
  link?: string;
  actionText?: string;
}) => {
  const html = emailTemplate({
    title,
    description,
    ...(link !== undefined && { link }),
    ...(actionText !== undefined && { actionText }),
  });

  const mailOptions = {
    from: {
      name: "Rent Nest",
      address: config.nodemailer_user,
    },

    to,

    replyTo: config.nodemailer_user,

    subject: `Rent Nest - ${subject}`,

    text: description,

    html,

    headers: {
      "X-Priority": "3",
      "X-Mailer": "Rent Nest Mailer",
    },
  };

  try {
    await transporter.sendMail(mailOptions);

    return {
      success: true,
    };
  } catch (error) {
    console.error("[Send Email Error]:", error);

    throw new Error("Email sending failed");
  }
};

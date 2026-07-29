import transporter from "../lib/nodemailer";
import config from "../config";

const emailTemplate = ({
  title,
  description,
  link,
}: {
  title: string;
  description: string;
  link?: string;
}) => {
  return `
  <!DOCTYPE html>
  <html>
  <body>

  <div style="
    max-width:500px;
    margin:20px auto;
    padding:25px;
    border:1px solid #ddd;
    border-radius:8px;
    font-family:Arial,sans-serif;
  ">

    <h2 style="
      color:#222;
      margin-bottom:15px;
    ">
      ${title}
    </h2>


    <p style="
      font-size:16px;
      color:#444;
      line-height:1.6;
    ">
      ${description}
    </p>


    ${
      link
        ? `
        <a 
          href="${link}"
          style="
            display:inline-block;
            margin-top:20px;
            padding:12px 18px;
            background:#2563eb;
            color:#ffffff;
            text-decoration:none;
            border-radius:6px;
            font-size:15px;
          "
        >
          Reset Password
        </a>
        `
        : ""
    }


    <p style="
      margin-top:30px;
      font-size:13px;
      color:#777;
    ">
      If you did not request this email, you can safely ignore it.
    </p>


    <p style="
      font-size:13px;
      color:#999;
    ">
      © ${new Date().getFullYear()} Rent Nest
    </p>


  </div>

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
}: {
  to: string;
  subject: string;
  title: string;
  description: string;
  link?: string;
}) => {
  const html = emailTemplate({
    title,
    description,
    ...(link !== undefined && { link }),
  });

  const mailOptions = {
    from: `"Rent Nest" <${config.nodemailer_user}>`,
    to,
    subject,
    html,
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

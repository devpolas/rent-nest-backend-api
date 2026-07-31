import transporter from "../lib/nodemailer";
import config from "../config";

const emailTemplate = ({
  title,
  description,
  link,
  actionText = "Continue",
}: {
  title: string;
  description: string;
  link?: string;
  actionText?: string;
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
              ${actionText}
            </a>
            `
            : ""
        }


        <p style="
          margin-top:30px;
          font-size:13px;
          color:#777;
        ">
          If you did not request this action, you can safely ignore this email.
          Your account will remain secure.
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

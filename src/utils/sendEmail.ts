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
</head>

<body style="
  margin:0;
  padding:0;
  background:#f8fafc;
  font-family:Arial, Helvetica, sans-serif;
">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:30px 15px;">

<table width="100%" 
  style="
    max-width:520px;
    background:#ffffff;
    border-radius:16px;
    overflow:hidden;
    box-shadow:0 4px 20px rgba(0,0,0,0.08);
  "
>

<!-- Header -->
<tr>
<td align="center" style="
  padding:30px 20px;
  background:#2563eb;
">

<!-- Logo -->
<table>
<tr>
<td>

<div style="
  display:flex;
  align-items:center;
">

<div style="
  width:38px;
  height:38px;
  background:white;
  border-radius:12px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
">

<!-- House SVG -->
<svg 
xmlns="http://www.w3.org/2000/svg"
width="22"
height="22"
viewBox="0 0 24 24"
fill="none"
stroke="#2563eb"
stroke-width="2.4"
stroke-linecap="round"
stroke-linejoin="round">

<path d="M3 10.5 12 3l9 7.5"/>
<path d="M5 9.5V21h14V9.5"/>
<path d="M9 21v-6h6v6"/>

</svg>

</div>


<span style="
 margin-left:8px;
 font-size:24px;
 font-weight:800;
 letter-spacing:-1px;
">

<span style="color:white;">
RENT
</span>

<span style="color:#dbeafe;">
REST
</span>

</span>

</div>

</td>
</tr>
</table>


</td>
</tr>


<!-- Content -->
<tr>
<td style="
 padding:35px 30px;
 color:#334155;
">

<h2 style="
 margin:0 0 15px;
 color:#111827;
 font-size:24px;
">
${title}
</h2>


<p style="
 font-size:16px;
 line-height:1.7;
 margin:0;
">
${description}
</p>



${
  link
    ? `
<table width="100%">
<tr>
<td align="center" style="padding:30px 0;">

<a href="${link}"
style="
 display:inline-block;
 padding:14px 28px;
 background:#2563eb;
 color:white;
 text-decoration:none;
 border-radius:10px;
 font-size:16px;
 font-weight:600;
">
${actionText}
</a>

</td>
</tr>
</table>
`
    : ""
}


<p style="
 margin-top:25px;
 font-size:13px;
 color:#64748b;
 line-height:1.6;
">

If you recognize this activity, no further action is required.
If you do not recognize this activity, please secure your account or contact support.

</p>


</td>
</tr>


<!-- Footer -->
<tr>
<td align="center"
style="
padding:20px;
background:#f1f5f9;
font-size:13px;
color:#64748b;
">

© ${new Date().getFullYear()} Rent Rest.
All rights reserved.

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

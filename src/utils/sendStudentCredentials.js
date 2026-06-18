import nodemailer from "nodemailer";

const transporter =
  nodemailer.createTransport({

    service: "gmail",

    auth: {
      user:
        process.env.EMAIL_USER,

      pass:
        process.env.EMAIL_PASS,
    },
  });

export const sendStudentCredentials =
async (
  email,
  name,
  password
) => {

  await transporter.sendMail({

    from:
      process.env.EMAIL_USER,

    to: email,

    subject:
      "CareerMap Student Account",

    html: `
      <h2>Hello ${name}</h2>

      <p>Your student account has been created.</p>

      <p>
        <strong>Email:</strong>
        ${email}
      </p>

      <p>
        <strong>Password:</strong>
        ${password}
      </p>

     
    `,
  });
};
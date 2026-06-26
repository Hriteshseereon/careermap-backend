import transporter from "./mailer.js";

export const sendStudentCredentials = async (
  email,
  name,
  password
) => {
  await transporter.sendMail({
    from: `"CareerMap" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "CareerMap Student Account",
    html: `
      <h2>Hello ${name}</h2>

      <p>Your student account has been created.</p>

      <p><strong>Email:</strong> ${email}</p>

      <p><strong>Password:</strong> ${password}</p>
    `,
  });
};
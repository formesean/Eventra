import emailjs from "@emailjs/browser";

export const sendEmail = async (
  subject: String,
  to_name: String,
  message: String,
  to_email: String
) => {
  const emailParams = {
    subject,
    to_name,
    message,
    to_email,
  };

  try {
    const result = await emailjs.send(
      process.env.NEXT_PUBLIC_SERVICE_ID || "",
      process.env.NEXT_PUBLIC_TEMPLATE_ID || "",
      emailParams,
      process.env.NEXT_PUBLIC_EMAILJS
    );

    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

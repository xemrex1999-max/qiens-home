import { Resend } from 'resend';

export const sendOrderEmail = async (order: any, isAdmin: boolean = false) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY is missing. Skipping email.");
    return { success: false, error: "Missing API Key" };
  }

  const resend = new Resend(apiKey);
  const adminEmails = ["xemrex1999@hotmail.com", "info@qienshome.com"];
  
  const addr = typeof order.address === 'string' ? JSON.parse(order.address) : order.address;
  const toEmail = isAdmin ? adminEmails : addr?.email;

  if (!toEmail) return { success: false, error: "No recipient address" };

  const subject = isAdmin ? "Yeni Siparis" : "Siparis Alindi";

  try {
    await resend.emails.send({
      from: 'Qiens Home <onboarding@resend.dev>',
      to: toEmail,
      subject: subject,
      html: `<div>Siparis No: ${order.id}</div>`,
    });
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};
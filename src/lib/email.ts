import { CreateEmailOptions, Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY ?? "re_123")

export async function sendEmail(payload: CreateEmailOptions) {
  const { data, error } = await resend.emails.send(payload)

  if (error) {
    console.error("Error sending email:", error)
    return { success: false, error }
  }

  return { success: true, data }
}

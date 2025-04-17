import { db } from "@/db"
import { sendEmail } from "@/lib/email"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        from: "Hello <hello@resend.dev>",
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      })
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        from: "Hello <hello@resend.dev>",
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
      })
    },
  },
})

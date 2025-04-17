import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { redirect } from "next/navigation"

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const token = (await searchParams).token

  if (!token || typeof token !== "string") {
    redirect("/auth/signup")
  }

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <Card className="w-80 sm:w-96">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm token={token} />
        </CardContent>
      </Card>
    </div>
  )
}

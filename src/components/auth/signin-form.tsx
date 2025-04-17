"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export function SignInForm() {
  const [isEmailLoading, setIsEmailLoading] = useState(false)
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false)
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("redirect") || "/"

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: form.getValues("email") || "",
    },
  })

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    const { email, password } = values

    await authClient.signIn.email(
      { email, password, callbackURL: callbackUrl },
      {
        onRequest: () => setIsEmailLoading(true),
        onSuccess: () => {
          toast.success("Signed in successfully", {
            description: "Redirecting...",
          })
        },
        onError: (ctx) => {
          toast.error("Sign In Error", {
            description: ctx.error.message,
          })
          setIsEmailLoading(false)
        },
        onSettled: () => setIsEmailLoading(false),
      },
    )
  }

  async function onForgotPassword(
    values: z.infer<typeof forgotPasswordSchema>,
  ) {
    const { email } = values

    try {
      setIsEmailLoading(true)
      await authClient.forgetPassword({
        email,
        redirectTo: "/auth/reset-password",
      })

      toast.success("Password Reset", {
        description: "A password reset link has been sent to your email.",
      })

      setIsForgotPasswordModalOpen(false)
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to send password reset email"

      toast.error("Reset Password Error", {
        description: errorMessage,
      })
    } finally {
      setIsEmailLoading(false)
    }
  }

  const isAnyLoading = isEmailLoading

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            disabled={isAnyLoading}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="john@example.com"
                    type="email"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            disabled={isAnyLoading}
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Dialog
                    open={isForgotPasswordModalOpen}
                    onOpenChange={setIsForgotPasswordModalOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        variant="link"
                        className="h-auto p-0 text-sm"
                      >
                        Forgot password?
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reset Your Password</DialogTitle>
                        <DialogDescription>
                          Enter your email address and we&#39;ll send you a link
                          to reset your password.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...forgotPasswordForm}>
                        <form className="space-y-4">
                          <FormField
                            control={forgotPasswordForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter your email"
                                    type="email"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            className="w-full"
                            disabled={isAnyLoading}
                            onClick={forgotPasswordForm.handleSubmit(
                              onForgotPassword,
                            )}
                          >
                            {isEmailLoading ? (
                              <div className="flex items-center justify-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Sending...</span>
                              </div>
                            ) : (
                              "Send Reset Link"
                            )}
                          </Button>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
                <FormControl>
                  <Input
                    placeholder="********"
                    type="password"
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isAnyLoading}>
            {isEmailLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </Form>

      <div className="text-muted-foreground mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="text-primary hover:underline">
          Sign up
        </Link>
      </div>
    </>
  )
}

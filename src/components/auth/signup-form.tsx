"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { Loader2, Mail } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

export function SignUpForm() {
  const signUpSchema = z
    .object({
      name: z.string().min(2, "Name must be at least 2 characters"),
      email: z.string().email("Invalid email address"),
      password: z.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    })

  const [isEmailLoading, setIsEmailLoading] = useState(false)
  const [isVerificationSent, setIsVerificationSent] = useState(false)
  const [userEmail, setUserEmail] = useState("")

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const isAnyLoading = isEmailLoading

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    const { name, email, password } = values

    await authClient.signUp.email(
      {
        email,
        password,
        name,
      },
      {
        onRequest: () => setIsEmailLoading(true),
        onSuccess: () => {
          toast.success("Account created successfully")
          setUserEmail(email)
          setIsVerificationSent(true)
        },
        onError: (ctx) => {
          toast.error("Error", { description: ctx.error.message })
          setIsEmailLoading(false)
        },
        onSettled: () => setIsEmailLoading(false),
      },
    )
  }

  if (isVerificationSent) {
    return (
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Mail className="text-primary h-12 w-12" />
          </div>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            We&apos;ve sent you a verification link to {userEmail}. Please check
            your inbox and click the link to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-muted-foreground text-center text-sm">
            Didn&apos;t receive the email? Check your spam folder or try signing
            in to resend the verification email.
          </p>
          <div className="flex flex-col gap-2">
            <Button variant="outline" asChild>
              <Link href="/auth/signin">Go to sign in</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Name <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="John Doe"
                  {...field}
                  disabled={isAnyLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="john@example.com"
                  type="email"
                  autoComplete="email"
                  {...field}
                  disabled={isAnyLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Password <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="********"
                  type="password"
                  autoComplete="new-password"
                  {...field}
                  disabled={isAnyLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Confirm Password <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="********"
                  type="password"
                  autoComplete="new-password"
                  {...field}
                  disabled={isAnyLoading}
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
              <span>Creating account...</span>
            </div>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <div className="text-muted-foreground mt-6 text-center text-sm">
        Already have an account?{" "}
        <Link href="/auth/signin" className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </Form>
  )
}

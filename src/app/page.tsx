"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { createUserAction } from "./actions"

export default function Home() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [isSigningOut, setIsSigningOut] = useState(false)
  const {
    isPending,
    execute,
    data: createdUser,
    error,
    isError,
    isSuccess,
  } = useServerAction(createUserAction)

  const handleCreateUser = async () => {
    const [data, err] = await execute({ name })
    if (err) {
      toast.error("Error creating user")
      return
    }
    toast.success(`User created: ${data.name}`)
  }

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      await authClient.signOut()
      router.refresh()
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setIsSigningOut(false)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (name && !isPending) {
        handleCreateUser()
      }
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create User</CardTitle>
          <CardDescription>Enter a name to create a new user.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Enter name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isPending}
          />
          <Button onClick={handleCreateUser} disabled={isPending || !name}>
            {isPending ? "Creating..." : "Create User"}
          </Button>
          <Button variant="outline" onClick={handleSignOut}>
            {isSigningOut ? "Signing out..." : "Sign out"}
          </Button>
          {isPending && (
            <div className="text-muted-foreground text-center text-sm">
              Processing...
            </div>
          )}
          {isSuccess && createdUser && (
            <div className="mt-4 rounded-md bg-green-100 p-3 text-center text-sm text-green-800">
              User created successfully! ID: {createdUser.id}, Name:{" "}
              {createdUser.name}
            </div>
          )}
          {isError && (
            <div className="mt-4 rounded-md bg-red-100 p-3 text-center text-sm text-red-800">
              {error.message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

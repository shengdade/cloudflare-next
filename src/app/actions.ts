"use server"

import { db } from "@/db"
import { users } from "@/db/schema"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import z from "zod"
import { createServerActionProcedure } from "zsa"

const authedProcedure = createServerActionProcedure().handler(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  return {
    user: session?.user,
  }
})

export const createUserAction = authedProcedure
  .createServerAction()
  .input(z.object({ name: z.string().min(5).max(20) }))
  .handler(async ({ input, ctx }) => {
    const [user] = await db
      .insert(users)
      .values({ name: ctx.user.name + ": " + input.name })
      .returning()

    return user
  })

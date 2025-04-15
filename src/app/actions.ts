"use server"

import { getDB } from "@/db"
import { users } from "@/db/schema"
import z from "zod"
import { createServerAction } from "zsa"

export const createUserAction = createServerAction()
  .input(z.object({ name: z.string().min(5).max(20) }))
  .handler(async ({ input }) => {
    const db = getDB()

    const [user] = await db
      .insert(users)
      .values({ name: input.name })
      .returning()

    return user
  })

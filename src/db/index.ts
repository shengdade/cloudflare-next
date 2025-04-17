import { getCloudflareContext } from "@opennextjs/cloudflare"
import { drizzle } from "drizzle-orm/d1"
import * as schema from "./schema"

const { env } = await getCloudflareContext({ async: true })

if (!env.DB) {
  throw new Error("D1 database binding not found")
}

export const db = drizzle(env.DB, { schema })

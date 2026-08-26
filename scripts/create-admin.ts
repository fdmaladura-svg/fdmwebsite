import "dotenv/config";
import { db } from "../src/db";
import { adminUsers } from "../src/db/schema";
import { hashPassword } from "../src/lib/auth";
import { eq } from "drizzle-orm";

async function main() {
  const name = process.env.ADMIN_NAME || "Church Administrator";
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";
  const role = process.env.ADMIN_ROLE || "super_admin";

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required.");
  }
  if (password.length < 12) {
    throw new Error("ADMIN_PASSWORD should be at least 12 characters for production.");
  }
  if (!["super_admin", "admin", "editor"].includes(role)) {
    throw new Error("ADMIN_ROLE must be super_admin, admin, or editor.");
  }

  const existing = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
  if (existing[0]) {
    await db
      .update(adminUsers)
      .set({ name, passwordHash: hashPassword(password), role, active: true, updatedAt: new Date() })
      .where(eq(adminUsers.email, email));
    console.log(`Updated admin account: ${email}`);
  } else {
    await db.insert(adminUsers).values({ name, email, passwordHash: hashPassword(password), role, active: true });
    console.log(`Created admin account: ${email}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err.message || err);
    process.exit(1);
  });

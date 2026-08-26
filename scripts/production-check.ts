import "dotenv/config";

const required = ["DATABASE_URL", "SESSION_SECRET", "NEXT_PUBLIC_SITE_URL"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

if ((process.env.SESSION_SECRET || "").length < 32) {
  console.error("SESSION_SECRET should be at least 32 characters.");
  process.exit(1);
}

if (process.env.PAYSTACK_SECRET_KEY?.startsWith("pk_")) {
  console.error("PAYSTACK_SECRET_KEY must be a secret key that starts with sk_, not a public key.");
  process.exit(1);
}

console.log("Production environment check passed.");

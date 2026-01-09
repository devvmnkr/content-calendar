import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: resolve(__dirname, "../.env") });

import { getSupabaseClient } from "../src/db/supabase.js";
import { hashPassword } from "../src/utils/password.js";
import { UserRole } from "../src/types/user.js";
import { MESSAGES } from "../src/constants/messages.js";

const SEED_DATA = {
  ADMIN_NAME: "Admin User",
  ADMIN_EMAIL: "admin@example.com",
  ADMIN_PASSWORD: "Admin123!",
};

async function seed(): Promise<void> {
  console.log("Starting seed...");

  const supabase = getSupabaseClient();

  // Check if admin user already exists
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", SEED_DATA.ADMIN_EMAIL)
    .single();

  if (existingUser) {
    console.log(MESSAGES.SEED_USER_EXISTS);
    console.log(MESSAGES.SEED_COMPLETE);
    return;
  }

  // Hash password
  const hashedPassword = await hashPassword(SEED_DATA.ADMIN_PASSWORD);

  // Create admin user
  const { error } = await supabase.from("users").insert({
    name: SEED_DATA.ADMIN_NAME,
    email: SEED_DATA.ADMIN_EMAIL,
    password: hashedPassword,
    role: UserRole.ADMIN,
  });

  if (error) {
    console.error("Failed to create admin user:", error);
    process.exit(1);
  }

  console.log(MESSAGES.SEED_USER_CREATED);
  console.log(`Email: ${SEED_DATA.ADMIN_EMAIL}`);
  console.log(`Password: ${SEED_DATA.ADMIN_PASSWORD}`);
  console.log(MESSAGES.SEED_COMPLETE);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});

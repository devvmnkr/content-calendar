import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: resolve(__dirname, "../.env") });

import { getSupabaseClient } from "../src/db/supabase.js";
import { Channel, PostStatus } from "../src/types/post.js";
import { MESSAGES } from "../src/constants/messages.js";

// Sample posts data
const SAMPLE_POSTS = [
  {
    title: "New Year Product Launch",
    content:
      "Exciting new product dropping this week! Stay tuned for the big reveal. #NewYear #Launch",
    channels: [Channel.INSTAGRAM, Channel.FACEBOOK],
    scheduled_time: new Date(2026, 0, 15, 11, 30).toISOString(),
    status: PostStatus.SCHEDULED,
  },
  {
    title: "Company Update",
    content:
      "2026 is here and we have big plans! Check out our latest blog post for more details.",
    channels: [Channel.FACEBOOK, Channel.LINKEDIN],
    scheduled_time: new Date(2026, 0, 16, 12, 30).toISOString(),
    status: PostStatus.SCHEDULED,
  },
  {
    title: "Quick Update",
    content: "Happy New Year from our team! What are your goals for 2026?",
    channels: [Channel.TWITTER],
    scheduled_time: new Date(2026, 0, 17, 13, 30).toISOString(),
    status: PostStatus.SCHEDULED,
  },
  {
    title: "Behind the Scenes",
    content: "A sneak peek at our office celebrations!",
    channels: [Channel.YOUTUBE, Channel.TIKTOK],
    scheduled_time: new Date(2026, 0, 18, 14, 0).toISOString(),
    status: PostStatus.SCHEDULED,
  },
  {
    title: "Trending Topic",
    content: "Join the conversation about the latest industry trends.",
    channels: [Channel.TWITTER, Channel.LINKEDIN],
    scheduled_time: new Date(2026, 0, 20, 11, 30).toISOString(),
    status: PostStatus.SCHEDULED,
  },
  {
    title: "Video Tutorial",
    content: "How to get started with our platform - complete beginner guide.",
    channels: [Channel.YOUTUBE],
    scheduled_time: new Date(2026, 0, 21, 12, 30).toISOString(),
    status: PostStatus.SCHEDULED,
  },
  {
    title: "Professional Insights",
    content:
      "5 trends that will shape our industry in 2026. Read our latest thought leadership piece.",
    channels: [Channel.LINKEDIN],
    scheduled_time: new Date(2026, 0, 22, 11, 30).toISOString(),
    status: PostStatus.SCHEDULED,
  },
  {
    title: "Weekly Roundup",
    content: "Here's what you might have missed this week!",
    channels: [Channel.INSTAGRAM, Channel.FACEBOOK, Channel.TWITTER],
    scheduled_time: new Date(2026, 0, 24, 11, 30).toISOString(),
    status: PostStatus.SCHEDULED,
  },
  {
    title: "Trending Dance",
    content: "Our team tried the latest TikTok dance challenge!",
    channels: [Channel.TIKTOK, Channel.INSTAGRAM],
    scheduled_time: new Date(2026, 0, 25, 11, 30).toISOString(),
    status: PostStatus.DRAFT,
  },
  {
    title: "DIY Ideas",
    content: "10 creative DIY projects for the weekend.",
    channels: [Channel.PINTEREST],
    scheduled_time: new Date(2026, 0, 26, 12, 30).toISOString(),
    status: PostStatus.DRAFT,
  },
  {
    title: "Industry News",
    content: "Breaking: Major announcement in the tech industry.",
    channels: [Channel.LINKEDIN, Channel.TWITTER],
    scheduled_time: new Date(2026, 0, 28, 11, 30).toISOString(),
    status: PostStatus.SCHEDULED,
  },
  {
    title: "Promo Post",
    content: "Limited time offer: 20% off all products this weekend!",
    channels: [Channel.FACEBOOK, Channel.INSTAGRAM],
    scheduled_time: new Date(2026, 0, 30, 11, 30).toISOString(),
    status: PostStatus.SCHEDULED,
  },
];

async function seedPosts(): Promise<void> {
  console.log("Starting posts seed...");

  const supabase = getSupabaseClient();

  // Get admin user to associate posts with
  const { data: adminUser, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("email", "admin@example.com")
    .single();

  if (userError || !adminUser) {
    console.error(
      "Admin user not found. Please run the main seed script first."
    );
    console.error("Run: pnpm seed");
    process.exit(1);
  }

  // Check if posts already exist for this user
  const { data: existingPosts, error: checkError } = await supabase
    .from("posts")
    .select("id")
    .eq("user_id", adminUser.id)
    .limit(1);

  if (checkError) {
    console.error("Failed to check existing posts:", checkError);
    process.exit(1);
  }

  if (existingPosts && existingPosts.length > 0) {
    console.log(MESSAGES.SEED_POSTS_EXIST);
    console.log(MESSAGES.SEED_COMPLETE);
    return;
  }

  // Insert sample posts
  const postsWithUserId = SAMPLE_POSTS.map((post) => ({
    ...post,
    user_id: adminUser.id,
  }));

  const { error: insertError } = await supabase
    .from("posts")
    .insert(postsWithUserId);

  if (insertError) {
    console.error("Failed to create sample posts:", insertError);
    process.exit(1);
  }

  console.log(MESSAGES.SEED_POSTS_CREATED);
  console.log(`Created ${SAMPLE_POSTS.length} sample posts`);
  console.log(MESSAGES.SEED_COMPLETE);
}

seedPosts().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});

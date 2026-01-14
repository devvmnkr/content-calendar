import {
  siInstagram,
  siFacebook,
  siX,
  siYoutube,
  siTiktok,
  siPinterest,
} from "simple-icons";
import type { Platform } from "@/types/calendar";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/stores/themeStore";

// LinkedIn SVG path (from Lucide icons) - simple-icons removed LinkedIn due to trademark
const LINKEDIN_PATH =
  "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z";
const LINKEDIN_HEX = "0A66C2";

const PLATFORM_ICONS: Record<
  Platform,
  { path: string; hex: string; darkHex?: string }
> = {
  instagram: { path: siInstagram.path, hex: siInstagram.hex },
  facebook: { path: siFacebook.path, hex: siFacebook.hex },
  // X (Twitter) is black, use white in dark mode
  twitter: { path: siX.path, hex: siX.hex, darkHex: "FFFFFF" },
  youtube: { path: siYoutube.path, hex: siYoutube.hex },
  linkedin: { path: LINKEDIN_PATH, hex: LINKEDIN_HEX },
  // TikTok is black, use their accent pink/red in dark mode
  tiktok: { path: siTiktok.path, hex: siTiktok.hex, darkHex: "EE1D52" },
  pinterest: { path: siPinterest.path, hex: siPinterest.hex },
};

interface SocialIconProps {
  platform: Platform;
  size?: number;
  className?: string;
  showBackground?: boolean;
}

export function SocialIcon({
  platform,
  size = 16,
  className,
  showBackground = true,
}: SocialIconProps) {
  const { theme } = useThemeStore();
  const icon = PLATFORM_ICONS[platform];
  const isDarkMode = theme === "dark";

  // Get the appropriate color based on theme
  const iconColor = isDarkMode && icon.darkHex ? icon.darkHex : icon.hex;

  // For background mode, X/TikTok need a visible background in dark mode
  const bgColor = isDarkMode && icon.darkHex ? icon.darkHex : icon.hex;

  if (showBackground) {
    return (
      <div
        className={cn("flex items-center justify-center rounded-md", className)}
        style={{
          width: size + 8,
          height: size + 8,
          backgroundColor: `#${bgColor}`,
        }}
      >
        <svg
          role="img"
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill={isDarkMode && icon.darkHex ? "#0B0F14" : "white"}
        >
          <path d={icon.path} />
        </svg>
      </div>
    );
  }

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      style={{ fill: `#${iconColor}` }}
    >
      <path d={icon.path} />
    </svg>
  );
}

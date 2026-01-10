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

// LinkedIn SVG path (from Lucide icons) - simple-icons removed LinkedIn due to trademark
const LINKEDIN_PATH =
  "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z";
const LINKEDIN_HEX = "0A66C2";

const PLATFORM_ICONS: Record<Platform, { path: string; hex: string }> = {
  instagram: { path: siInstagram.path, hex: siInstagram.hex },
  facebook: { path: siFacebook.path, hex: siFacebook.hex },
  twitter: { path: siX.path, hex: siX.hex },
  youtube: { path: siYoutube.path, hex: siYoutube.hex },
  linkedin: { path: LINKEDIN_PATH, hex: LINKEDIN_HEX },
  tiktok: { path: siTiktok.path, hex: siTiktok.hex },
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
  const icon = PLATFORM_ICONS[platform];

  if (showBackground) {
    return (
      <div
        className={cn("flex items-center justify-center rounded-md", className)}
        style={{
          width: size + 8,
          height: size + 8,
          backgroundColor: `#${icon.hex}`,
        }}
      >
        <svg
          role="img"
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="white"
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
      style={{ fill: `#${icon.hex}` }}
    >
      <path d={icon.path} />
    </svg>
  );
}

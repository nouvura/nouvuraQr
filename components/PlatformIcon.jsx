"use client";

import {
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Twitter,
  Github,
  Globe,
  Phone,
  Mail,
  MessageCircle,
  Send,
  Palette,
  Dribbble,
  MapPin,
} from "lucide-react";

// TikTok / Pinterest / Snapchat / Behance don't ship as lucide icons by default,
// so we fall back to a close visual analog while keeping the platform label correct.
const ICON_MAP = {
  Instagram: Instagram,
  Facebook: Facebook,
  TikTok: MessageCircle,
  LinkedIn: Linkedin,
  YouTube: Youtube,
  Twitter: Twitter,
  WhatsApp: MessageCircle,
  Telegram: Send,
  Behance: Palette,
  Dribbble: Dribbble,
  GitHub: Github,
  Pinterest: MapPin,
  Snapchat: MessageCircle,
  Email: Mail,
  Phone: Phone,
  Website: Globe,
};

export default function PlatformIcon({ platform, className = "w-5 h-5" }) {
  const Icon = ICON_MAP[platform] || Globe;
  return <Icon className={className} strokeWidth={1.75} />;
}

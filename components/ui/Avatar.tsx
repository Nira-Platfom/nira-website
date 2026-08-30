import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";

interface AvatarProps {
  name?: string | null;
  size?: number;
  color?: "coral" | "lavender" | "charcoal";
  className?: string;
}

const bg = {
  coral: "bg-coral text-white",
  lavender: "bg-lavender text-white",
  charcoal: "bg-charcoal text-white",
};

export default function Avatar({ name, size = 40, color = "lavender", className }: AvatarProps) {
  return (
    <div
      className={cn("rounded-full flex items-center justify-center font-medium shrink-0", bg[color], className)}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {getInitials(name)}
    </div>
  );
}

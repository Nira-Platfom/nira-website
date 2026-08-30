import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoadingSpinner({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Loader2 size={size} className="animate-spin text-coral" />
    </div>
  );
}

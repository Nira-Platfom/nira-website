import { LucideIcon } from "lucide-react";
import Button from "./Button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-coral-light text-coral mb-4">
        <Icon size={28} />
      </div>
      <h3 className="text-[18px] font-medium text-charcoal mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs mx-auto mb-6">{description}</p>
      {action && (
        <Button variant="primary" size="md" onClick={action.onClick} className="mx-auto">
          {action.label}
        </Button>
      )}
    </div>
  );
}

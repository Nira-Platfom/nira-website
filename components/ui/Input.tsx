import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon: Icon, hint, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-[13px] font-medium text-slate-600 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full h-12 rounded-input bg-page border text-[15px] text-charcoal px-4 outline-none transition-colors",
              "placeholder:text-slate-400",
              Icon && "pl-10",
              error ? "border-red-400" : "border-slate-200 focus:border-coral",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-[12px] text-red-500 mt-1">{error}</p>}
        {hint && !error && <p className="text-[12px] text-slate-400 mt-1">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-[13px] font-medium text-slate-600 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-input bg-page border text-[15px] text-charcoal px-4 py-3 outline-none transition-colors resize-none",
            "placeholder:text-slate-400",
            error ? "border-red-400" : "border-slate-200 focus:border-coral",
            className
          )}
          {...props}
        />
        {error && <p className="text-[12px] text-red-500 mt-1">{error}</p>}
        {hint && !error && <p className="text-[12px] text-slate-400 mt-1">{hint}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export default Input;

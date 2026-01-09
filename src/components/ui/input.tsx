import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full rounded-lg border bg-transparent text-sm text-text-primary placeholder:text-text-tertiary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-main focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-border-default hover:border-border-strong",
        error: "border-accent1-main hover:border-accent1-hover",
      },
      inputSize: {
        default: "px-4",
        sm: "px-3 text-xs",
        lg: "px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
);

const sizeStyles = {
  default: { height: "44px", paddingLeft: "16px", paddingRight: "16px" },
  sm: { height: "36px", paddingLeft: "12px", paddingRight: "12px" },
  lg: { height: "48px", paddingLeft: "16px", paddingRight: "16px" },
} as const;

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, error, style, ...props }, ref) => {
    const sizeStyle = sizeStyles[inputSize || "default"];

    return (
      <input
        className={cn(
          inputVariants({
            variant: error ? "error" : variant,
            inputSize,
            className,
          })
        )}
        style={{ ...sizeStyle, ...style }}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };

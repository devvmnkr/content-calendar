import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-main focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary-main text-text-inverse hover:bg-primary-hover active:bg-primary-pressed",
        destructive:
          "bg-accent1-main text-text-inverse hover:bg-accent1-hover active:bg-accent1-pressed",
        outline:
          "border border-border-default bg-transparent text-text-primary hover:bg-surface-1 active:bg-surface-2",
        secondary:
          "bg-secondary-main text-text-inverse hover:bg-secondary-hover active:bg-secondary-pressed",
        ghost: "text-text-primary hover:bg-surface-1 active:bg-surface-2",
        link: "text-primary-main underline-offset-4 hover:underline",
      },
      size: {
        default: "px-5 text-sm",
        sm: "rounded-md px-4 text-xs",
        lg: "rounded-lg px-8 text-base",
        icon: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const sizeStyles = {
  default: { height: "42px", paddingLeft: "20px", paddingRight: "20px" },
  sm: { height: "36px", paddingLeft: "16px", paddingRight: "16px" },
  lg: { height: "48px", paddingLeft: "32px", paddingRight: "32px" },
  icon: { height: "40px", width: "40px" },
} as const;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, style, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const sizeStyle = sizeStyles[size || "default"];

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        style={{ ...sizeStyle, ...style }}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

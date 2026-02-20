import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 font-tech tracking-wider",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--accent)] text-[var(--bg)] hover:shadow-[0_0_20px_var(--accent)] border border-[var(--accent)]",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 border border-red-500",
        outline:
          "border border-[var(--border)] bg-transparent text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]",
        secondary:
          "bg-[var(--title-bar)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--accent)]",
        ghost:
          "hover:bg-[var(--surface)] hover:text-[var(--accent)]",
        link:
          "text-[var(--accent)] underline-offset-4 hover:underline",
        walttab:
          "bg-gradient-to-r from-orange-400 to-yellow-400 text-black font-bold border border-[var(--border)] hover:shadow-[0_0_20px_rgba(251,191,36,0.4)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8 text-base",
        xl: "h-14 px-10 text-lg font-bold",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

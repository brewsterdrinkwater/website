import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-blue-600 to-orange-500 text-white hover:scale-105 hover:shadow-lg",
        destructive:
          "bg-red-500 text-white hover:bg-red-600",
        outline:
          "border-2 border-black bg-white text-black hover:bg-gray-100",
        secondary:
          "bg-gray-100 text-black hover:bg-gray-200",
        ghost:
          "hover:bg-gray-100 hover:text-black",
        link:
          "text-blue-600 underline-offset-4 hover:underline",
        walttab:
          "bg-gradient-to-r from-orange-400 to-yellow-400 text-black font-bold border-2 border-black hover:scale-105 hover:brightness-110",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8 text-base",
        xl: "h-14 rounded-full px-10 text-lg font-bold",
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

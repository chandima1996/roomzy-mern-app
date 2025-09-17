import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority"; // Make sure you have installed class-variance-authority

import { cn } from "@/lib/utils";

// 1. REMOVE the 'export' keyword from this line
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        // This is the variant you added. It looks perfect.
        success:
          "border-transparent bg-green-500 text-primary-foreground hover:bg-green-500/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/90",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// 2. The Badge component function itself does not need an export keyword here.
function Badge({ className, variant, ...props }) {
  // Shadcn's default badge doesn't use asChild or Slot, let's simplify to match the standard.
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

// 3. This is the SINGLE export statement at the end of the file.
// It exports both the Badge component and the badgeVariants configuration.
export { Badge, badgeVariants };

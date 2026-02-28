import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-accent text-white",
        secondary: "border-transparent bg-muted text-foreground",
        destructive: "border-transparent bg-red-500 text-white",
        outline: "text-foreground border-accent",
        plastic: "border-transparent bg-blue-500 text-white",
        can: "border-transparent bg-red-500 text-white",
        paper: "border-transparent bg-yellow-500 text-white",
        glass: "border-transparent bg-cyan-500 text-white",
        general: "border-transparent bg-gray-500 text-white",
        verified: "border-transparent bg-green-500 text-white",
        likely: "border-transparent bg-amber-500 text-white",
        unverified: "border-transparent bg-gray-400 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

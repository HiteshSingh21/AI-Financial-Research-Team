import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
    {
        variants: {
            variant: {
                default: "bg-mint/10 text-mint border border-mint/20",
                secondary: "bg-surface-light text-slate-text border border-border",
                success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
                warning: "bg-warning/10 text-warning border border-warning/20",
                danger: "bg-danger/10 text-danger border border-danger/20",
                processing: "bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse-slow",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

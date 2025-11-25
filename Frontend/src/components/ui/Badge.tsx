import React from "react";

interface BadgeProps {
    children: React.ReactNode;
    variant: "status" | "priority";
    color: string;
    ariaLabel?: string;
}

export function Badge({ children, variant, color, ariaLabel }: BadgeProps) {
    return (
        <span className={`badge ${color}`} role="status" aria-label={ariaLabel || `${variant}: ${children}`}>
            {children}
        </span>
    );
}

import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow,background-color] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary/10 text-primary dark:text-primary-foreground dark:bg-primary/20 [a&]:hover:bg-primary/20",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive/10 text-destructive dark:text-destructive-foreground dark:bg-destructive/20 [a&]:hover:bg-destructive/20",
        success:
          "border-transparent bg-success/10 text-success dark:text-success-foreground dark:bg-success/20 [a&]:hover:bg-success/20",
        warning:
          "border-transparent bg-warning/10 text-warning dark:text-warning-foreground dark:bg-warning/20 [a&]:hover:bg-warning/20",
        info:
          "border-transparent bg-info/10 text-info dark:text-info-foreground dark:bg-info/20 [a&]:hover:bg-info/20",
        outline:
          "text-foreground border-border [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

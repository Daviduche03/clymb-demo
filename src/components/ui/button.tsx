import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"

import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center select-none gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:data-loading:opacity-100 disabled:active:scale-100 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive relative overflow-hidden before:pointer-events-none before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent hover:before:translate-x-full before:transition-transform before:duration-700 before:ease-[cubic-bezier(0.22,1,0.36,1)]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2 has-[>svg]:px-4",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-11 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const spinnerSizes: Record<
  NonNullable<VariantProps<typeof buttonVariants>["size"]>,
  number
> = {
  default: 18,
  xs: 12,
  sm: 14,
  lg: 20,
  icon: 18,
  "icon-xs": 12,
  "icon-sm": 14,
  "icon-lg": 20,
}

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  isLoading = false,
  disabled,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    isLoading?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-loading={isLoading ? "" : undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? <Spinner size={spinnerSizes[size ?? "default"]} /> : children}
    </Comp>
  )
}

export { Button, buttonVariants }

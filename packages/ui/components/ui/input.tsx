import * as React from "react";

import { cn } from "../../lib/utils";

type NativeInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "prefix" | "suffix"
>;

type InputProps = NativeInputProps & {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  isPassword?: boolean;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    prefix,
    suffix,
    type,
    ...props
  },
  ref
) {
  return (
    <div
      className={cn(
        "flex items-center h-8 w-full rounded-md border border-input bg-background px-3",
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        className,
      )}
    >
      {prefix && (
        <div className="mr-2 flex items-center text-muted-foreground">
          {prefix}
        </div>
      )}
      <input
        ref={ref}
        type={type}
        data-slot="input"
        className={cn(
          "flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
        {...props}
      />
      {suffix && (
        <div className="ml-2 flex items-center text-muted-foreground">
          {suffix}
        </div>
      )}
    </div>
  );
});

export { Input };

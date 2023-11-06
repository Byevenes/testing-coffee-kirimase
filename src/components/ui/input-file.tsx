import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InputProps } from './input';
import React, { HtmlHTMLAttributes } from "react";

const InputFile = React.forwardRef<HTMLInputElement, InputProps>(
  function InputFile({ className, type, ...props }, ref) {
    return (
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="picture">Picture</Label>
        <Input type="file" ref={ref} {...props} />
      </div>
    )
  }
)

InputFile.displayName = 'InputFile';

export { InputFile };

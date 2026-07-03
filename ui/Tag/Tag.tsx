import * as React from "react";
import { cn } from "@/lib/utils";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-[12px] py-[6px] text-xs font-medium bg-secondary text-secondary-foreground",
        className
      )}
      {...props}
    />
  );
});
Tag.displayName = "Tag";

export { Tag };

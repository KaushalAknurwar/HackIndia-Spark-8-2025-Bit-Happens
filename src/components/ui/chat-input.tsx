import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ChatInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>{
  onEnter?: () => void;
}

const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ className, onEnter, onKeyDown, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onEnter?.();
      }
      onKeyDown?.(e);
    };

    return (
      <Textarea
        autoComplete="off"
        ref={ref}
        name="message"
        onKeyDown={handleKeyDown}
        rows={1}
        className={cn(
          "max-h-12 px-4 py-3 bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-md flex items-center h-16 resize-none",
          className,
        )}
        {...props}
      />
    );
  }
);
ChatInput.displayName = "ChatInput";

export { ChatInput }; 
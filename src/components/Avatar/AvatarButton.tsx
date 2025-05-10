import React from 'react';
import { Button } from '@/components/ui/button';
import { UserCircle } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import AvatarCustomizer from './AvatarCustomizer';

const AvatarButton = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="relative hover:bg-secondary/80"
        >
          <UserCircle className="h-6 w-6" />
          <span className="sr-only">Open avatar customization</span>
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary animate-pulse" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[90vw] sm:max-w-[540px]">
        <SheetHeader>
          <SheetTitle>My Virtual Companion</SheetTitle>
          <SheetDescription>
            Customize your avatar and track your wellness journey together!
          </SheetDescription>
        </SheetHeader>
        <AvatarCustomizer />
      </SheetContent>
    </Sheet>
  );
};

export default AvatarButton;
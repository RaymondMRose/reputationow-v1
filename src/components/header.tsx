import React from 'react';
import { AuthButton } from './auth-button';
import { PenSquare } from 'lucide-react';

export function Header() {
  return (
    <header className="py-4 px-4 md:px-6 bg-card border-b sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <PenSquare className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Review Hub</h1>
        </div>
        <AuthButton />
      </div>
    </header>
  );
}

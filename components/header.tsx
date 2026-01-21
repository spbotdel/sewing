"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary flex items-center justify-center">
              <svg viewBox="0 0 40 40" className="w-6 h-6 md:w-8 md:h-8">
                <path
                  d="M20 5 L35 15 L35 30 L20 35 L5 30 L5 15 Z"
                  fill="none"
                  stroke="#F5F0E6"
                  strokeWidth="2"
                />
                <path
                  d="M12 18 L20 28 L28 18"
                  fill="none"
                  stroke="#F5F0E6"
                  strokeWidth="2.5"
                />
                <circle cx="20" cy="12" r="3" fill="#F5F0E6" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <span className="font-sans font-bold text-lg md:text-xl tracking-wider">
                ПРОИЗВОДСТВО
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#target"
              className="font-sans text-sm uppercase tracking-widest hover:text-primary transition-colors"
            >
              КОМУ ПОДХОДИМ
            </a>
            <a
              href="#services"
              className="font-sans text-sm uppercase tracking-widest hover:text-primary transition-colors"
            >
              СПЕЦИАЛИЗАЦИЯ
            </a>
            <a
              href="#process"
              className="font-sans text-sm uppercase tracking-widest hover:text-primary transition-colors"
            >
              ПРОЦЕСС
            </a>
            <a
              href="#faq"
              className="font-sans text-sm uppercase tracking-widest hover:text-primary transition-colors"
            >
              FAQ
            </a>
            <a
              href="#blog"
              className="font-sans text-sm uppercase tracking-widest hover:text-primary transition-colors"
            >
              БЛОГ
            </a>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a
              href="#application"
              className="bg-primary text-primary-foreground px-6 py-3 font-sans font-bold uppercase tracking-wider text-sm hover:bg-primary/90 transition-colors border-2 border-primary hover:border-primary-foreground"
            >
              ЗАЯВКА
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 hover:bg-primary/20 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-secondary border-t-4 border-primary">
          <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
            <a
              href="#target"
              className="font-sans text-lg uppercase tracking-widest py-2 border-b border-secondary-foreground/20"
              onClick={() => setIsMenuOpen(false)}
            >
              КОМУ ПОДХОДИМ
            </a>
            <a
              href="#services"
              className="font-sans text-lg uppercase tracking-widest py-2 border-b border-secondary-foreground/20"
              onClick={() => setIsMenuOpen(false)}
            >
              СПЕЦИАЛИЗАЦИЯ
            </a>
            <a
              href="#process"
              className="font-sans text-lg uppercase tracking-widest py-2 border-b border-secondary-foreground/20"
              onClick={() => setIsMenuOpen(false)}
            >
              ПРОЦЕСС
            </a>
            <a
              href="#faq"
              className="font-sans text-lg uppercase tracking-widest py-2 border-b border-secondary-foreground/20"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </a>
            <a
              href="#blog"
              className="font-sans text-lg uppercase tracking-widest py-2 border-b border-secondary-foreground/20"
              onClick={() => setIsMenuOpen(false)}
            >
              БЛОГ
            </a>
            <a
              href="#application"
              className="bg-primary text-primary-foreground px-6 py-4 font-sans font-bold uppercase tracking-wider text-center mt-4"
              onClick={() => setIsMenuOpen(false)}
            >
              ОСТАВИТЬ ЗАЯВКУ
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

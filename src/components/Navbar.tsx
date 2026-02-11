"use client";

import { useState } from "react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 text-lg font-bold">
          <span className="text-emerald-500 text-2xl">◈</span>
          <span>InvoiceZen</span>
        </a>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <a
            href="/templates"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            Templates
          </a>
          <a
            href="/#pricing"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            Pricing
          </a>
          <a href="/create" className="btn-primary text-sm !py-2 !px-4">
            Create Invoice
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-muted hover:text-foreground transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-strong border-t border-glass-border">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3">
            <a
              href="/templates"
              className="text-sm text-muted hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Templates
            </a>
            <a
              href="/#pricing"
              className="text-sm text-muted hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <a
              href="/create"
              className="btn-primary text-sm !py-2 !px-4 text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Create Invoice
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

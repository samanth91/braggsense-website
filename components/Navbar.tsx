"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/technology", label: "Technology" },
  { href: "/solutions", label: "Solutions" },
  { href: "/products", label: "Products" },
  { href: "/company", label: "Company" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a1628]/95 backdrop-blur-lg border-b border-white/10">
      <div className="container flex h-20 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <img 
            src="/images/companylogo.jpeg" 
            alt="BraggSense Technologies" 
            className="h-9 w-auto object-contain"
          />
          <div>
            <div className="font-semibold text-xl tracking-[-0.02em] group-hover:text-[#00c4d4] transition-colors">
              BraggSense
            </div>
            <div className="text-[10px] text-slate-400 -mt-1.5 tracking-[2px] font-mono">TECHNOLOGIES</div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link text-slate-200 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/contact"
            className="btn-secondary px-5 py-2.5 rounded-full text-sm font-semibold"
          >
            Contact
          </Link>
          <Link
            href="/products"
            className="btn-primary px-6 py-2.5 rounded-full text-sm font-semibold"
          >
            Explore Products
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-slate-200 hover:text-white"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0a1628]">
          <div className="container py-8 flex flex-col gap-6 text-lg font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-slate-200 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-3 border-t border-white/10">
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="btn-secondary text-center py-3 rounded-full text-base font-semibold"
              >
                Contact Us
              </Link>
              <Link
                href="/products"
                onClick={() => setMobileOpen(false)}
                className="btn-primary text-center py-3 rounded-full text-base font-semibold"
              >
                Explore Products
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

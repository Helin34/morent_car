'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/cars?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/cars');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container-high/60">
      <div className="h-20 w-full px-margin-mobile md:px-margin max-w-[1440px] mx-auto flex items-center justify-between gap-space-md lg:gap-space-lg">
        {/* Brand Logo */}
        <div className="flex items-center gap-space-lg shrink-0">
          <Link className="flex items-center gap-space-sm" href="/">
            <span className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">
              MORENT
            </span>
          </Link>
        </div>

        {/* Global Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-xl mx-auto hidden md:flex items-center gap-space-sm px-space-md py-2.5 rounded-full bg-surface-container-low border border-transparent focus-within:border-primary/50 transition-colors"
        >
          <span className="material-symbols-outlined text-outline text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Bir araç, marka veya gövde tipi arayın..."
            className="w-full bg-transparent border-0 outline-none text-on-surface placeholder:text-outline font-body-md text-body-md"
          />
          <button
            type="submit"
            className="p-1 rounded-full hover:bg-surface-container text-outline hover:text-on-surface transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Filtrele ve Ara"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
          </button>
        </form>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-space-sm shrink-0">
          <Link
            className="font-label-md text-label-md text-on-surface hover:text-primary px-3 py-1.5 transition-colors"
            href="/"
          >
            Ana Sayfa
          </Link>
          <Link
            className="font-label-md text-label-md text-on-surface-variant hover:text-primary px-3 py-1.5 transition-colors"
            href="/cars"
          >
            Araç Kataloğu
          </Link>
        </nav>

        {/* Right Action Icons & User Profile */}
        <div className="flex items-center gap-space-sm shrink-0">
          <Link
            href="/cars"
            aria-label="Favoriler"
            className="relative w-10 h-10 rounded-full bg-surface-container-lowest border border-outline-variant/30 shadow-[0_1px_8px_rgba(0,0,0,0.04)] flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">favorite</span>
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary rounded-full"></span>
          </Link>

          <button
            type="button"
            aria-label="Bildirimler"
            className="relative w-10 h-10 rounded-full bg-surface-container-lowest border border-outline-variant/30 shadow-[0_1px_8px_rgba(0,0,0,0.04)] flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-tertiary rounded-full"></span>
          </button>

          {/* User Profile / Auth State */}
          {session?.user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-space-xs pl-space-xs cursor-pointer focus:outline-none"
              >
                <div className="w-9 h-9 rounded-full bg-primary text-on-primary font-bold text-sm flex items-center justify-center shadow-sm">
                  {session.user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="material-symbols-outlined text-outline text-[18px]">
                  expand_more
                </span>
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/20 py-2 z-50">
                  <div className="px-4 py-2 border-b border-surface-container-high">
                    <p className="font-label-md text-label-md text-on-surface font-semibold truncate">
                      {session.user.name}
                    </p>
                    <p className="font-body-sm text-body-sm text-outline truncate">
                      {session.user.email}
                    </p>
                  </div>
                  <Link
                    href="/bookings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-4 py-2 font-body-sm text-on-surface hover:bg-surface-container-low transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">directions_car</span>
                    <span>Rezervasyonlarım</span>
                  </Link>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 font-body-sm text-error hover:bg-error-container/20 transition-colors text-left cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    <span>Çıkış Yap</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3 py-1.5 font-label-md text-label-md text-on-surface hover:text-primary transition-colors font-medium"
              >
                Giriş Yap
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md shadow-sm transition-all font-semibold"
              >
                Kayıt Ol
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

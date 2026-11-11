import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-surface-container-high/60 pt-space-xl pb-space-lg">
      <div className="w-full px-margin-mobile md:px-margin max-w-[1440px] mx-auto flex flex-col gap-space-xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-xl">
          {/* Brand Info */}
          <div className="lg:col-span-2 flex flex-col gap-space-sm">
            <Link href="/" className="flex items-center gap-space-sm">
              <span className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">
                MORENT
              </span>
            </Link>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
              Vizyonumuz, araç kiralamada konfor ve pratiklik sunarak güvenilir ve yenilikçi bir yol arkadaşı olmaktır.
            </p>
          </div>

          {/* Nav Links Column 1: About */}
          <div className="flex flex-col gap-space-sm">
            <h4 className="font-headline-md text-headline-md text-on-surface font-bold">
              Hakkında
            </h4>
            <div className="flex flex-col gap-2.5">
              <Link href="#" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors">
                Nasıl Çalışır
              </Link>
              <Link href="/cars" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors">
                Öne Çıkanlar
              </Link>
              <Link href="#" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors">
                Ortaklıklar
              </Link>
              <Link href="#" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors">
                İş İlişkileri
              </Link>
            </div>
          </div>

          {/* Nav Links Column 2: Community */}
          <div className="flex flex-col gap-space-sm">
            <h4 className="font-headline-md text-headline-md text-on-surface font-bold">
              Topluluk
            </h4>
            <div className="flex flex-col gap-2.5">
              <Link href="#" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors">
                Etkinlikler
              </Link>
              <Link href="#" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors">
                Blog Yazıları
              </Link>
              <Link href="#" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors">
                Podcast
              </Link>
              <Link href="#" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors">
                Arkadaşını Davet Et
              </Link>
            </div>
          </div>

          {/* Nav Links Column 3: Socials */}
          <div className="flex flex-col gap-space-sm">
            <h4 className="font-headline-md text-headline-md text-on-surface font-bold">
              Sosyal Medya
            </h4>
            <div className="flex flex-col gap-2.5">
              <a href="#" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors">
                Discord
              </a>
              <a href="#" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors">
                Instagram
              </a>
              <a href="#" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors">
                Twitter (X)
              </a>
              <a href="#" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors">
                Facebook
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-space-md border-t border-surface-container-high flex flex-col sm:flex-row items-center justify-between gap-space-sm">
          <p className="font-body-sm text-body-sm text-on-surface font-semibold">
            ©2026 MORENT. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-space-lg">
            <a href="#" className="font-body-sm text-body-sm text-on-surface font-semibold hover:text-primary transition-colors">
              Gizlilik Politikası
            </a>
            <a href="#" className="font-body-sm text-body-sm text-on-surface font-semibold hover:text-primary transition-colors">
              Şartlar &amp; Koşullar
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

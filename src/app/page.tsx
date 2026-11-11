import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BookingWidget from '@/components/home/BookingWidget';
import CarCard, { CarItemProps } from '@/components/cars/CarCard';
import connectToDatabase from '@/lib/mongodb';
import Car from '@/models/Car';
import { initialCars } from '@/lib/seedData';

async function getHomeCars(): Promise<{
  popularCars: CarItemProps[];
  recommendedCars: CarItemProps[];
}> {
  try {
    await connectToDatabase();
    const [popularDocs, recommendedDocs] = await Promise.all([
      Car.find({ isPopular: true, availability: true }).limit(4).lean(),
      Car.find({ availability: true }).limit(8).lean(),
    ]);

    if (popularDocs.length > 0) {
      return {
        popularCars: JSON.parse(JSON.stringify(popularDocs)),
        recommendedCars: JSON.parse(JSON.stringify(recommendedDocs)),
      };
    }
  } catch (error) {
    console.warn('Database not connected yet or empty, using seed dataset fallback:', error);
  }

  // Fallback to initialCars seed data if database is still empty or initializing
  const popularFallback = initialCars.filter((c) => c.isPopular).slice(0, 4);
  const recommendedFallback = initialCars.slice(0, 8);

  return {
    popularCars: popularFallback.map((c, i) => ({
      _id: `fallback-${i}`,
      ...c,
    })),
    recommendedCars: recommendedFallback.map((c, i) => ({
      _id: `fallback-rec-${i}`,
      ...c,
    })),
  };
}

export default async function HomePage() {
  const { popularCars, recommendedCars } = await getHomeCars();

  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <Navbar />

      <main className="w-full pt-24 bg-background min-h-screen flex-1">
        <div className="w-full px-margin-mobile md:px-margin max-w-[1440px] mx-auto py-space-md md:py-space-lg flex flex-col gap-space-xl">
          {/* 1. Hero Dual Promotional Cards */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg w-full">
            {/* Promotional Card 1: Electric Blue */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-container via-surface-tint to-primary text-on-primary p-space-lg md:p-space-xl shadow-lg flex flex-col justify-between min-h-[360px] group border border-primary/20">
              {/* Fluid Decorative Accent */}
              <svg
                className="absolute -right-16 -bottom-20 w-96 h-96 opacity-15 pointer-events-none transform rotate-12 transition-transform duration-700 group-hover:scale-105"
                fill="none"
                viewBox="0 0 400 400"
              >
                <circle
                  cx="200"
                  cy="200"
                  r="180"
                  stroke="currentColor"
                  strokeDasharray="24 16"
                  strokeWidth="32"
                ></circle>
                <circle cx="200" cy="200" r="120" stroke="currentColor" strokeWidth="16"></circle>
                <circle cx="200" cy="200" fill="currentColor" r="60"></circle>
              </svg>

              <div className="relative z-10 max-w-sm flex flex-col gap-space-sm">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-spec-code font-spec-code uppercase tracking-wider text-on-primary w-fit font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                  Ayrıcalıklı Deneyim
                </span>
                <h1 className="font-headline-xl text-headline-xl text-on-primary leading-tight tracking-tight mt-1 font-bold">
                  Araç Kiralamanın En Kolay ve Güvenilir Yolu
                </h1>
                <p className="font-body-md text-body-md text-on-primary/90 mt-1">
                  Güvenli, şeffaf ve uygun fiyatlarla dilediğiniz lüks ya da spor aracı dakikalar içinde kiralayın.
                </p>
                <div className="mt-4">
                  <Link
                    href="/cars"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-inverse-surface hover:bg-on-surface text-inverse-on-surface font-label-md text-label-md shadow-md transition-all duration-200 hover:shadow-xl active:scale-95 font-semibold"
                  >
                    Araçları İncele
                  </Link>
                </div>
              </div>

              <div className="relative z-10 mt-6 flex justify-end items-end h-36 md:h-44">
                <img
                  className="max-h-full w-auto object-contain object-right-bottom drop-shadow-[0_20px_25px_rgba(0,0,0,0.35)] transform transition-transform duration-500 group-hover:scale-105"
                  alt="Spor Araç Kiralama"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMeKte7Eph1u55Q8ZuLnWD2wty_F8vDGlhERhJBxJu08dSMaC1XZBVWaNfewuvfWDYSWd77TUXJDI53fUiAd0jU2au5tdpBu6ktAe63bOEOuHMMCjoDQAPFzDydHeWAWBi7miPg5TJPCuoG02neE_iHx90cRlO3mUe_pFyBe3sRhWZKqRdZ_HzQH4uk5FvD0CnZWw61LWn1nX9vY68UDCbiuzAl8RtlWB_MfhUzrk"
                />
              </div>
            </div>

            {/* Promotional Card 2: Deep Slate / Tech Dark */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-inverse-surface via-[#1b2230] to-[#0e131d] text-inverse-on-surface p-space-lg md:p-space-xl shadow-lg flex flex-col justify-between min-h-[360px] group border border-outline/10">
              <svg
                className="absolute -right-20 -top-24 w-96 h-96 opacity-10 pointer-events-none transform -rotate-45"
                fill="none"
                viewBox="0 0 400 400"
              >
                <rect height="300" rx="40" stroke="currentColor" strokeWidth="24" width="300" x="50" y="50"></rect>
                <rect height="200" rx="28" stroke="currentColor" strokeWidth="16" width="200" x="100" y="100"></rect>
                <circle cx="200" cy="200" fill="currentColor" r="48"></circle>
              </svg>

              <div className="relative z-10 max-w-sm flex flex-col gap-space-sm">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md text-spec-code font-spec-code uppercase tracking-wider text-secondary-container w-fit font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>
                  Kesintisiz Ulaşım
                </span>
                <h2 className="font-headline-xl text-headline-xl text-inverse-on-surface leading-tight tracking-tight mt-1 font-bold">
                  Avantajlı Fiyatlarla Yolculuğa Başlayın
                </h2>
                <p className="font-body-md text-body-md text-inverse-on-surface/90 mt-1">
                  Her yolculuk için temiz, güvenli ve konforlu araç filomuzla hizmetinizdeyiz.
                </p>
                <div className="mt-4">
                  <Link
                    href="/cars"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary-container hover:bg-surface-tint text-on-primary font-label-md text-label-md shadow-md transition-all duration-200 hover:shadow-xl active:scale-95 font-semibold"
                  >
                    Hemen Kirala
                  </Link>
                </div>
              </div>

              <div className="relative z-10 mt-6 flex justify-end items-end h-36 md:h-44">
                <img
                  className="max-h-full w-auto object-contain object-right-bottom drop-shadow-[0_20px_25px_rgba(0,0,0,0.5)] transform transition-transform duration-500 group-hover:scale-105"
                  alt="Lüks SUV Kiralama"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA853EdBLRuUlOiJ_mGJ3P4lW3BzYJtiVusakEL9OG8lnkUyQuMaCqHd53_k1Ke-WUlt6ZXoQXjMERlgQg9fO8gS8iz8GQbTp86hxfjoCmAzTu5Ehi3cxQfbd_3vi_nG4Ot-oWjCQlrGBjvrrQC2zvrQ-WIs-UCa4hvTgPLT1isT0M15a-bm3UbptI5ivneoYZ0cJiIPgGrb0c8k_1HlO2ImBjpnqn89OkQ0nqQ-tE"
                />
              </div>
            </div>
          </section>

          {/* 2. Interactive Booking Selector (Pick-up & Drop-off Widget) */}
          <BookingWidget />

          {/* 3. Popular Cars Section */}
          <section className="flex flex-col gap-space-md">
            <div className="flex items-center justify-between px-space-xs">
              <span className="font-label-md text-label-md text-outline font-semibold">
                Popüler Araçlar
              </span>
              <Link
                href="/cars?popular=true"
                className="font-label-md text-label-md text-primary hover:underline font-semibold transition-colors"
              >
                Tümünü Gör
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
              {popularCars.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          </section>

          {/* 4. Recommended Cars Section */}
          <section className="flex flex-col gap-space-md">
            <div className="flex items-center justify-between px-space-xs">
              <span className="font-label-md text-label-md text-outline font-semibold">
                Tavsiye Edilen Araçlar
              </span>
              <Link
                href="/cars"
                className="font-label-md text-label-md text-primary hover:underline font-semibold transition-colors"
              >
                Tümünü Gör
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
              {recommendedCars.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>

            {/* Show More CTA */}
            <div className="w-full flex justify-center py-space-md relative">
              <Link
                href="/cars"
                className="px-6 py-3 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                Tüm Araç Kataloğunu İncele
              </Link>
              <span className="absolute right-0 top-1/2 -translate-y-1/2 font-label-md text-label-md text-outline hidden sm:inline">
                {recommendedCars.length + popularCars.length} Araç Gösteriliyor
              </span>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

import React, { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CarCard, { CarItemProps } from '@/components/cars/CarCard';
import CarDetailClient from './CarDetailClient';
import connectToDatabase from '@/lib/mongodb';
import Car from '@/models/Car';
import { initialCars } from '@/lib/seedData';

async function getCarData(slug: string) {
  try {
    await connectToDatabase();
    const carDoc = await Car.findOne({ slug: slug.toLowerCase() }).lean();
    if (carDoc) {
      const relatedDocs = await Car.find({
        _id: { $ne: carDoc._id },
        $or: [{ type: carDoc.type }, { brand: carDoc.brand }],
        availability: true,
      })
        .limit(4)
        .lean();

      return {
        car: JSON.parse(JSON.stringify(carDoc)),
        related: JSON.parse(JSON.stringify(relatedDocs)),
      };
    }
  } catch (error) {
    console.warn('DB fallback used for car data:', error);
  }

  // Fallback to initialCars
  const foundSeed = initialCars.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
  if (!foundSeed) {
    return null;
  }

  const relatedSeed = initialCars
    .filter((c) => c.slug !== foundSeed.slug && (c.type === foundSeed.type || c.brand === foundSeed.brand))
    .slice(0, 4);

  return {
    car: { _id: `seed-${foundSeed.slug}`, ...foundSeed },
    related: relatedSeed.map((c, i) => ({ _id: `seed-rel-${i}`, ...c })),
  };
}

async function CarDetailContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getCarData(slug);

  if (!result || !result.car) {
    notFound();
  }

  const { car, related } = result;

  return (
    <div className="w-full max-w-[1440px] mx-auto px-margin-mobile md:px-margin py-6 flex flex-col gap-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-body-sm text-outline">
        <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-[18px]">home</span>
          <span>Ana Sayfa</span>
        </Link>
        <span>/</span>
        <Link href="/cars" className="hover:text-primary transition-colors">
          Araç Kataloğu
        </Link>
        <span>/</span>
        <span className="text-on-surface-variant">{car.type}</span>
        <span>/</span>
        <span className="text-primary font-bold">{car.name}</span>
      </nav>

      {/* Interactive Client Gallery & Booking Component */}
      <CarDetailClient car={car} />

      {/* Recent / Related Cars Section */}
      {related.length > 0 && (
        <section className="flex flex-col gap-space-md mt-6">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
              Benzer / Önerilen Araçlar
            </h3>
            <Link
              href="/cars"
              className="font-label-md text-label-md text-primary hover:underline font-semibold"
            >
              Tümünü Gör
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
            {related.map((relCar: CarItemProps) => (
              <CarCard key={relCar._id} car={relCar} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function CarDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <Navbar />
      <main className="w-full pt-24 bg-background min-h-screen flex-1">
        <Suspense
          fallback={
            <div className="w-full py-24 flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          }
        >
          <CarDetailContent params={params} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

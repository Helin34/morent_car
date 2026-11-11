'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getCarImage } from '@/lib/carImages';
import { useSession } from 'next-auth/react';

interface BookingItem {
  _id: string;
  car: {
    _id: string;
    name: string;
    brand: string;
    type: string;
    pricePerDay: number;
    slug: string;
    assetId: string;
  };
  pickupLocation: string;
  pickupDate: string;
  pickupTime: string;
  dropoffLocation: string;
  dropoffDate: string;
  dropoffTime: string;
  totalDays: number;
  totalPrice: number;
  paymentStatus: string;
  status: string;
  createdAt: string;
}

export default function BookingsPage() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch('/api/bookings');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setBookings(json.data);
        }
      } catch (err) {
        console.error('Fetch bookings error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBookings();
  }, []);

  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <Navbar />

      <main className="w-full pt-24 bg-background min-h-screen flex-1">
        <div className="w-full max-w-[1440px] mx-auto px-margin-mobile md:px-margin py-8 flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-container-high pb-4">
            <div>
              <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold">
                Araç Rezervasyonlarım
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Geçmiş ve aktif araç kiralama rezervasyonlarınızı buradan takip edebilirsiniz.
              </p>
            </div>
            <Link
              href="/cars"
              className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold self-start sm:self-auto transition-all"
            >
              Yeni Araç Kirala
            </Link>
          </div>

          {/* Bookings List */}
          {isLoading ? (
            <div className="flex justify-center items-center py-24">
              <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4 border border-outline-variant/20 shadow-sm max-w-xl mx-auto my-12">
              <span className="material-symbols-outlined text-[64px] text-outline">
                directions_car
              </span>
              <h3 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                Henüz Bir Rezervasyonunuz Bulunmuyor
              </h3>
              <p className="font-body-md text-body-md text-outline">
                Filomuzdaki lüks ve spor araçları keşfederek ilk rezervasyonunuzu hemen oluşturabilirsiniz.
              </p>
              <Link
                href="/cars"
                className="mt-2 px-6 py-3 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-bold shadow-md hover:shadow-lg transition-all"
              >
                Araç Kataloğunu İncele
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {bookings.map((booking) => {
                const carImage = getCarImage(booking.car?.slug || booking.car?.assetId);
                return (
                  <div
                    key={booking._id}
                    className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/20 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:shadow-md transition-shadow"
                  >
                    {/* Car Info & Photo */}
                    <div className="flex items-center gap-5">
                      <div className="w-28 h-20 bg-surface-container-low rounded-xl p-2 flex items-center justify-center shrink-0">
                        <img
                          src={carImage.src}
                          alt={booking.car?.name || 'Car'}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-spec-code text-spec-code text-outline uppercase font-mono">
                          Rez No: {booking._id.substring(booking._id.length - 8).toUpperCase()}
                        </span>
                        <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                          {booking.car?.name || 'Morent Araç'}
                        </h3>
                        <span className="font-label-sm text-label-sm text-primary font-medium">
                          {booking.car?.type} • ${booking.car?.pricePerDay}/gün
                        </span>
                      </div>
                    </div>

                    {/* Schedule & Location */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-body-sm">
                      <div className="flex flex-col p-2.5 rounded-lg bg-surface-container-low/60">
                        <span className="font-label-sm text-label-sm text-primary font-bold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-primary"></span>
                          Alış: {booking.pickupLocation}
                        </span>
                        <span className="text-outline text-xs mt-0.5">
                          {new Date(booking.pickupDate).toLocaleDateString('tr-TR')} • {booking.pickupTime}
                        </span>
                      </div>
                      <div className="flex flex-col p-2.5 rounded-lg bg-surface-container-low/60">
                        <span className="font-label-sm text-label-sm text-secondary font-bold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-secondary"></span>
                          İade: {booking.dropoffLocation}
                        </span>
                        <span className="text-outline text-xs mt-0.5">
                          {new Date(booking.dropoffDate).toLocaleDateString('tr-TR')} • {booking.dropoffTime}
                        </span>
                      </div>
                    </div>

                    {/* Price & Status */}
                    <div className="flex items-center justify-between lg:flex-col lg:items-end gap-2 border-t lg:border-t-0 border-surface-container-high pt-3 lg:pt-0">
                      <div className="flex flex-col lg:text-right">
                        <span className="font-headline-lg text-headline-lg font-bold text-primary">
                          ${booking.totalPrice.toFixed(2)}
                        </span>
                        <span className="font-body-sm text-body-sm text-outline">
                          {booking.totalDays} Günlük Kiralama
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-surface-container font-label-sm text-label-sm text-primary font-bold">
                          {booking.status === 'confirmed' ? 'Onaylandı' : booking.status}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-label-sm text-label-sm">
                          Ödeme: {booking.paymentStatus === 'pending' ? 'Beklemede' : 'Tamamlandı'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

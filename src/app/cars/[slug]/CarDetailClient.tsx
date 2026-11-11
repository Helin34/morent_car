'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCarImage } from '@/lib/carImages';
import { turkeyLocations } from '@/lib/seedData';

interface CarDetailClientProps {
  car: {
    _id: string;
    name: string;
    brand: string;
    type: string;
    gasolineCapacity: number;
    steering: string;
    seatCapacity: number;
    pricePerDay: number;
    discountPricePerDay?: number;
    description: string;
    features: string[];
    slug: string;
    assetId: string;
    rating: number;
    reviewCount: number;
  };
}

const mockReviews = [
  {
    id: 1,
    name: 'Alex Stanton',
    role: 'Şirket Yöneticisi',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAMzoyVOmhr-14wBE2PYUMSoioI4tnQ8RqUs_zbYRjv8cgdfLjAT0QMwnjkmOuDUD1xp4h2GrEmVqd-fYm9_B_hBcOsaWGx5028tDUz4fYYnkJD0WFRtsI1aaJJOivo5PEadJWoAlRYzTQ_dF6a4G1ZhgbaM7kdRJ3NfUX_Zcd2-3D2y5vkGlmaSt-Is_4zw8lgLPik6iY1EimHTanSTCGMZI3fMyLh3uY0MHwYYtE',
    date: '21 Temmuz 2024',
    rating: 5,
    comment:
      'MORENT uygulamasından ve araç teslim sürecinden çok memnun kaldık. Araç tertemiz, deposu dolu ve mükemmel durumda teslim edildi. Virajlı dağ yollarında vites geçişleri kusursuzdu. Şirket seyahatlerimizde kesinlikle tekrar kiralayacağız!',
  },
  {
    id: 2,
    name: 'Skylar Dias',
    role: 'Pazarlama Direktörü',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCbXFw2Ha0Cw7pfmAe8jHCVC94i0Wns_eFnfKX_eRK5UA_CO9N02BW9eADOJXqWmPbXiIw8WtZIPgtw1c4gjVsPuDJgefOL3iCXICvWlshZhU5eiayZtRH6lN3EKLxyJYqGNiczpE09xUIOPAN0ABkXcr48ApwkJ1L8g1b4vvfpF7Z5ZEs1B25CXAg8j7kw37iL2ICbqpeGcDEsKRksLqQglwVcbj6dtHFngrjGb_c',
    date: '20 Temmuz 2024',
    rating: 5,
    comment:
      'Hafta sonu kaçamağı için bu aracı tercih etmek harika bir karardı. Egzoz sesi büyüleyici, otoyol virajlarındaki kararlılık ve fren güvenliği üst seviyede. Şiddetle tavsiye ederim!',
  },
];

export default function CarDetailClient({ car }: CarDetailClientProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedThumb, setSelectedThumb] = useState(0);

  // Reservation Modal & Flow State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pickupLoc, setPickupLoc] = useState(turkeyLocations[0]);
  const [pickupDate, setPickupDate] = useState('2026-11-10');
  const [pickupTime, setPickupTime] = useState('09:00');
  const [dropoffLoc, setDropoffLoc] = useState(turkeyLocations[1]);
  const [dropoffDate, setDropoffDate] = useState('2026-11-13');
  const [dropoffTime, setDropoffTime] = useState('18:00');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<{
    id?: string;
    totalPrice?: number;
    status?: string;
    paymentStatus?: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const mainImageMeta = getCarImage(car.slug || car.assetId);

  // Calculate rental days and total
  const startDate = new Date(pickupDate);
  const endDate = new Date(dropoffDate);
  const days = Math.max(
    1,
    Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  );
  const totalPrice = days * car.pricePerDay;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const payload = {
      carId: car._id,
      carName: car.name,
      carBrand: car.brand,
      carType: car.type,
      carSlug: car.slug,
      pricePerDay: car.pricePerDay,
      discountPricePerDay: car.discountPricePerDay,
      pickupLocation: pickupLoc,
      pickupDate,
      pickupTime,
      dropoffLocation: dropoffLoc,
      dropoffDate,
      dropoffTime,
      days,
      totalPrice,
      notes,
    };

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.url) {
        // Kullanıcının checkout endpoint'i bir url döndürüyor, oraya yönlendir
        const checkoutParams = new URLSearchParams({
          carId: car._id,
          carName: car.name,
          carBrand: car.brand,
          carType: car.type,
          carSlug: car.slug,
          pricePerDay: String(car.pricePerDay),
          ...(car.discountPricePerDay ? { discountPricePerDay: String(car.discountPricePerDay) } : {}),
          pickupLocation: pickupLoc,
          pickupDate,
          pickupTime,
          dropoffLocation: dropoffLoc,
          dropoffDate,
          dropoffTime,
          days: String(days),
          totalPrice: String(totalPrice),
          notes,
        });
        router.push(`/checkout?${checkoutParams.toString()}`);
      } else if (!res.ok) {
        setErrorMessage(data.error || 'Ödeme sayfasına yönlendirilemedi.');
        setIsSubmitting(false);
      } else {
        // url yoksa direkt checkout sayfasına git
        const checkoutParams = new URLSearchParams({
          carId: car._id,
          carName: car.name,
          carBrand: car.brand,
          carType: car.type,
          carSlug: car.slug,
          pricePerDay: String(car.pricePerDay),
          ...(car.discountPricePerDay ? { discountPricePerDay: String(car.discountPricePerDay) } : {}),
          pickupLocation: pickupLoc,
          pickupDate,
          pickupTime,
          dropoffLocation: dropoffLoc,
          dropoffDate,
          dropoffTime,
          days: String(days),
          totalPrice: String(totalPrice),
          notes,
        });
        router.push(`/checkout?${checkoutParams.toString()}`);
      }
    } catch {
      // Endpoint erişilemese bile checkout sayfasına yönlendir
      const checkoutParams = new URLSearchParams({
        carId: car._id,
        carName: car.name,
        carBrand: car.brand,
        carType: car.type,
        carSlug: car.slug,
        pricePerDay: String(car.pricePerDay),
        ...(car.discountPricePerDay ? { discountPricePerDay: String(car.discountPricePerDay) } : {}),
        pickupLocation: pickupLoc,
        pickupDate,
        pickupTime,
        dropoffLocation: dropoffLoc,
        dropoffDate,
        dropoffTime,
        days: String(days),
        totalPrice: String(totalPrice),
        notes,
      });
      router.push(`/checkout?${checkoutParams.toString()}`);
    }
  };

  return (
    <>
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Hero Banner + Thumbnails */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Interactive Hero Showcase Card */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary via-primary-container to-surface-tint text-on-primary p-6 md:p-8 shadow-xl min-h-[360px] md:min-h-[420px] flex flex-col justify-between">
            <div className="relative z-10 max-w-md">
              <span className="inline-block px-3 py-1 rounded-full bg-on-primary/15 backdrop-blur-md font-spec-code text-spec-code tracking-wider uppercase mb-3 font-bold">
                Seçkin Performans Serisi
              </span>
              <h1 className="font-headline-xl text-[26px] md:text-headline-xl leading-tight font-bold tracking-tight mb-2">
                En İyi Tasarım ve Hızlanmaya Sahip Spor Araç
              </h1>
              <p className="font-body-md text-body-md text-on-primary/80 line-clamp-2 max-w-sm">
                Güvenlik, dinamik konfor ve üstün sürüş dengesi bir arada.
              </p>
            </div>

            {/* Car Main Display Image */}
            <div className="relative w-full h-56 md:h-64 mt-4 flex items-center justify-center">
              <img
                src={mainImageMeta.src}
                alt={car.name}
                className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,10,40,0.45)] transition-all duration-300"
              />
            </div>

            {/* Ambient Decorative Glow */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none"></div>
            <div className="absolute -left-10 top-0 w-64 h-64 rounded-full bg-surface-container-lowest/10 blur-2xl pointer-events-none"></div>
          </div>

          {/* Thumbnail Gallery Strip */}
          <div className="grid grid-cols-4 gap-3 md:gap-4">
            {['Ön Görünüm', 'İç Mekan', 'Kokpit', 'Arka Profil'].map((label, idx) => (
              <button
                key={label}
                type="button"
                onClick={() => setSelectedThumb(idx)}
                className={`group relative rounded-xl bg-surface-container-lowest p-2 shadow-sm transition-all duration-200 cursor-pointer ${
                  selectedThumb === idx
                    ? 'ring-2 ring-primary'
                    : 'ring-0 hover:shadow-md'
                }`}
              >
                <div className="w-full h-16 md:h-20 rounded-lg overflow-hidden bg-surface-container-low flex items-center justify-center p-1">
                  <img
                    src={mainImageMeta.src}
                    alt={label}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span
                  className={`block mt-1 text-center font-spec-code text-spec-code uppercase ${
                    selectedThumb === idx ? 'text-primary font-bold' : 'text-outline'
                  }`}
                >
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Vehicle Overview & Technical Specs */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="rounded-xl bg-surface-container-lowest p-6 md:p-8 shadow-sm border border-outline-variant/15 flex flex-col justify-between">
            {/* Top Row: Title, Fav, Status */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container font-spec-code text-spec-code text-primary uppercase font-bold">
                      {car.brand}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container-low text-secondary font-label-sm text-label-sm font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                      Onaylı Araç
                    </span>
                  </div>
                  <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">
                    {car.name}
                  </h2>
                </div>

                {/* Favorite Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsFavorite(!isFavorite)}
                  aria-label="Favorilere ekle"
                  className="w-11 h-11 rounded-full bg-surface-container-low hover:bg-surface-container text-tertiary-container flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                >
                  <span
                    className={`material-symbols-outlined text-[24px] ${
                      isFavorite ? 'text-error' : 'text-outline'
                    }`}
                    style={{ fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    favorite
                  </span>
                </button>
              </div>

              {/* Reviews and Rating Row */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <span className="font-label-md text-label-md font-bold text-on-surface">
                  {car.rating || 4.9}
                </span>
                <span className="font-body-md text-body-md text-on-surface-variant">
                  ({car.reviewCount || 440}+ Değerlendirme)
                </span>
                <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                <span className="font-label-sm text-label-sm text-secondary font-semibold">
                  %98 Memnuniyet
                </span>
              </div>

              {/* Description */}
              <p className="font-body-md text-body-md text-on-surface-variant mt-4 leading-relaxed">
                {car.description}
              </p>

              {/* Technical Specification Metric Grid */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 my-6 py-5 bg-surface-container-low/60 rounded-xl px-5">
                <div className="flex items-center justify-between">
                  <span className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-outline">
                      directions_car
                    </span>
                    Gövde Tipi
                  </span>
                  <span className="font-label-md text-label-md font-semibold text-on-surface">
                    {car.type}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-outline">
                      group
                    </span>
                    Kapasite
                  </span>
                  <span className="font-label-md text-label-md font-semibold text-on-surface">
                    {car.seatCapacity} Kişi
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-outline">
                      tune
                    </span>
                    Vites
                  </span>
                  <span className="font-label-md text-label-md font-semibold text-on-surface">
                    {car.steering === 'Manual' ? 'Manuel' : 'Otomatik'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-outline">
                      local_gas_station
                    </span>
                    Yakıt / Menzil
                  </span>
                  <span className="font-label-md text-label-md font-semibold text-on-surface">
                    {car.gasolineCapacity > 0 ? `${car.gasolineCapacity}L` : 'Elektrikli'}
                  </span>
                </div>
              </div>

              {/* Features Tags */}
              {car.features && car.features.length > 0 && (
                <div className="flex flex-col gap-2 mb-6">
                  <span className="font-label-sm text-label-sm text-outline font-semibold uppercase">
                    Öne Çıkan Donanımlar
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {car.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-3 py-1 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface font-medium"
                      >
                        ✓ {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Price & Booking Button */}
            <div className="flex items-center justify-between gap-4 pt-6 border-t border-surface-container-high">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="font-headline-xl text-headline-xl font-bold text-on-surface">
                    ${car.pricePerDay.toFixed(2)}
                  </span>
                  <span className="font-body-md text-body-md text-outline">/ gün</span>
                </div>
                {car.discountPricePerDay && (
                  <span className="font-body-sm text-body-sm text-outline line-through">
                    ${car.discountPricePerDay.toFixed(2)}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setBookingResult(null);
                  setIsModalOpen(true);
                }}
                className="px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-bold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer"
              >
                Hemen Kirala
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="rounded-xl bg-surface-container-lowest p-6 md:p-8 shadow-sm border border-outline-variant/15 flex flex-col gap-6 mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
              Müşteri Değerlendirmeleri
            </h2>
            <span className="px-3 py-1 rounded-full bg-primary text-on-primary font-spec-code text-spec-code font-bold">
              {mockReviews.length}
            </span>
          </div>
          <span className="font-label-sm text-label-sm text-outline">
            En Yeni Yorumlar
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {mockReviews.map((rev) => (
            <div
              key={rev.id}
              className="flex flex-col gap-3 bg-surface-container-low/40 p-5 rounded-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="w-12 h-12 rounded-full object-cover shadow-sm"
                  />
                  <div>
                    <h4 className="font-headline-md text-headline-md text-on-surface font-bold">
                      {rev.name}
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {rev.role}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end">
                  <span className="font-label-sm text-label-sm text-outline">
                    {rev.date}
                  </span>
                  <div className="flex items-center text-amber-500 mt-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-[16px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed sm:pl-16">
                {rev.comment}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Reservation / Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl max-w-lg w-full p-6 md:p-8 relative animate-fadeIn border border-outline-variant/20">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-outline hover:text-on-surface p-1 rounded-full hover:bg-surface-container-low transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>

            {bookingResult ? (
              <div className="flex flex-col items-center text-center py-6 gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[36px]">check_circle</span>
                </div>
                <h3 className="font-headline-xl text-headline-xl text-on-surface font-bold">
                  Rezervasyon Talebiniz Alındı!
                </h3>
                <div className="p-4 rounded-xl bg-surface-container-low/70 text-left w-full text-body-md flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-outline">Rezervasyon No:</span>
                    <span className="font-bold font-mono text-primary">
                      {bookingResult.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-outline">Araç:</span>
                    <span className="font-semibold">{car.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-outline">Teslim Alış:</span>
                    <span>{pickupLoc} ({pickupDate})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-outline">Teslim İade:</span>
                    <span>{dropoffLoc} ({dropoffDate})</span>
                  </div>
                  <div className="flex justify-between border-t border-surface-container-high pt-2">
                    <span className="font-bold">Toplam Tutar:</span>
                    <span className="font-bold text-primary text-headline-md">
                      ${bookingResult.totalPrice?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-outline">
                    <span>Ödeme Durumu:</span>
                    <span className="font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                      Beklemede (Stripe Taslağı)
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mt-2 w-full py-3 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold cursor-pointer"
                >
                  Tamam
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="flex flex-col gap-4">
                <div>
                  <h3 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                    {car.name} Rezervasyonu
                  </h3>
                  <p className="font-body-sm text-body-sm text-outline">
                    Lütfen teslim alma ve iade detaylarını belirleyin.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-lg bg-error-container text-on-error-container text-body-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">error</span>
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Pickup Details */}
                <div className="flex flex-col gap-2 bg-surface-container-low/60 p-3 rounded-xl">
                  <span className="font-label-sm text-label-sm text-primary font-bold">
                    Teslim Alma (Alış)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <select
                      value={pickupLoc}
                      onChange={(e) => setPickupLoc(e.target.value)}
                      className="bg-surface-container-lowest p-2 rounded-lg text-body-sm border border-outline-variant/30 font-medium"
                    >
                      {turkeyLocations.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                    <div className="grid grid-cols-2 gap-1">
                      <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="bg-surface-container-lowest p-2 rounded-lg text-body-sm border border-outline-variant/30"
                      />
                      <select
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="bg-surface-container-lowest p-2 rounded-lg text-body-sm border border-outline-variant/30"
                      >
                        <option value="09:00">09:00</option>
                        <option value="12:00">12:00</option>
                        <option value="15:00">15:00</option>
                        <option value="18:00">18:00</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Dropoff Details */}
                <div className="flex flex-col gap-2 bg-surface-container-low/60 p-3 rounded-xl">
                  <span className="font-label-sm text-label-sm text-secondary font-bold">
                    Teslim Etme (İade)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <select
                      value={dropoffLoc}
                      onChange={(e) => setDropoffLoc(e.target.value)}
                      className="bg-surface-container-lowest p-2 rounded-lg text-body-sm border border-outline-variant/30 font-medium"
                    >
                      {turkeyLocations.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                    <div className="grid grid-cols-2 gap-1">
                      <input
                        type="date"
                        value={dropoffDate}
                        onChange={(e) => setDropoffDate(e.target.value)}
                        className="bg-surface-container-lowest p-2 rounded-lg text-body-sm border border-outline-variant/30"
                      />
                      <select
                        value={dropoffTime}
                        onChange={(e) => setDropoffTime(e.target.value)}
                        className="bg-surface-container-lowest p-2 rounded-lg text-body-sm border border-outline-variant/30"
                      >
                        <option value="09:00">09:00</option>
                        <option value="12:00">12:00</option>
                        <option value="15:00">15:00</option>
                        <option value="18:00">18:00</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Optional Notes */}
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-outline">
                    Özel İstek veya Notlar (İsteğe bağlı)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Bebek koltuğu, ek bagaj alanı, vb..."
                    className="w-full p-2.5 rounded-lg bg-surface-container-low text-body-sm border border-outline-variant/30 outline-none focus:border-primary"
                  />
                </div>

                {/* Price Breakdown */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container text-on-surface">
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md font-bold">
                      Toplam Süre: {days} Gün
                    </span>
                    <span className="font-body-sm text-body-sm text-outline">
                      Günlük: ${car.pricePerDay.toFixed(2)}
                    </span>
                  </div>
                  <span className="font-headline-lg text-headline-lg font-bold text-primary">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-bold shadow-md transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
                      <span>Rezervasyon Kaydediliyor...</span>
                    </>
                  ) : (
                    <span>Rezervasyonu Tamamla (${totalPrice.toFixed(2)})</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

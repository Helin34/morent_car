'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { getCarImage } from '@/lib/carImages';

type CardNetwork = 'visa' | 'mastercard' | 'amex' | 'unknown';

function detectCardNetwork(number: string): CardNetwork {
  const n = number.replace(/\s/g, '');
  if (/^4/.test(n)) return 'visa';
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'mastercard';
  if (/^3[47]/.test(n)) return 'amex';
  return 'unknown';
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
  return digits;
}

function CardNetworkIcon({ network }: { network: CardNetwork }) {
  if (network === 'visa') {
    return (
      <span className="inline-flex items-center justify-center bg-blue-700 text-white font-bold italic text-xs px-2 py-0.5 rounded">
        VISA
      </span>
    );
  }
  if (network === 'mastercard') {
    return (
      <span className="inline-flex items-center gap-0.5">
        <span className="w-5 h-5 rounded-full bg-red-500 opacity-90" />
        <span className="w-5 h-5 rounded-full bg-yellow-400 -ml-2.5 opacity-90" />
      </span>
    );
  }
  if (network === 'amex') {
    return (
      <span className="inline-flex items-center justify-center bg-sky-600 text-white font-bold text-xs px-2 py-0.5 rounded">
        AMEX
      </span>
    );
  }
  return <span className="material-symbols-outlined text-outline text-[22px]">credit_card</span>;
}

export default function CheckoutClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Araç ve rezervasyon bilgileri query string'den
  const carId = searchParams.get('carId') || '';
  const carName = searchParams.get('carName') || 'Araç';
  const carBrand = searchParams.get('carBrand') || '';
  const carType = searchParams.get('carType') || '';
  const carSlug = searchParams.get('carSlug') || '';
  const pricePerDay = parseFloat(searchParams.get('pricePerDay') || '0');
  const discountPricePerDay = searchParams.get('discountPricePerDay')
    ? parseFloat(searchParams.get('discountPricePerDay')!)
    : null;
  const pickupLocation = searchParams.get('pickupLocation') || '-';
  const pickupDate = searchParams.get('pickupDate') || '-';
  const pickupTime = searchParams.get('pickupTime') || '-';
  const dropoffLocation = searchParams.get('dropoffLocation') || '-';
  const dropoffDate = searchParams.get('dropoffDate') || '-';
  const dropoffTime = searchParams.get('dropoffTime') || '-';
  const days = parseInt(searchParams.get('days') || '1');
  const totalPrice = parseFloat(searchParams.get('totalPrice') || '0');
  const notes = searchParams.get('notes') || '';

  const carImage = getCarImage(carSlug);

  // Kart form state
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [showCvv, setShowCvv] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  // Ödeme state
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fatura adresi
  const [billingName, setBillingName] = useState('');
  const [billingPhone, setBillingPhone] = useState('');
  const [billingCity, setBillingCity] = useState('');

  // Sözleşme onayı
  const [termsAccepted, setTermsAccepted] = useState(false);

  const cardNetwork = detectCardNetwork(cardNumber);

  // Kart numarası maskesi
  const maskedCardNumber = cardNumber
    ? cardNumber.replace(/\d(?=.{4})/g, '•')
    : '•••• •••• •••• ••••';

  const isFormValid =
    cardHolder.trim().length >= 3 &&
    cardNumber.replace(/\s/g, '').length >= 13 &&
    expiry.length === 5 &&
    cvv.length >= 3 &&
    billingName.trim().length >= 2 &&
    billingPhone.trim().length >= 10 &&
    termsAccepted;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setErrorMessage('');
    setIsProcessing(true);

    // Ödeme simülasyonu (Stripe gelecekte buraya bağlanacak)
    await new Promise((r) => setTimeout(r, 2000));
    setIsProcessing(false);
    setPaymentSuccess(true);
  };

  if (!carId && !carName) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-8">
        <span className="material-symbols-outlined text-[64px] text-outline">error_outline</span>
        <h2 className="font-headline-xl text-on-surface font-bold">Rezervasyon Bulunamadı</h2>
        <p className="text-on-surface-variant text-center max-w-sm">
          Lütfen araç detay sayfasından rezervasyon formunu doldurun.
        </p>
        <Link
          href="/cars"
          className="px-6 py-3 rounded-xl bg-primary text-on-primary font-semibold hover:bg-primary-container transition-all"
        >
          Araç Kataloğuna Dön
        </Link>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="bg-surface-container-lowest rounded-2xl shadow-xl p-8 md:p-12 max-w-md w-full flex flex-col items-center text-center gap-6 border border-outline-variant/20">
          {/* Success Icon */}
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <span
              className="material-symbols-outlined text-primary text-[48px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
          </div>

          <div>
            <h2 className="font-headline-xl text-on-surface font-bold mb-2">
              Ödeme Başarılı! 🎉
            </h2>
            <p className="text-on-surface-variant font-body-md">
              Rezervasyonunuz onaylandı. Detaylar e-posta adresinize gönderilecektir.
            </p>
          </div>

          {/* Rezervasyon Özeti */}
          <div className="w-full bg-surface-container-low rounded-xl p-5 flex flex-col gap-3 text-left">
            <div className="flex items-center gap-3 pb-3 border-b border-surface-container-high">
              <div className="w-14 h-14 rounded-lg bg-surface-container flex items-center justify-center overflow-hidden">
                <img src={carImage.src} alt={carName} className="w-full h-full object-contain p-1" />
              </div>
              <div>
                <p className="font-label-md font-bold text-on-surface">{carName}</p>
                <p className="font-body-sm text-outline">{carBrand} • {carType}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-body-sm">
              <div>
                <p className="text-outline text-xs mb-0.5">Teslim Alış</p>
                <p className="text-on-surface font-medium">{pickupLocation}</p>
                <p className="text-outline">{pickupDate} {pickupTime}</p>
              </div>
              <div>
                <p className="text-outline text-xs mb-0.5">İade</p>
                <p className="text-on-surface font-medium">{dropoffLocation}</p>
                <p className="text-outline">{dropoffDate} {dropoffTime}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-surface-container-high">
              <span className="font-label-md font-bold text-on-surface">Ödenen Tutar</span>
              <span className="font-headline-lg font-bold text-primary">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Link
              href="/"
              className="flex-1 py-3 rounded-xl border border-outline-variant text-on-surface font-label-md font-semibold text-center hover:bg-surface-container-low transition-all"
            >
              Ana Sayfaya Dön
            </Link>
            <Link
              href="/bookings"
              className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-label-md font-semibold text-center hover:bg-primary-container transition-all"
            >
              Rezervasyonlarım
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-4">
          <Link href="/" className="font-headline-xl text-primary font-bold tracking-tight text-xl">
            MORENT
          </Link>
          <div className="flex items-center gap-2 text-on-surface-variant font-body-sm">
            <span className="material-symbols-outlined text-[18px] text-outline">lock</span>
            Güvenli Ödeme
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">256-bit SSL Şifreleme</span>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-10 pt-4">
        <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
          <Link href="/cars" className="hover:text-primary transition-colors">Araçlar</Link>
          <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
          <Link href={`/cars/${carSlug}`} className="hover:text-primary transition-colors line-clamp-1 max-w-[120px]">{carName}</Link>
          <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
          <span className="text-primary font-semibold">Ödeme</span>
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Sol: Ödeme Formu */}
          <div className="lg:col-span-7 flex flex-col gap-6">

            {/* Sanal Kart Önizlemesi */}
            <div
              className="relative w-full max-w-md mx-auto"
              style={{ perspective: '1000px', height: '200px' }}
            >
              <div
                className="relative w-full h-full transition-transform duration-700"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* Kart Ön Yüzü */}
                <div
                  className="absolute inset-0 rounded-2xl shadow-2xl p-6 flex flex-col justify-between overflow-hidden"
                  style={{
                    backfaceVisibility: 'hidden',
                    background: 'linear-gradient(135deg, #1d52d8 0%, #0848d0 50%, #3563e9 100%)',
                  }}
                >
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-4 w-40 h-40 rounded-full border-4 border-white" />
                    <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full border-4 border-white" />
                  </div>
                  <div className="relative z-10 flex justify-between items-start">
                    <span className="text-white/80 font-spec-code text-xs uppercase tracking-widest">MORENT Card</span>
                    <CardNetworkIcon network={cardNetwork} />
                  </div>
                  <div className="relative z-10">
                    <p className="text-white font-mono text-lg tracking-widest mb-3">
                      {maskedCardNumber}
                    </p>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-white/60 text-xs uppercase mb-0.5">Kart Sahibi</p>
                        <p className="text-white font-medium text-sm uppercase tracking-wide">
                          {cardHolder || 'AD SOYAD'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/60 text-xs uppercase mb-0.5">Son Tarih</p>
                        <p className="text-white font-medium text-sm">{expiry || 'MM/YY'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Kart Arka Yüzü */}
                <div
                  className="absolute inset-0 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                  }}
                >
                  <div className="w-full h-12 bg-black/60 mt-6" />
                  <div className="px-6 mt-4 flex items-center gap-4">
                    <div className="flex-1 h-9 bg-white/20 rounded flex items-center justify-end pr-3">
                      <span className="text-white font-mono tracking-widest text-sm">
                        {cvv ? cvv.replace(/./g, '•') : '•••'}
                      </span>
                    </div>
                    <span className="text-white/60 text-xs">CVV</span>
                  </div>
                  <div className="px-6 mt-auto mb-4 flex justify-end">
                    <CardNetworkIcon network={cardNetwork} />
                  </div>
                </div>
              </div>
            </div>

            {/* Ödeme Formu */}
            <form
              onSubmit={handlePayment}
              className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/15 p-6 md:p-8 flex flex-col gap-6"
            >
              {/* Hata Mesajı */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-error-container text-on-error-container flex items-center gap-2 text-body-sm">
                  <span className="material-symbols-outlined text-[20px] text-error shrink-0">error</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Kart Bilgileri */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 pb-2 border-b border-surface-container-high">
                  <span className="material-symbols-outlined text-primary text-[22px]">credit_card</span>
                  <h2 className="font-headline-md text-on-surface font-bold">Kart Bilgileri</h2>
                </div>

                {/* Kart Sahibi */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm text-label-sm text-on-surface" htmlFor="cardHolder">
                    Kart Üzerindeki Ad Soyad
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px]">person</span>
                    <input
                      id="cardHolder"
                      type="text"
                      required
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                      placeholder="AHMET YILMAZ"
                      className="w-full h-12 pl-11 pr-4 bg-surface-container-low text-on-surface placeholder:text-outline/60 rounded-xl text-body-md outline-none focus:bg-surface-container-lowest border border-transparent focus:border-primary transition-colors shadow-inner"
                    />
                  </div>
                </div>

                {/* Kart Numarası */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm text-label-sm text-on-surface" htmlFor="cardNumber">
                    Kart Numarası
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px]">credit_card</span>
                    <input
                      id="cardNumber"
                      type="text"
                      required
                      inputMode="numeric"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      className="w-full h-12 pl-11 pr-14 bg-surface-container-low text-on-surface placeholder:text-outline/60 rounded-xl text-body-md font-mono outline-none focus:bg-surface-container-lowest border border-transparent focus:border-primary transition-colors shadow-inner"
                    />
                    <div className="absolute right-3.5">
                      <CardNetworkIcon network={cardNetwork} />
                    </div>
                  </div>
                </div>

                {/* Son Kullanma & CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-label-sm text-on-surface" htmlFor="expiry">
                      Son Kullanma
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px]">calendar_month</span>
                      <input
                        id="expiry"
                        type="text"
                        required
                        inputMode="numeric"
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        placeholder="AA/YY"
                        maxLength={5}
                        className="w-full h-12 pl-11 pr-4 bg-surface-container-low text-on-surface placeholder:text-outline/60 rounded-xl text-body-md font-mono outline-none focus:bg-surface-container-lowest border border-transparent focus:border-primary transition-colors shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-label-sm text-on-surface" htmlFor="cvv">
                      CVV / CVC
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px]">lock</span>
                      <input
                        id="cvv"
                        type={showCvv ? 'text' : 'password'}
                        required
                        inputMode="numeric"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        onFocus={() => setIsFlipped(true)}
                        onBlur={() => setIsFlipped(false)}
                        placeholder="•••"
                        maxLength={4}
                        className="w-full h-12 pl-11 pr-11 bg-surface-container-low text-on-surface placeholder:text-outline/60 rounded-xl text-body-md font-mono outline-none focus:bg-surface-container-lowest border border-transparent focus:border-primary transition-colors shadow-inner"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCvv(!showCvv)}
                        className="absolute right-3.5 text-outline hover:text-on-surface transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showCvv ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fatura Bilgileri */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 pb-2 border-b border-surface-container-high">
                  <span className="material-symbols-outlined text-primary text-[22px]">receipt_long</span>
                  <h2 className="font-headline-md text-on-surface font-bold">Fatura Bilgileri</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-label-sm text-on-surface" htmlFor="billingName">
                      Ad Soyad
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px]">badge</span>
                      <input
                        id="billingName"
                        type="text"
                        required
                        value={billingName}
                        onChange={(e) => setBillingName(e.target.value)}
                        placeholder="Ahmet Yılmaz"
                        className="w-full h-12 pl-11 pr-4 bg-surface-container-low text-on-surface placeholder:text-outline/60 rounded-xl text-body-md outline-none focus:bg-surface-container-lowest border border-transparent focus:border-primary transition-colors shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-label-sm text-on-surface" htmlFor="billingPhone">
                      Telefon
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px]">phone</span>
                      <input
                        id="billingPhone"
                        type="tel"
                        required
                        inputMode="tel"
                        value={billingPhone}
                        onChange={(e) => setBillingPhone(e.target.value)}
                        placeholder="0532 000 00 00"
                        className="w-full h-12 pl-11 pr-4 bg-surface-container-low text-on-surface placeholder:text-outline/60 rounded-xl text-body-md outline-none focus:bg-surface-container-lowest border border-transparent focus:border-primary transition-colors shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm text-label-sm text-on-surface" htmlFor="billingCity">
                    Şehir
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px]">location_city</span>
                    <input
                      id="billingCity"
                      type="text"
                      value={billingCity}
                      onChange={(e) => setBillingCity(e.target.value)}
                      placeholder="İstanbul"
                      className="w-full h-12 pl-11 pr-4 bg-surface-container-low text-on-surface placeholder:text-outline/60 rounded-xl text-body-md outline-none focus:bg-surface-container-lowest border border-transparent focus:border-primary transition-colors shadow-inner"
                    />
                  </div>
                </div>
              </div>

              {/* Şartlar */}
              <div className="flex items-start gap-3">
                <input
                  id="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  required
                  className="mt-1 w-4 h-4 accent-primary cursor-pointer"
                />
                <label htmlFor="terms" className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed cursor-pointer select-none">
                  <a href="#" className="text-primary font-semibold hover:underline">Kiralama Koşulları</a> ve <a href="#" className="text-primary font-semibold hover:underline">Gizlilik Politikası</a>&apos;nı okudum, kabul ediyorum.
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!isFormValid || isProcessing}
                className="w-full h-14 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md font-bold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isProcessing ? (
                  <>
                    <span className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                    <span>Ödeme İşleniyor...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[22px]">lock</span>
                    <span>Ödemeyi Tamamla • ${totalPrice.toFixed(2)}</span>
                  </>
                )}
              </button>

              {/* Güvenlik Rozetleri */}
              <div className="flex items-center justify-center gap-6 pt-2">
                <div className="flex items-center gap-1.5 text-outline text-xs">
                  <span className="material-symbols-outlined text-[16px]">verified_user</span>
                  3D Secure
                </div>
                <div className="flex items-center gap-1.5 text-outline text-xs">
                  <span className="material-symbols-outlined text-[16px]">lock</span>
                  256-bit SSL
                </div>
                <div className="flex items-center gap-1.5 text-outline text-xs">
                  <span className="material-symbols-outlined text-[16px]">security</span>
                  PCI DSS
                </div>
              </div>
            </form>
          </div>

          {/* Sağ: Sipariş Özeti */}
          <div className="lg:col-span-5 flex flex-col gap-5 lg:sticky lg:top-24">

            {/* Araç Kartı */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/15 overflow-hidden">
              {/* Araç Görsel Alanı */}
              <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary-container/10 flex items-center justify-center p-4">
                <img
                  src={carImage.src}
                  alt={carName}
                  className="w-full h-full object-contain filter drop-shadow-lg"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur font-spec-code text-spec-code text-primary font-bold uppercase text-xs">
                    {carBrand}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur font-spec-code text-spec-code text-secondary font-bold uppercase text-xs">
                    {carType}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-headline-lg text-on-surface font-bold mb-1">{carName}</h3>
                {notes && (
                  <p className="font-body-sm text-outline line-clamp-2 mt-1 italic">
                    Not: {notes}
                  </p>
                )}
              </div>
            </div>

            {/* Rezervasyon Detayları */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/15 p-5 flex flex-col gap-4">
              <h3 className="font-headline-md text-on-surface font-bold">Rezervasyon Özeti</h3>

              {/* Teslim Al */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">trip_origin</span>
                </div>
                <div>
                  <p className="font-label-sm text-outline uppercase text-xs mb-0.5">Teslim Alış</p>
                  <p className="font-label-md text-on-surface font-semibold">{pickupLocation}</p>
                  <p className="font-body-sm text-on-surface-variant">{pickupDate} • {pickupTime}</p>
                </div>
              </div>

              {/* Bağlantı çizgisi */}
              <div className="flex items-center gap-3 pl-4">
                <div className="w-0.5 h-6 bg-outline-variant ml-3.5" />
              </div>

              {/* İade */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-secondary text-[18px]">place</span>
                </div>
                <div>
                  <p className="font-label-sm text-outline uppercase text-xs mb-0.5">Teslim Etme</p>
                  <p className="font-label-md text-on-surface font-semibold">{dropoffLocation}</p>
                  <p className="font-body-sm text-on-surface-variant">{dropoffDate} • {dropoffTime}</p>
                </div>
              </div>

              {/* Süre rozeti */}
              <div className="flex items-center gap-2 bg-surface-container-low rounded-xl px-4 py-2.5">
                <span className="material-symbols-outlined text-primary text-[18px]">schedule</span>
                <span className="font-label-md text-on-surface font-semibold">{days} Gün Kiralama</span>
              </div>
            </div>

            {/* Fiyat Dökümü */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/15 p-5 flex flex-col gap-3">
              <h3 className="font-headline-md text-on-surface font-bold">Fiyat Detayı</h3>

              <div className="flex justify-between items-center font-body-md text-on-surface-variant">
                <span>Günlük Ücret</span>
                <span className="font-medium text-on-surface">${pricePerDay.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center font-body-md text-on-surface-variant">
                <span>Kiralama Süresi</span>
                <span className="font-medium text-on-surface">{days} gün</span>
              </div>

              {discountPricePerDay && (
                <div className="flex justify-between items-center font-body-md text-secondary">
                  <span>İndirim</span>
                  <span className="font-medium">-${((pricePerDay - discountPricePerDay) * days).toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between items-center font-body-md text-on-surface-variant">
                <span>Sigorta & Hizmet</span>
                <span className="font-medium text-primary">Dahil</span>
              </div>

              <div className="border-t border-surface-container-high pt-3 flex justify-between items-center">
                <span className="font-headline-md text-on-surface font-bold">Toplam</span>
                <div className="text-right">
                  <span className="font-headline-xl text-on-surface font-bold text-primary">
                    ${totalPrice.toFixed(2)}
                  </span>
                  <p className="font-body-sm text-outline text-xs">KDV dahil</p>
                </div>
              </div>
            </div>

            {/* Yardım */}
            <div className="bg-surface-container-low rounded-2xl p-4 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[24px] shrink-0">support_agent</span>
              <div>
                <p className="font-label-md text-on-surface font-semibold">Yardıma mı ihtiyacınız var?</p>
                <p className="font-body-sm text-on-surface-variant">7/24 destek: <span className="text-primary font-semibold">0850 123 45 67</span></p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-lowest border-t border-surface-container-high py-4 mt-8">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-body-sm text-on-surface-variant text-xs">©2026 MORENT. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="font-body-sm text-on-surface-variant text-xs hover:text-primary transition-colors">Gizlilik Politikası</a>
            <a href="#" className="font-body-sm text-on-surface-variant text-xs hover:text-primary transition-colors">Kullanım Şartları</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

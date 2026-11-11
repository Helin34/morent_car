'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const urlError = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(() => {
    if (urlError === 'OAuthSignin' || urlError === 'OAuthCallback' || urlError === 'Configuration') {
      return 'Google OAuth yapılandırması henüz tamamlanmamış. Demo Google hesabıyla giriş yapabilirsiniz.';
    }
    return '';
  });
  const [infoMessage, setInfoMessage] = useState('');

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setInfoMessage('');
    setIsLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
        callbackUrl,
      });

      if (!res?.ok || res?.error) {
        setErrorMessage(
          res?.error || 'Giriş yapılamadı. Lütfen e-posta ve şifrenizi kontrol ediniz.'
        );
        setIsLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || 'Beklenmeyen bir hata oluştu.');
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setInfoMessage('');
    setIsLoading(true);

    try {
      // Check if real Google OAuth is configured
      const statusRes = await fetch('/api/auth/google-status');
      const statusData = await statusRes.json();

      if (statusData.configured) {
        await signIn('google', { callbackUrl });
      } else {
        // One-click demo Google user login
        setInfoMessage('Google API anahtarı eklenmediği için Demo Google Hesabı ile oturum açılıyor...');
        const res = await signIn('credentials', {
          redirect: false,
          isGoogleDemo: 'true',
          callbackUrl,
        });

        if (res?.ok) {
          router.push(callbackUrl);
          router.refresh();
        } else {
          setErrorMessage('Demo Google girişi sırasında bir hata oluştu.');
          setIsLoading(false);
        }
      }
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || 'Google girişi sırasında bir hata oluştu.');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-md p-space-lg sm:p-space-xl flex flex-col">
      {/* Header Greeting */}
      <div className="flex flex-col gap-space-xs mb-space-lg">
        <div className="inline-flex items-center gap-space-xs self-start px-space-sm py-0.5 rounded-full bg-surface-container text-primary font-spec-code text-spec-code uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          Güvenli Giriş Portalı
        </div>
        <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mt-space-xs font-bold">
          Tekrar Hoş Geldiniz
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Araç rezervasyonlarınıza, favorilerinize ve üyelik indirimlerine erişmek için giriş yapın.
        </p>
      </div>

      {/* Error Toast Notification */}
      {errorMessage && (
        <div className="mb-space-md p-space-md rounded-lg bg-error-container text-on-error-container flex items-center gap-space-sm text-body-sm animate-fadeIn">
          <span className="material-symbols-outlined text-[20px] text-error shrink-0">
            error
          </span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Social Login: Google */}
      <button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="w-full h-14 px-space-md rounded-lg bg-surface-container-lowest shadow-sm hover:shadow-md hover:bg-surface-container-low transition-all duration-200 flex items-center justify-center gap-space-md group border border-outline-variant/30 cursor-pointer disabled:opacity-60"
        type="button"
      >
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
          <path
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            fill="#4285F4"
          />
          <path
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.41 7.34 24 12 24z"
            fill="#34A853"
          />
          <path
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.98 0 12s.45 3.84 1.24 5.42l4.04-3.15z"
            fill="#FBBC05"
          />
          <path
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.59 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            fill="#EA4335"
          />
        </svg>
        <span className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors font-medium">
          Google ile Giriş Yap
        </span>
      </button>

      {/* Divider */}
      <div className="relative my-space-lg flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-px bg-surface-container-high"></div>
        </div>
        <span className="relative px-space-md bg-surface-container-lowest font-body-sm text-body-sm text-on-surface-variant">
          Veya e-posta ile giriş yapın
        </span>
      </div>

      {/* Login Form */}
      <form onSubmit={handleCredentialsSubmit} className="flex flex-col gap-space-md">
        {/* Email Field */}
        <div className="flex flex-col gap-space-xs">
          <label
            className="font-label-md text-label-md text-on-surface flex items-center justify-between"
            htmlFor="login-email"
          >
            <span>E-posta Adresi</span>
            <span className="font-spec-code text-spec-code text-on-surface-variant">
              ZORUNLU
            </span>
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-4 text-outline pointer-events-none text-[20px]">
              mail
            </span>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@domain.com"
              className="w-full h-14 pl-12 pr-4 rounded-lg bg-surface-container-low/60 border border-transparent focus:border-primary text-on-surface font-body-md text-body-md placeholder:text-outline shadow-sm focus:outline-none focus:bg-surface-container-lowest transition-all duration-200"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-space-xs">
          <label
            className="font-label-md text-label-md text-on-surface flex items-center justify-between"
            htmlFor="login-password"
          >
            <span>Şifre</span>
            <span className="font-spec-code text-spec-code text-on-surface-variant">
              ZORUNLU
            </span>
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-4 text-outline pointer-events-none text-[20px]">
              lock
            </span>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full h-14 pl-12 pr-12 rounded-lg bg-surface-container-low/60 border border-transparent focus:border-primary text-on-surface font-body-md text-body-md placeholder:text-outline shadow-sm focus:outline-none focus:bg-surface-container-lowest transition-all duration-200"
            />
            <button
              type="button"
              aria-label="Şifre görünürlüğünü değiştir"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-outline hover:text-on-surface transition-colors p-1 flex items-center justify-center focus:outline-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>

        {/* Utilities: Remember Me & Forgot Password */}
        <div className="flex items-center justify-between mt-space-xs pt-1">
          <label className="flex items-center gap-space-sm cursor-pointer select-none">
            <div className="relative flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="peer sr-only"
              />
              <div className="w-5 h-5 rounded bg-surface-container peer-checked:bg-primary transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-[16px] opacity-0 peer-checked:opacity-100 transition-opacity">
                  check
                </span>
              </div>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface select-none">
              Beni hatırla
            </span>
          </label>
          <a
            href="#"
            className="font-label-md text-label-md text-primary hover:underline transition-colors"
          >
            Şifremi Unuttum?
          </a>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 mt-space-sm rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-space-sm group cursor-pointer disabled:opacity-70"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
              <span>Giriş Yapılıyor...</span>
            </div>
          ) : (
            <>
              <span>Giriş Yap</span>
              <span className="material-symbols-outlined text-[20px] transition-transform duration-200 group-hover:translate-x-1">
                arrow_forward
              </span>
            </>
          )}
        </button>
      </form>

      {/* Register Prompt Footer */}
      <div className="mt-space-lg pt-space-md text-center">
        <p className="font-body-md text-body-md text-on-surface-variant">
          Henüz bir hesabınız yok mu?{' '}
          <Link
            className="font-label-md text-label-md text-primary hover:underline transition-colors ml-1 font-semibold"
            href="/register"
          >
            Hemen Ücretsiz Kayıt Olun
          </Link>
        </p>
      </div>

      {/* Demo Credentials Pill */}
      <div className="mt-space-md p-space-sm rounded-lg bg-surface-container-low text-on-surface-variant text-center font-body-sm">
        <span className="font-semibold text-primary">Demo Giriş Bilgileri:</span> demo@morent.com / Morent123!
      </div>

      {/* Bottom Micro Assurance */}
      <div className="mt-space-md pt-space-sm flex items-center justify-center gap-space-md text-outline">
        <div className="flex items-center gap-1 font-spec-code text-spec-code">
          <span className="material-symbols-outlined text-[16px] text-primary">
            verified_user
          </span>
          <span>256-BIT ŞİFRELEME</span>
        </div>
        <span className="inline-block w-1 h-1 rounded-full bg-outline-variant"></span>
        <div className="flex items-center gap-1 font-spec-code text-spec-code">
          <span className="material-symbols-outlined text-[16px] text-primary">
            speed
          </span>
          <span>ANINDA ONAY</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-20 w-full px-margin flex items-center justify-between gap-space-lg">
          <div className="flex items-center gap-space-lg shrink-0">
            <Link className="flex items-center gap-space-sm" href="/">
              <span className="font-headline-xl text-primary font-bold tracking-tight">
                MORENT
              </span>
            </Link>
          </div>
          <nav className="flex items-center gap-space-md shrink-0">
            <Link
              className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
              href="/"
            >
              Ana Sayfa
            </Link>
            <Link
              aria-current="page"
              className="transition-colors text-primary font-label-md font-semibold"
              href="/login"
            >
              Giriş Yap
            </Link>
            <Link
              className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
              href="/register"
            >
              Kayıt Ol
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Authentication Canvas */}
      <main className="w-full pt-20 bg-background min-h-screen flex-1 flex flex-col justify-center">
        <div className="flex flex-col w-full">
          <div className="w-full max-w-[1440px] mx-auto px-margin-mobile md:px-margin py-space-lg lg:py-space-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-stretch min-h-[calc(100vh-13rem)]">
              {/* Left Column: Authentication Form with Suspense */}
              <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center">
                <Suspense
                  fallback={
                    <div className="bg-surface-container-lowest rounded-xl shadow-md p-space-xl flex justify-center items-center h-96">
                      <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  }
                >
                  <LoginForm />
                </Suspense>
              </div>

              {/* Right Column: Brand Showcase & Car Spotlight */}
              <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-between relative rounded-xl overflow-hidden bg-primary shadow-xl">
                {/* Background Ambient Scrim & Lighting FX */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-surface-tint to-on-primary-fixed opacity-95"></div>
                <div className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none"></div>
                <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-primary-fixed-dim/15 blur-2xl pointer-events-none"></div>

                {/* Inner Content Hierarchy */}
                <div className="relative z-10 p-space-xl flex flex-col h-full justify-between">
                  {/* Top Row Badges & Support Pill */}
                  <div className="flex items-center justify-between gap-space-md">
                    <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-lowest/15 backdrop-blur-md text-on-primary font-spec-code text-spec-code tracking-wider uppercase shadow-sm">
                      <span className="material-symbols-outlined text-secondary-container text-[18px]">
                        electric_bolt
                      </span>
                      <span>Ayrıcalıklı Filo Erişimi</span>
                    </div>
                    {/* 24/7 Support Pill */}
                    <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-lowest/10 backdrop-blur-md text-on-primary font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-secondary-fixed text-[18px]">
                        support_agent
                      </span>
                      <span>7/24 Kesintisiz Destek</span>
                    </div>
                  </div>

                  {/* Hero Vehicle Presentation */}
                  <div className="my-space-xl flex flex-col items-center text-center">
                    {/* Vehicle Specs Pills Strip */}
                    <div className="flex flex-wrap justify-center gap-space-sm mb-space-lg">
                      <div className="inline-flex items-center gap-1.5 px-space-md py-1 rounded-full bg-surface-container-lowest/15 backdrop-blur-md text-on-primary font-label-sm text-label-sm">
                        <span className="material-symbols-outlined text-[16px] text-secondary-fixed">
                          speed
                        </span>
                        <span>0-100 km/s: 2.9 sn</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-space-md py-1 rounded-full bg-surface-container-lowest/15 backdrop-blur-md text-on-primary font-label-sm text-label-sm">
                        <span className="material-symbols-outlined text-[16px] text-secondary-fixed">
                          local_gas_station
                        </span>
                        <span>Twin-Turbo V6</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-space-md py-1 rounded-full bg-surface-container-lowest/15 backdrop-blur-md text-on-primary font-label-sm text-label-sm">
                        <span className="material-symbols-outlined text-[16px] text-secondary-fixed">
                          airline_seat_recline_normal
                        </span>
                        <span>4 Koltuk AWD</span>
                      </div>
                    </div>

                    {/* Dynamic Car Showcase Graphic */}
                    <div className="relative w-full max-w-lg mx-auto flex items-center justify-center py-space-md">
                      <img
                        className="w-full h-64 xl:h-72 object-contain drop-shadow-[0_24px_36px_rgba(0,0,0,0.45)] transform hover:scale-105 transition-transform duration-500"
                        alt="Nissan GT-R Nismo Edition"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuADJ6LEyvcZBLqW0NxOA3TOVQkA_ItaesqWDGrZqSzKypPj8LK46MMnHOUjwTTaWv0UOcLUt6i2pN7wB5LBIpyoY4M8rvS7DIVI2soRXuiXh2sz3t0m3LtUD0fbarCMgcWAho5nFWFpvKEWCo_DqmKZwHzKKvXDz7afYHfe3lCxZ-TsWpuunjs4j9JE5VzaPAwP1-eIwuYLQ6zXEmuzLUnIEZUMhIVbP0C7ZSpphDs"
                      />
                    </div>

                    {/* Vehicle Identity Title */}
                    <div className="mt-space-md">
                      <span className="font-spec-code text-spec-code text-secondary-fixed uppercase tracking-widest">
                        Spor Performans Serisi
                      </span>
                      <h2 className="font-headline-xl text-headline-xl text-on-primary tracking-tight mt-1 font-bold">
                        Nissan GT-R Nismo Edition
                      </h2>
                    </div>
                  </div>

                  {/* Bottom Metric & Social Proof Card */}
                  <div className="bg-surface-container-lowest/10 backdrop-blur-md rounded-xl p-space-md sm:p-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md">
                    <div className="flex items-center gap-space-md">
                      {/* Driver Badges Cluster */}
                      <div className="flex -space-x-3 overflow-hidden">
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-secondary text-on-primary font-semibold text-xs ring-2 ring-surface-container-lowest/50">
                          AY
                        </div>
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-secondary-container text-on-primary font-semibold text-xs ring-2 ring-surface-container-lowest/50">
                          MK
                        </div>
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary-container text-on-primary font-semibold text-xs ring-2 ring-surface-container-lowest/50">
                          ED
                        </div>
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-secondary-fixed text-on-secondary-fixed font-spec-code text-spec-code ring-2 ring-surface-container-lowest/50">
                          +12k
                        </div>
                      </div>

                      {/* Social Proof Copy */}
                      <div className="flex flex-col text-left">
                        <div className="flex items-center gap-1 text-[#ffb4a5]">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className="material-symbols-outlined text-[16px]"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              star
                            </span>
                          ))}
                          <span className="font-label-sm text-label-sm text-on-primary ml-1 font-bold">
                            4.96/5
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-primary/90 mt-0.5">
                          Türkiye genelinde 120.000+ mutlu araç kiralama deneyimi
                        </p>
                      </div>
                    </div>

                    {/* Quick Tier Badge */}
                    <div className="shrink-0 px-space-md py-space-xs rounded-lg bg-surface-container-lowest/20 text-on-primary text-center">
                      <span className="block font-spec-code text-spec-code text-secondary-fixed">
                        ÜYE AVANTAJI
                      </span>
                      <span className="font-headline-md text-headline-md text-on-primary font-bold">
                        %25&apos;e Varan İndirim
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-lowest py-space-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="w-full px-margin flex flex-col sm:flex-row items-center justify-between gap-space-sm">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            ©2026 MORENT. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-space-lg">
            <a
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              Gizlilik Politikası
            </a>
            <a
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              Kullanım Şartları
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}


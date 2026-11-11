'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = getPasswordStrength(password);
  const isPasswordMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!termsAccepted) {
      setErrorMessage('Lütfen kullanım koşullarını ve gizlilik politikasını kabul ediniz.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Girdiğiniz şifreler birbiriyle eşleşmiyor.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Şifreniz en az 6 karakter olmalıdır.');
      return;
    }

    setIsLoading(true);

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName || 'Kullanıcı',
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Kayıt işlemi başarısız oldu.');
        setIsLoading(false);
        return;
      }

      setSuccessMessage('Hesabınız başarıyla oluşturuldu! Giriş yapılıyor...');

      // Auto sign in after registration
      const signInRes = await signIn('credentials', {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
      });

      if (signInRes?.ok) {
        router.push('/');
        router.refresh();
      } else {
        router.push('/login');
      }
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || 'Kayıt sırasında bir hata oluştu.');
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    await signIn('google', { callbackUrl: '/' });
  };

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
              className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
              href="/login"
            >
              Giriş Yap
            </Link>
            <Link
              aria-current="page"
              className="transition-colors text-primary font-label-md font-semibold"
              href="/register"
            >
              Kayıt Ol
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Registration Canvas */}
      <main className="w-full pt-20 bg-background min-h-screen flex-1 flex flex-col justify-center">
        <div className="flex flex-col w-full">
          <div className="w-full max-w-[1440px] mx-auto px-margin-mobile sm:px-margin py-6 lg:py-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-stretch">
              {/* Left Column: Registration Form Canvas */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="bg-surface-container-lowest rounded-xl shadow-[0_2px_16px_rgba(26,32,44,0.06)] p-6 sm:p-10 lg:p-12 relative overflow-hidden">
                  {/* Subtle Atmospheric Accent */}
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>

                  {/* Top Badge & Header */}
                  <div className="flex flex-col gap-space-xs mb-space-lg relative z-10">
                    <div className="inline-flex items-center gap-2 self-start bg-surface-container-high px-3 py-1 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                      <span className="font-spec-code text-spec-code uppercase tracking-wider text-primary font-bold">
                        Morent Ailesine Katılın
                      </span>
                    </div>
                    <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mt-2 font-bold">
                      Morent ile Hemen Başlayın
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant max-w-lg">
                      Saniyeler içinde Türkiye genelinde lüks ve spor araçları kiralayın. Üyelere özel fiyat avantajlarını ve anahtarsız teslimatı keşfedin.
                    </p>
                  </div>

                  {/* Alerts */}
                  {errorMessage && (
                    <div className="mb-4 p-3.5 rounded-lg bg-error-container text-on-error-container flex items-center gap-2 text-body-sm relative z-10 animate-fadeIn">
                      <span className="material-symbols-outlined text-[20px] text-error shrink-0">
                        error
                      </span>
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {successMessage && (
                    <div className="mb-4 p-3.5 rounded-lg bg-surface-container text-primary flex items-center gap-2 text-body-sm relative z-10 animate-fadeIn">
                      <span className="material-symbols-outlined text-[20px] text-primary shrink-0">
                        check_circle
                      </span>
                      <span>{successMessage}</span>
                    </div>
                  )}

                  {/* Social Quick Connect (Google SSO) */}
                  <div className="flex flex-col gap-space-md relative z-10">
                    <button
                      onClick={handleGoogleSignUp}
                      disabled={isLoading}
                      className="w-full h-14 bg-surface-container-low hover:bg-surface-container transition-all duration-200 rounded-xl flex items-center justify-center gap-3 shadow-sm group border border-outline-variant/30 cursor-pointer disabled:opacity-60"
                      type="button"
                    >
                      <svg
                        className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          fill="#EA4335"
                        />
                      </svg>
                      <span className="font-label-md text-label-md text-on-surface font-medium">
                        Google ile Kayıt Ol
                      </span>
                    </button>

                    {/* Text Divider */}
                    <div className="relative flex items-center justify-center my-1">
                      <div className="w-full h-px bg-surface-container-high"></div>
                      <span className="absolute bg-surface-container-lowest px-4 font-body-sm text-body-sm text-outline">
                        Veya e-posta ile kayıt olun
                      </span>
                    </div>
                  </div>

                  {/* Registration Form */}
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2 relative z-10">
                    {/* Name Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-label-sm text-label-sm text-on-surface" htmlFor="first-name">
                          Adınız
                        </label>
                        <div className="relative flex items-center">
                          <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px]">
                            person
                          </span>
                          <input
                            id="first-name"
                            type="text"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Ahmet"
                            className="w-full h-12 pl-11 pr-4 bg-surface-container-low text-on-surface placeholder:text-outline/70 rounded-lg text-body-md font-body-md outline-none focus:bg-surface-container-lowest transition-colors border border-transparent focus:border-primary shadow-inner"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="font-label-sm text-label-sm text-on-surface" htmlFor="last-name">
                          Soyadınız
                        </label>
                        <div className="relative flex items-center">
                          <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px]">
                            badge
                          </span>
                          <input
                            id="last-name"
                            type="text"
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Yılmaz"
                            className="w-full h-12 pl-11 pr-4 bg-surface-container-low text-on-surface placeholder:text-outline/70 rounded-lg text-body-md font-body-md outline-none focus:bg-surface-container-lowest transition-colors border border-transparent focus:border-primary shadow-inner"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email Address */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-sm text-label-sm text-on-surface" htmlFor="email">
                        E-posta Adresi
                      </label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px]">
                          mail
                        </span>
                        <input
                          id="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="ahmet.yilmaz@ornek.com"
                          className="w-full h-12 pl-11 pr-4 bg-surface-container-low text-on-surface placeholder:text-outline/70 rounded-lg text-body-md font-body-md outline-none focus:bg-surface-container-lowest transition-colors border border-transparent focus:border-primary shadow-inner"
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="font-label-sm text-label-sm text-on-surface" htmlFor="password">
                          Şifre
                        </label>
                        <span className="font-spec-code text-spec-code uppercase text-outline">
                          En az 6 karakter
                        </span>
                      </div>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px]">
                          lock
                        </span>
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Güçlü bir şifre oluşturun"
                          className="w-full h-12 pl-11 pr-11 bg-surface-container-low text-on-surface placeholder:text-outline/70 rounded-lg text-body-md font-body-md outline-none focus:bg-surface-container-lowest transition-colors border border-transparent focus:border-primary shadow-inner"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 text-outline hover:text-on-surface transition-colors flex items-center justify-center p-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {showPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>

                      {/* Realtime Password Strength Bar */}
                      <div className="grid grid-cols-4 gap-1.5 mt-1">
                        <div
                          className={`h-1 rounded-full transition-colors ${
                            strength >= 1 ? 'bg-primary' : 'bg-surface-variant'
                          }`}
                        ></div>
                        <div
                          className={`h-1 rounded-full transition-colors ${
                            strength >= 2 ? 'bg-primary' : 'bg-surface-variant'
                          }`}
                        ></div>
                        <div
                          className={`h-1 rounded-full transition-colors ${
                            strength >= 3 ? 'bg-primary' : 'bg-surface-variant'
                          }`}
                        ></div>
                        <div
                          className={`h-1 rounded-full transition-colors ${
                            strength >= 4 ? 'bg-primary' : 'bg-surface-variant'
                          }`}
                        ></div>
                      </div>
                    </div>

                    {/* Confirm Password Input */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="font-label-sm text-label-sm text-on-surface" htmlFor="confirm-password">
                          Şifre Tekrarı
                        </label>
                        {isPasswordMatch && (
                          <span className="font-spec-code text-spec-code text-primary uppercase flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">check</span> Şifreler Eşleşti
                          </span>
                        )}
                      </div>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px]">
                          verified_user
                        </span>
                        <input
                          id="confirm-password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Şifrenizi tekrar girin"
                          className="w-full h-12 pl-11 pr-11 bg-surface-container-low text-on-surface placeholder:text-outline/70 rounded-lg text-body-md font-body-md outline-none focus:bg-surface-container-lowest transition-colors border border-transparent focus:border-primary shadow-inner"
                        />
                        {isPasswordMatch && (
                          <div className="absolute right-3.5 flex items-center">
                            <span className="material-symbols-outlined text-primary text-[20px]">
                              check_circle
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Terms and Conditions Checkbox */}
                    <div className="flex items-start gap-3 mt-1.5">
                      <input
                        id="terms"
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        required
                        className="mt-1 w-4 h-4 rounded text-primary-container focus:ring-0 cursor-pointer accent-primary"
                      />
                      <label
                        htmlFor="terms"
                        className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed select-none cursor-pointer"
                      >
                        Morent <a className="text-primary font-label-sm hover:underline" href="#">Kullanım Koşulları</a> ve <a className="text-primary font-label-sm hover:underline" href="#">Gizlilik Politikası</a>&apos;nı okudum, kabul ediyorum.
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-13 py-3.5 bg-primary-container hover:bg-primary text-on-primary rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 mt-2 active:scale-[0.99] cursor-pointer disabled:opacity-70"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
                          <span>Hesap Oluşturuluyor...</span>
                        </div>
                      ) : (
                        <>
                          <span>Hesap Oluştur</span>
                          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                        </>
                      )}
                    </button>

                    {/* Bottom Switch Link */}
                    <div className="text-center pt-2">
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        Zaten bir hesabınız var mı?{' '}
                        <Link className="text-primary font-label-md text-label-md hover:underline ml-1 font-semibold" href="/login">
                          Giriş Yap
                        </Link>
                      </p>
                    </div>
                  </form>
                </div>
              </div>

              {/* Right Column: Visual Perks & Fleet Showcase Panel */}
              <div className="lg:col-span-5 flex flex-col gap-gutter justify-between">
                {/* Showcase Hero Visual Container */}
                <div className="bg-surface-container-lowest rounded-xl shadow-[0_2px_16px_rgba(26,32,44,0.06)] p-6 sm:p-8 flex flex-col relative overflow-hidden flex-1 justify-between">
                  <div className="absolute -top-16 -left-16 w-48 h-48 bg-secondary-fixed/30 rounded-full blur-3xl pointer-events-none"></div>

                  <div>
                    {/* Badge & Rating */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-spec-code text-spec-code text-primary uppercase tracking-widest bg-surface-container px-3 py-1 rounded-md font-bold">
                        Prestijli Filo
                      </span>
                      <div className="flex items-center gap-1 text-primary">
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
                    </div>

                    <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2 font-bold">
                      Neden Morent ile Kiralamalısınız?
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                      Sıfır evrak formalitesi ve akıllı telefon üzerinden anında teslim alma ile araç kiralama deneyiminin geleceğini yaşayın.
                    </p>

                    {/* Featured Vehicle Card Snapshot */}
                    <div className="bg-surface-container-low rounded-xl p-4 mb-6 relative overflow-hidden group">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-label-md text-label-md text-on-surface font-semibold">
                            Nissan GT - R Nismo
                          </h3>
                          <span className="font-label-sm text-label-sm text-outline">
                            Spor Performans
                          </span>
                        </div>
                        <span className="font-headline-md text-headline-md text-primary font-bold">
                          $80.00
                          <span className="font-body-sm text-body-sm text-outline font-normal">/gün</span>
                        </span>
                      </div>
                      <div className="w-full h-36 relative flex items-center justify-center my-2">
                        <img
                          className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                          alt="Nissan GT-R Nismo"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzx5gSqKZK1knWD52AQt4DNFQAQL__vsGvFgeHS28D3o-NZjzgIMSAiAZZO72JkGAiwhbjxq3jpeg36mTAbSGBaoyuDuKxonULXzjSK5bk2LGEw9C9_4Ncvxe-HlQ33AtQVO4pxrkyT9Y9iOKJs5dBPSni1hK93KWgfPS0GgXZorDhZXP3KmAx4tIO7hMrp3ARgiVGhQdDV-U2DinuEpqgDA3as1laFlvN_pELwCo"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t-0 bg-surface-container-lowest/80 rounded-lg p-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-outline text-[16px]">
                            local_gas_station
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface font-medium">80L</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-outline text-[16px]">
                            airline_seat_recline_normal
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface font-medium">2 Kişi</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-outline text-[16px]">
                            speed
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface font-medium">Manuel</span>
                        </div>
                      </div>
                    </div>

                    {/* Trust Badges Stack */}
                    <div className="flex flex-col gap-3.5">
                      <div className="flex items-start gap-3.5 p-3 rounded-lg bg-surface-container-low/70">
                        <div className="w-9 h-9 rounded-lg bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                          <span className="material-symbols-outlined text-[20px]">key</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-md text-label-md text-on-surface font-semibold">
                            Anında Onay &amp; Hızlı Teslimat
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            Türkiye genelinde güvenli lokasyonlardan dakikalar içinde aracınızı teslim alın.
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3.5 p-3 rounded-lg bg-surface-container-low/70">
                        <div className="w-9 h-9 rounded-lg bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                          <span className="material-symbols-outlined text-[20px]">price_check</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-md text-label-md text-on-surface font-semibold">
                            Sıfır Gizli Masraf &amp; 7/24 Asistan
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            Tam kasko güvencesi ve uygulama üzerinden canlı yol yardım desteği.
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3.5 p-3 rounded-lg bg-surface-container-low/70">
                        <div className="w-9 h-9 rounded-lg bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                          <span className="material-symbols-outlined text-[20px]">garage</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-md text-label-md text-on-surface font-semibold">
                            Yüzlerce Doğrulanmış Araç
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">
                            Detaylı hijyen kontrolleri ve periyodik bakımları yapılmış garantili filo.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Review Quotation */}
                  <div className="mt-6 pt-5 bg-surface-container-high/40 rounded-xl p-4 flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-label-md shrink-0 font-bold">
                      AY
                    </div>
                    <div className="flex flex-col">
                      <p className="font-body-sm text-body-sm text-on-surface italic">
                        “Morent hafta sonu kaçamaklarımı baştan tanımladı. Sıfır gişe kuyruğu, 45 saniyede aracı seçtim ve hemen teslim aldım.”
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                          Ahmet Y. – Doğrulanmış Sürücü
                        </span>
                        <span className="font-spec-code text-spec-code text-outline">
                          İstanbul • 2 gün önce
                        </span>
                      </div>
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

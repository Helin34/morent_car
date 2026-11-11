'use client';

import React, { useState } from 'react';
import { turkeyLocations } from '@/lib/seedData';

export default function BookingWidget() {
  const [pickupLoc, setPickupLoc] = useState(turkeyLocations[0]);
  const [pickupDate, setPickupDate] = useState('2026-11-10');
  const [pickupTime, setPickupTime] = useState('09:00');

  const [dropoffLoc, setDropoffLoc] = useState(turkeyLocations[1]);
  const [dropoffDate, setDropoffDate] = useState('2026-11-15');
  const [dropoffTime, setDropoffTime] = useState('18:00');

  const handleSwap = () => {
    const tempLoc = pickupLoc;
    const tempTime = pickupTime;
    setPickupLoc(dropoffLoc);
    setPickupTime(dropoffTime);
    setDropoffLoc(tempLoc);
    setDropoffTime(tempTime);
  };

  return (
    <section className="relative w-full" id="booking-widget">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md lg:gap-space-xl items-center relative">
        {/* Pick-Up Card Panel */}
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-shadow border border-outline-variant/15">
          <div className="flex items-center gap-space-sm mb-space-md">
            <span className="relative flex h-4 w-4 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-30"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <span className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
              Teslim Alma (Alış)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
            {/* Location */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface font-bold">
                Lokasyon
              </label>
              <div className="relative bg-surface-container-low rounded-lg px-3 py-2.5 flex items-center justify-between group hover:bg-surface-container transition-colors">
                <select
                  value={pickupLoc}
                  onChange={(e) => setPickupLoc(e.target.value)}
                  className="w-full bg-transparent border-0 outline-none font-body-sm text-body-sm text-on-surface-variant font-medium appearance-none cursor-pointer pr-4"
                >
                  {turkeyLocations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined text-outline text-[18px] pointer-events-none group-hover:text-primary transition-colors">
                  expand_more
                </span>
              </div>
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface font-bold">
                Tarih
              </label>
              <div className="relative bg-surface-container-low rounded-lg px-3 py-2.5 flex items-center justify-between group hover:bg-surface-container transition-colors">
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full bg-transparent border-0 outline-none font-body-sm text-body-sm text-on-surface-variant font-medium cursor-pointer"
                />
              </div>
            </div>

            {/* Time */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface font-bold">
                Saat
              </label>
              <div className="relative bg-surface-container-low rounded-lg px-3 py-2.5 flex items-center justify-between group hover:bg-surface-container transition-colors">
                <select
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full bg-transparent border-0 outline-none font-body-sm text-body-sm text-on-surface-variant font-medium appearance-none cursor-pointer pr-4"
                >
                  <option value="07:00">07:00</option>
                  <option value="09:00">09:00</option>
                  <option value="12:00">12:00</option>
                  <option value="15:00">15:00</option>
                  <option value="18:00">18:00</option>
                  <option value="21:00">21:00</option>
                </select>
                <span className="material-symbols-outlined text-outline text-[18px] pointer-events-none group-hover:text-primary transition-colors">
                  expand_more
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Central Floating Reverse / Swap Button */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden lg:flex items-center justify-center">
          <button
            type="button"
            onClick={handleSwap}
            aria-label="Alış ve Bırakış lokasyonlarını değiştir"
            className="w-14 h-14 rounded-xl bg-primary hover:bg-primary-container text-on-primary shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">swap_vert</span>
          </button>
        </div>

        {/* Drop-Off Card Panel */}
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-shadow border border-outline-variant/15">
          <div className="flex items-center gap-space-sm mb-space-md">
            <span className="relative flex h-4 w-4 items-center justify-center">
              <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
            </span>
            <span className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
              Teslim Etme (İade)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
            {/* Location */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface font-bold">
                Lokasyon
              </label>
              <div className="relative bg-surface-container-low rounded-lg px-3 py-2.5 flex items-center justify-between group hover:bg-surface-container transition-colors">
                <select
                  value={dropoffLoc}
                  onChange={(e) => setDropoffLoc(e.target.value)}
                  className="w-full bg-transparent border-0 outline-none font-body-sm text-body-sm text-on-surface-variant font-medium appearance-none cursor-pointer pr-4"
                >
                  {turkeyLocations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined text-outline text-[18px] pointer-events-none group-hover:text-primary transition-colors">
                  expand_more
                </span>
              </div>
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface font-bold">
                Tarih
              </label>
              <div className="relative bg-surface-container-low rounded-lg px-3 py-2.5 flex items-center justify-between group hover:bg-surface-container transition-colors">
                <input
                  type="date"
                  value={dropoffDate}
                  onChange={(e) => setDropoffDate(e.target.value)}
                  className="w-full bg-transparent border-0 outline-none font-body-sm text-body-sm text-on-surface-variant font-medium cursor-pointer"
                />
              </div>
            </div>

            {/* Time */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface font-bold">
                Saat
              </label>
              <div className="relative bg-surface-container-low rounded-lg px-3 py-2.5 flex items-center justify-between group hover:bg-surface-container transition-colors">
                <select
                  value={dropoffTime}
                  onChange={(e) => setDropoffTime(e.target.value)}
                  className="w-full bg-transparent border-0 outline-none font-body-sm text-body-sm text-on-surface-variant font-medium appearance-none cursor-pointer pr-4"
                >
                  <option value="07:00">07:00</option>
                  <option value="09:00">09:00</option>
                  <option value="12:00">12:00</option>
                  <option value="15:00">15:00</option>
                  <option value="18:00">18:00</option>
                  <option value="21:00">21:00</option>
                </select>
                <span className="material-symbols-outlined text-outline text-[18px] pointer-events-none group-hover:text-primary transition-colors">
                  expand_more
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

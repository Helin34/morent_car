'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { getCarImage } from '@/lib/carImages';

export interface CarItemProps {
  _id: string;
  name: string;
  brand: string;
  type: string;
  gasolineCapacity: number;
  steering: string;
  seatCapacity: number;
  pricePerDay: number;
  discountPricePerDay?: number;
  slug: string;
  assetId?: string;
  isPopular?: boolean;
}

export default function CarCard({ car }: { car: CarItemProps }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const imageMeta = getCarImage(car.slug || car.assetId);

  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-md sm:p-space-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group border border-outline-variant/15">
      {/* Header Info & Favorite */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link href={`/cars/${car.slug}`}>
              <h3 className="font-headline-lg text-headline-lg text-on-surface font-bold group-hover:text-primary transition-colors">
                {car.name}
              </h3>
            </Link>
            <p className="font-label-sm text-label-sm text-outline font-medium mt-0.5">
              {car.type}
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
            aria-label="Favorilere ekle"
            className="p-1.5 rounded-full hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            <span
              className={`material-symbols-outlined text-[24px] transition-colors ${
                isFavorite
                  ? 'text-error fill-current'
                  : 'text-outline hover:text-error'
              }`}
              style={{
                fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              favorite
            </span>
          </button>
        </div>

        {/* Car Showcase Image */}
        <Link href={`/cars/${car.slug}`}>
          <div className="my-space-lg h-36 flex items-center justify-center relative overflow-hidden cursor-pointer">
            <img
              src={imageMeta.src}
              alt={car.name}
              className="max-h-full w-full object-contain transform group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
            />
          </div>
        </Link>
      </div>

      {/* Specifications & Pricing */}
      <div>
        {/* Specs Pills Strip */}
        <div className="flex items-center justify-between gap-space-xs text-on-surface-variant font-label-sm text-label-sm mb-space-lg">
          <span className="flex items-center gap-1.5" title="Depo Kapasitesi">
            <span className="material-symbols-outlined text-[18px] text-outline">
              local_gas_station
            </span>
            {car.gasolineCapacity > 0 ? `${car.gasolineCapacity}L` : 'Elektrik'}
          </span>
          <span className="flex items-center gap-1.5" title="Vites Türü">
            <span className="material-symbols-outlined text-[18px] text-outline">
              settings
            </span>
            {car.steering === 'Manual' ? 'Manuel' : 'Otomatik'}
          </span>
          <span className="flex items-center gap-1.5" title="Kişi Kapasitesi">
            <span className="material-symbols-outlined text-[18px] text-outline">
              group
            </span>
            {car.seatCapacity} Kişi
          </span>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-surface-container-high/60">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
                ${car.pricePerDay.toFixed(2)}
              </span>
              <span className="font-body-sm text-body-sm text-outline font-normal">
                / gün
              </span>
            </div>
            {car.discountPricePerDay && (
              <span className="font-body-sm text-body-sm text-outline line-through -mt-1">
                ${car.discountPricePerDay.toFixed(2)}
              </span>
            )}
          </div>
          <Link
            href={`/cars/${car.slug}`}
            className="px-space-md py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md shadow-sm hover:shadow transition-all duration-200 active:scale-95"
          >
            Şimdi Kirala
          </Link>
        </div>
      </div>
    </div>
  );
}

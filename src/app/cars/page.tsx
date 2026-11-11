'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CarCard, { CarItemProps } from '@/components/cars/CarCard';

const CATEGORIES = ['Sport', 'SUV', 'MPV', 'Sedan', 'Coupe', 'Hatchback'];
const CAPACITIES = [
  { label: '2 Kişi', value: '2' },
  { label: '4 Kişi', value: '4' },
  { label: '6 Kişi', value: '6' },
  { label: '8 veya Daha Fazla', value: '8' },
];

function CatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [cars, setCars] = useState<CarItemProps[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [selectedTypes, setSelectedTypes] = useState<string[]>(() => {
    const t = searchParams.get('type');
    return t ? t.split(',').filter(Boolean) : [];
  });
  const [selectedCapacities, setSelectedCapacities] = useState<string[]>(() => {
    const c = searchParams.get('capacity');
    return c ? c.split(',').filter(Boolean) : [];
  });
  const [maxPrice, setMaxPrice] = useState<number>(() => {
    const p = parseFloat(searchParams.get('maxPrice') || '');
    return !isNaN(p) && p > 0 ? p : 200;
  });
  const [steering, setSteering] = useState<string>(() => {
    return searchParams.get('steering') || '';
  });
  const [sort, setSort] = useState<string>(() => {
    return searchParams.get('sort') || 'newest';
  });
  const [page, setPage] = useState<number>(() => {
    return parseInt(searchParams.get('page') || '1', 10);
  });
  const [search, setSearch] = useState<string>(() => {
    return searchParams.get('search') || '';
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Update URL and fetch data
  const fetchCars = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedTypes.length > 0) params.set('type', selectedTypes.join(','));
      if (selectedCapacities.length > 0)
        params.set('capacity', selectedCapacities.join(','));
      if (maxPrice && maxPrice < 250) params.set('maxPrice', maxPrice.toString());
      if (steering) params.set('steering', steering);
      if (sort) params.set('sort', sort);
      params.set('page', page.toString());
      params.set('limit', '12');

      const res = await fetch(`/api/cars?${params.toString()}`);
      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        setCars(json.data);
        setTotal(json.pagination.total);
        setTotalPages(json.pagination.totalPages);
      }
    } catch (err) {
      console.error('Fetch cars error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedTypes, selectedCapacities, maxPrice, steering, sort, page]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    setPage(1);
  };

  const toggleCapacity = (cap: string) => {
    setSelectedCapacities((prev) =>
      prev.includes(cap) ? prev.filter((c) => c !== cap) : [...prev, cap]
    );
    setPage(1);
  };

  const clearAllFilters = () => {
    setSelectedTypes([]);
    setSelectedCapacities([]);
    setMaxPrice(200);
    setSteering('');
    setSearch('');
    setSort('newest');
    setPage(1);
    router.push('/cars');
  };

  return (
    <div className="w-full px-margin-mobile md:px-margin max-w-[1440px] mx-auto py-space-md md:py-space-lg flex flex-col gap-space-lg">
      {/* Mobile Filter Toggle & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold">
            Araç Kataloğu
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            İhtiyacınıza ve tarzınıza en uygun aracı filtreleyin ve kolayca kiralayın.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 font-label-md text-label-md text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            <span>Filtreler ({selectedTypes.length + selectedCapacities.length + (steering ? 1 : 0)})</span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 flex items-center gap-1.5">
            <span className="font-label-sm text-label-sm text-outline hidden sm:inline">
              Sırala:
            </span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="bg-transparent border-0 outline-none font-label-md text-label-md text-on-surface font-medium cursor-pointer"
            >
              <option value="newest">En Yeni Araçlar</option>
              <option value="price_asc">Fiyat: Düşükten Yükseğe</option>
              <option value="price_desc">Fiyat: Yüksekten Düşüğe</option>
              <option value="popular">En Popüler Olanlar</option>
              <option value="rating">En Yüksek Puanlı</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar + Cars Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-space-lg items-start">
        {/* Left Sidebar Filters */}
        <aside
          className={`${
            mobileFilterOpen ? 'block' : 'hidden'
          } lg:block lg:col-span-1 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-outline-variant/20 flex flex-col gap-space-lg`}
        >
          <div className="flex items-center justify-between border-b border-surface-container-high pb-space-sm">
            <span className="font-headline-md text-headline-md text-on-surface font-bold">
              Filtreler
            </span>
            <button
              type="button"
              onClick={clearAllFilters}
              className="font-label-sm text-label-sm text-primary hover:underline font-semibold"
            >
              Temizle
            </button>
          </div>

          {/* Type Filter */}
          <div className="flex flex-col gap-space-sm">
            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Kategori / Gövde Tipi
            </h3>
            <div className="flex flex-col gap-2">
              {CATEGORIES.map((cat) => {
                const checked = selectedTypes.includes(cat);
                return (
                  <label
                    key={cat}
                    className="flex items-center justify-between group cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleType(cat)}
                        className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer"
                      />
                      <span
                        className={`font-body-md text-body-md transition-colors ${
                          checked
                            ? 'text-primary font-semibold'
                            : 'text-on-surface group-hover:text-primary'
                        }`}
                      >
                        {cat}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Capacity Filter */}
          <div className="flex flex-col gap-space-sm">
            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Kişi Kapasitesi
            </h3>
            <div className="flex flex-col gap-2">
              {CAPACITIES.map((cap) => {
                const checked = selectedCapacities.includes(cap.value);
                return (
                  <label
                    key={cap.value}
                    className="flex items-center justify-between group cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCapacity(cap.value)}
                        className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer"
                      />
                      <span
                        className={`font-body-md text-body-md transition-colors ${
                          checked
                            ? 'text-primary font-semibold'
                            : 'text-on-surface group-hover:text-primary'
                        }`}
                      >
                        {cap.label}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Transmission Buttons */}
          <div className="flex flex-col gap-space-sm">
            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Vites Türü
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSteering(steering === 'Automatic' ? '' : 'Automatic');
                  setPage(1);
                }}
                className={`px-3 py-2 rounded-lg font-label-sm text-label-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  steering === 'Automatic'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">settings</span>
                Otomatik
              </button>
              <button
                type="button"
                onClick={() => {
                  setSteering(steering === 'Manual' ? '' : 'Manual');
                  setPage(1);
                }}
                className={`px-3 py-2 rounded-lg font-label-sm text-label-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  steering === 'Manual'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">swap_driving_apps</span>
                Manuel
              </button>
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                Maksimum Günlük Fiyat
              </h3>
              <span className="font-headline-md text-headline-md text-primary font-bold">
                ${maxPrice}.00
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="250"
              step="5"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(parseFloat(e.target.value));
                setPage(1);
              }}
              className="w-full accent-primary cursor-pointer h-2 bg-surface-container-high rounded-lg appearance-none"
            />
            <div className="flex justify-between text-xs text-outline">
              <span>$30.00</span>
              <span>$250.00</span>
            </div>
          </div>
        </aside>

        {/* Right Cars Grid */}
        <section className="lg:col-span-3 flex flex-col gap-space-lg">
          {/* Active Chips Strip */}
          {(selectedTypes.length > 0 ||
            selectedCapacities.length > 0 ||
            steering ||
            search) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-label-sm text-label-sm text-outline">
                Aktif Filtreler:
              </span>
              {search && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm">
                  Arama: &quot;{search}&quot;
                  <button onClick={() => setSearch('')} className="hover:font-bold">
                    ×
                  </button>
                </span>
              )}
              {selectedTypes.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm"
                >
                  {t}
                  <button onClick={() => toggleType(t)} className="hover:font-bold">
                    ×
                  </button>
                </span>
              ))}
              {selectedCapacities.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm"
                >
                  {c} Kişi
                  <button onClick={() => toggleCapacity(c)} className="hover:font-bold">
                    ×
                  </button>
                </span>
              ))}
              {steering && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm">
                  {steering === 'Manual' ? 'Manuel' : 'Otomatik'}
                  <button onClick={() => setSteering('')} className="hover:font-bold">
                    ×
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-primary hover:underline font-label-sm text-label-sm ml-2 font-semibold"
              >
                Hepsini Sıfırla
              </button>
            </div>
          )}

          {/* Results count */}
          <div className="flex items-center justify-between text-body-sm text-outline px-1">
            <span>Toplam {total} araç bulundu</span>
          </div>

          {/* Cars Grid / Loading / Empty */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-outline-variant/15 flex flex-col justify-between h-80 animate-pulse"
                >
                  <div className="flex justify-between">
                    <div className="w-28 h-5 bg-surface-container-high rounded"></div>
                    <div className="w-6 h-6 bg-surface-container-high rounded-full"></div>
                  </div>
                  <div className="w-full h-36 bg-surface-container rounded-lg my-4"></div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="w-20 h-6 bg-surface-container-high rounded"></div>
                    <div className="w-24 h-9 bg-surface-container-high rounded-lg"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : cars.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-xl p-12 text-center flex flex-col items-center justify-center gap-4 border border-outline-variant/20 shadow-sm">
              <span className="material-symbols-outlined text-[48px] text-outline">
                no_crash
              </span>
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                Aradığınız Kriterlere Uygun Araç Bulunamadı
              </h3>
              <p className="font-body-md text-body-md text-outline max-w-md">
                Lütfen filtre seçeneklerini genişleterek veya arama terimini değiştirerek tekrar deneyiniz.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md shadow-sm transition-all"
              >
                Tüm Filtreleri Temizle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg">
              {cars.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 py-space-lg">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/30 font-label-md text-label-md text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-40 cursor-pointer"
              >
                Önceki
              </button>

              <span className="font-label-md text-label-md text-on-surface">
                Sayfa {page} / {totalPages}
              </span>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-4 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/30 font-label-md text-label-md text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-40 cursor-pointer"
              >
                Sonraki
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function CarsCatalogPage() {
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
          <CatalogContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

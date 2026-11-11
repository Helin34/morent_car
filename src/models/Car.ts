import mongoose, { Schema, Document, Model } from 'mongoose';

export type CarType = 'Sport' | 'SUV' | 'MPV' | 'Sedan' | 'Coupe' | 'Hatchback';
export type SteeringType = 'Manual' | 'Automatic';

export interface ICar extends Document {
  name: string;
  brand: string;
  type: CarType;
  gasolineCapacity: number; // litre cinsinden yakıt/menzil kapasitesi
  steering: SteeringType; // Vites türü (Manuel / Otomatik)
  seatCapacity: number; // Yolcu/koltuk sayısı
  pricePerDay: number; // Günlük ücret (USD)
  discountPricePerDay?: number; // İndirimli günlük ücret
  description: string; // Türkçe detaylı açıklama
  features: string[]; // Öne çıkan donanımlar
  availability: boolean;
  slug: string; // Ön yüzde yerel görsel eşleştirmesi için benzersiz anahtar
  assetId: string; // Görsel kimlik anahtarı
  rating: number;
  reviewCount: number;
  isPopular: boolean;
  isRecommended: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CarSchema = new Schema<ICar>(
  {
    name: {
      type: String,
      required: [true, 'Araç adı zorunludur'],
      trim: true,
      index: true,
    },
    brand: {
      type: String,
      required: [true, 'Marka adı zorunludur'],
      trim: true,
      index: true,
    },
    type: {
      type: String,
      required: [true, 'Araç tipi zorunludur'],
      enum: {
        values: ['Sport', 'SUV', 'MPV', 'Sedan', 'Coupe', 'Hatchback'],
        message: 'Geçersiz araç gövde tipi',
      },
      index: true,
    },
    gasolineCapacity: {
      type: Number,
      required: [true, 'Depo kapasitesi (litre) zorunludur'],
      min: [0, 'Depo kapasitesi 0 veya daha büyük olmalıdır'],
    },
    steering: {
      type: String,
      required: [true, 'Vites türü zorunludur'],
      enum: {
        values: ['Manual', 'Automatic'],
        message: 'Vites türü Manuel veya Otomatik olmalıdır',
      },
      index: true,
    },
    seatCapacity: {
      type: Number,
      required: [true, 'Koltuk kapasitesi zorunludur'],
      min: [1, 'Koltuk kapasitesi en az 1 kişi olmalıdır'],
      index: true,
    },
    pricePerDay: {
      type: Number,
      required: [true, 'Günlük kiralama ücreti zorunludur'],
      min: [0, 'Günlük ücret negatif olamaz'],
      index: true,
    },
    discountPricePerDay: {
      type: Number,
      min: [0, 'İndirimli ücret negatif olamaz'],
      default: undefined,
    },
    description: {
      type: String,
      required: [true, 'Araç açıklaması zorunludur'],
      trim: true,
    },
    features: {
      type: [String],
      default: [],
    },
    availability: {
      type: Boolean,
      default: true,
      index: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug tanımlayıcısı zorunludur'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    assetId: {
      type: String,
      required: [true, 'Görsel eşleme kimliği (assetId) zorunludur'],
      trim: true,
      index: true,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isPopular: {
      type: Boolean,
      default: false,
      index: true,
    },
    isRecommended: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Arama için birleşik metin indeksi
CarSchema.index({ name: 'text', brand: 'text', description: 'text' });

const Car: Model<ICar> =
  mongoose.models.Car || mongoose.model<ICar>('Car', CarSchema);

export default Car;

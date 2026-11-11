import mongoose, { Schema, Document, Model } from 'mongoose';

export type PaymentStatus = 'pending' | 'completed' | 'cancelled';

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  car: mongoose.Types.ObjectId;
  pickupLocation: string; // örn: "İstanbul - Kadıköy Rıhtım"
  pickupDate: Date;
  pickupTime: string;
  dropoffLocation: string; // örn: "İstanbul - Beşiktaş Meydanı"
  dropoffDate: Date;
  dropoffTime: string;
  totalDays: number;
  totalPrice: number;
  paymentStatus: PaymentStatus; // Negatif kısıtlama: Stripe backend yok, yalnızca durum alanı
  status: 'confirmed' | 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Kullanıcı bilgisi zorunludur'],
    },
    car: {
      type: Schema.Types.ObjectId,
      ref: 'Car',
      required: [true, 'Kiralanacak araç seçimi zorunludur'],
    },
    pickupLocation: {
      type: String,
      required: [true, 'Teslim alma lokasyonu zorunludur'],
      trim: true,
    },
    pickupDate: {
      type: Date,
      required: [true, 'Teslim alma tarihi zorunludur'],
    },
    pickupTime: {
      type: String,
      required: [true, 'Teslim alma saati zorunludur'],
    },
    dropoffLocation: {
      type: String,
      required: [true, 'Teslim etme lokasyonu zorunludur'],
      trim: true,
    },
    dropoffDate: {
      type: Date,
      required: [true, 'Teslim etme tarihi zorunludur'],
    },
    dropoffTime: {
      type: String,
      required: [true, 'Teslim etme saati zorunludur'],
    },
    totalDays: {
      type: Number,
      required: [true, 'Toplam kiralama süresi (gün) zorunludur'],
      min: [1, 'Kiralama süresi en az 1 gün olmalıdır'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Toplam tutar zorunludur'],
      min: [0, 'Toplam tutar negatif olamaz'],
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['pending', 'completed', 'cancelled'],
        message: 'Geçersiz ödeme durumu',
      },
      default: 'pending',
    },
    status: {
      type: String,
      enum: {
        values: ['confirmed', 'active', 'completed', 'cancelled'],
        message: 'Geçersiz rezervasyon durumu',
      },
      default: 'confirmed',
    },
  },
  {
    timestamps: true,
  }
);

const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;

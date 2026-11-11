import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Car from '@/models/Car';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);

    const body = await request.json();
    const {
      carId,
      pickupLocation,
      pickupDate,
      pickupTime = '09:00',
      dropoffLocation,
      dropoffDate,
      dropoffTime = '18:00',
    } = body;

    if (!carId || !pickupLocation || !pickupDate || !dropoffLocation || !dropoffDate) {
      return NextResponse.json(
        { success: false, error: 'Tüm rezervasyon alanları zorunludur' },
        { status: 400 }
      );
    }

    // Find car by ID or slug
    const carQuery = mongoose.Types.ObjectId.isValid(carId)
      ? { $or: [{ _id: carId }, { slug: carId }] }
      : { slug: carId };

    const car = await Car.findOne(carQuery);
    if (!car) {
      return NextResponse.json(
        { success: false, error: 'Kiralanacak araç bulunamadı' },
        { status: 404 }
      );
    }

    // Resolve or find User
    let userId: mongoose.Types.ObjectId;
    if (session?.user?.email) {
      const user = await User.findOne({ email: session.user.email.toLowerCase() });
      if (user) {
        userId = user._id as mongoose.Types.ObjectId;
      } else {
        const newUser = await User.create({
          name: session.user.name || 'Misafir Kullanıcı',
          email: session.user.email.toLowerCase(),
          role: 'user',
        });
        userId = newUser._id as mongoose.Types.ObjectId;
      }
    } else {
      // Find or create default demo guest user
      const guestUser = await User.findOneAndUpdate(
        { email: 'demo@morent.com' },
        { $setOnInsert: { name: 'Ahmet Yılmaz', role: 'user' } },
        { upsert: true, new: true }
      );
      userId = guestUser._id as mongoose.Types.ObjectId;
    }

    const startDate = new Date(pickupDate);
    const endDate = new Date(dropoffDate);
    const diffTime = endDate.getTime() - startDate.getTime();
    const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const totalPrice = totalDays * car.pricePerDay;

    // Create reservation with stubbed paymentStatus as per constraints (NO Stripe backend)
    const newBooking = await Booking.create({
      user: userId,
      car: car._id,
      pickupLocation,
      pickupDate: startDate,
      pickupTime,
      dropoffLocation,
      dropoffDate: endDate,
      dropoffTime,
      totalDays,
      totalPrice,
      paymentStatus: 'pending', // Kısıtlama: Stripe backend yok, taslak ödeme durumu
      status: 'confirmed',
    });

    const populatedBooking = await Booking.findById(newBooking._id)
      .populate('car', 'name brand type pricePerDay slug assetId')
      .populate('user', 'name email');

    return NextResponse.json(
      {
        success: true,
        message: 'Rezervasyonunuz başarıyla oluşturuldu',
        booking: populatedBooking,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Booking creation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || 'Rezervasyon oluşturulurken bir hata oluştu',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);

    let query: Record<string, unknown> = {};

    if (session?.user?.email) {
      const user = await User.findOne({ email: session.user.email.toLowerCase() });
      if (user && user.role !== 'admin') {
        query = { user: user._id };
      }
    }

    const bookings = await Booking.find(query)
      .populate('car', 'name brand type pricePerDay slug assetId')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: bookings,
      total: bookings.length,
    });
  } catch (error: unknown) {
    console.error('Fetch bookings error:', error);
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || 'Rezervasyonlar listelenirken bir hata oluştu',
      },
      { status: 500 }
    );
  }
}

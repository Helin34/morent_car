import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Car from '@/models/Car';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { initialCars } from '@/lib/seedData';

export async function POST() {
  try {
    await connectToDatabase();

    // 1. Seed or update Cars
    let insertedCarsCount = 0;
    for (const carData of initialCars) {
      await Car.findOneAndUpdate(
        { slug: carData.slug },
        { $set: carData },
        { upsert: true, new: true, runValidators: true }
      );
      insertedCarsCount++;
    }

    // 2. Seed a demo user and demo admin
    const demoPasswordHash = await bcrypt.hash('Morent123!', 10);

    const demoUser = await User.findOneAndUpdate(
      { email: 'demo@morent.com' },
      {
        $set: {
          name: 'Alex Johnson',
          email: 'demo@morent.com',
          passwordHash: demoPasswordHash,
          role: 'user',
        },
      },
      { upsert: true, new: true }
    );

    const demoAdmin = await User.findOneAndUpdate(
      { email: 'admin@morent.com' },
      {
        $set: {
          name: 'Admin Morent',
          email: 'admin@morent.com',
          passwordHash: demoPasswordHash,
          role: 'admin',
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Veritabanı başarıyla tohumlandı (seed edildi)',
      seeded: {
        carsCount: insertedCarsCount,
        users: [demoUser.email, demoAdmin.email],
      },
    });
  } catch (error: unknown) {
    console.error('Seeding database error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || 'Veritabanı tohumlanırken hata oluştu' },
      { status: 500 }
    );
  }
}

// Allow GET for quick manual trigger in browser/development
export async function GET() {
  return POST();
}

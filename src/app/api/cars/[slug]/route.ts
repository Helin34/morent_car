import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Car from '@/models/Car';
import mongoose from 'mongoose';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Araç slug parametresi zorunludur' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Query either by slug or by MongoDB ObjectId if slug matches ObjectId format
    const query = mongoose.Types.ObjectId.isValid(slug)
      ? { $or: [{ slug: slug.toLowerCase() }, { _id: slug }] }
      : { slug: slug.toLowerCase() };

    const car = await Car.findOne(query).lean();

    if (!car) {
      return NextResponse.json(
        { success: false, error: 'Aradığınız araç bulunamadı' },
        { status: 404 }
      );
    }

    // Fetch up to 4 similar or recommended vehicles (same type or brand)
    const relatedCars = await Car.find({
      _id: { $ne: car._id },
      $or: [{ type: car.type }, { brand: car.brand }],
      availability: true,
    })
      .limit(4)
      .lean();

    return NextResponse.json({
      success: true,
      data: car,
      related: relatedCars,
    });
  } catch (error: unknown) {
    console.error('Car detail API error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || 'Araç detayları alınırken bir hata oluştu' },
      { status: 500 }
    );
  }
}

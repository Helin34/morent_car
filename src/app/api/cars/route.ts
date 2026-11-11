import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Car, { ICar } from '@/models/Car';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = request.nextUrl;

    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)));
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = { availability: true };

    // Search query (name, brand, or type)
    const search = searchParams.get('search')?.trim();
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } },
      ];
    }

    // Vehicle Type filter (comma separated, e.g. "Sport,SUV")
    const typeParam = searchParams.get('type');
    if (typeParam) {
      const types = typeParam.split(',').map((t) => t.trim()).filter(Boolean);
      if (types.length > 0) {
        query.type = { $in: types };
      }
    }

    // Capacity filter (comma separated, e.g. "2,4,6,8")
    const capacityParam = searchParams.get('capacity');
    if (capacityParam) {
      const capacities = capacityParam
        .split(',')
        .map((c) => parseInt(c.trim(), 10))
        .filter((c) => !isNaN(c));

      if (capacities.length > 0) {
        // If 8 or more is included
        const hasEightOrMore = capacities.some((c) => c >= 8);
        const exactCapacities = capacities.filter((c) => c < 8);

        if (hasEightOrMore && exactCapacities.length > 0) {
          query.$or = [
            ...(query.$or || []),
            { seatCapacity: { $in: exactCapacities } },
            { seatCapacity: { $gte: 8 } },
          ];
        } else if (hasEightOrMore) {
          query.seatCapacity = { $gte: 8 };
        } else {
          query.seatCapacity = { $in: exactCapacities };
        }
      }
    }

    // Max daily price filter
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '');
    if (!isNaN(maxPrice) && maxPrice > 0) {
      query.pricePerDay = { ...(query.pricePerDay || {}), $lte: maxPrice };
    }

    // Min daily price filter
    const minPrice = parseFloat(searchParams.get('minPrice') || '');
    if (!isNaN(minPrice) && minPrice >= 0) {
      query.pricePerDay = { ...(query.pricePerDay || {}), $gte: minPrice };
    }

    // Steering / Transmission filter
    const steering = searchParams.get('steering')?.trim();
    if (steering && (steering === 'Manual' || steering === 'Automatic')) {
      query.steering = steering;
    }

    // Popular filter
    const popularParam = searchParams.get('popular');
    if (popularParam === 'true') {
      query.isPopular = true;
    }

    // Recommended filter
    const recommendedParam = searchParams.get('recommended');
    if (recommendedParam === 'true') {
      query.isRecommended = true;
    }

    // Sorting
    const sortParam = searchParams.get('sort') || 'newest';
    let sortOptions: Record<string, 1 | -1> = { createdAt: -1 };

    switch (sortParam) {
      case 'price_asc':
        sortOptions = { pricePerDay: 1 };
        break;
      case 'price_desc':
        sortOptions = { pricePerDay: -1 };
        break;
      case 'popular':
        sortOptions = { isPopular: -1, rating: -1, reviewCount: -1 };
        break;
      case 'rating':
        sortOptions = { rating: -1, reviewCount: -1 };
        break;
      case 'newest':
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    const [cars, total] = await Promise.all([
      Car.find(query).sort(sortOptions).skip(skip).limit(limit).lean(),
      Car.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: cars,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error: unknown) {
    console.error('Car catalog API error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || 'Araçlar listelenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

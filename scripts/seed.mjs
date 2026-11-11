import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// .env.local dosyasını oku
const envPath = path.resolve(process.cwd(), '.env.local');
let mongodbUri = process.env.MONGODB_URI;

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...values] = trimmed.split('=');
      if (key && values.length > 0) {
        process.env[key.trim()] = values.join('=').trim();
      }
    }
  }
  mongodbUri = process.env.MONGODB_URI || mongodbUri;
}

mongodbUri = mongodbUri || 'mongodb://localhost:27017/morent';

const CarSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    type: { type: String, required: true },
    gasolineCapacity: { type: Number, required: true },
    steering: { type: String, required: true },
    seatCapacity: { type: Number, required: true },
    pricePerDay: { type: Number, required: true },
    discountPricePerDay: { type: Number },
    description: { type: String, required: true },
    features: { type: [String], default: [] },
    availability: { type: Boolean, default: true },
    slug: { type: String, required: true, unique: true },
    assetId: { type: String, required: true },
    rating: { type: Number, default: 4.5 },
    reviewCount: { type: Number, default: 0 },
    isPopular: { type: Boolean, default: false },
    isRecommended: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String },
    image: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

const Car = mongoose.models.Car || mongoose.model('Car', CarSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

const initialCars = [
  {
    name: 'Koenigsegg',
    brand: 'Koenigsegg',
    type: 'Sport',
    gasolineCapacity: 90,
    steering: 'Manual',
    seatCapacity: 2,
    pricePerDay: 99.0,
    description:
      'Hafif karbon fiber şasisi, çift turbo beslemeli motoru ve aerodinamik tasarımıyla saf pist performansını ve hız tutkusunu yollara taşıyan mega spor otomobil.',
    features: ['Çift Turbo V8', 'Aktif Aerodinamik Kanat', 'Karbon Seramik Frenler', 'Sport Egzoz Sistemi', 'Premium Bluetooth Ses'],
    availability: true,
    slug: 'koenigsegg',
    assetId: 'koenigsegg',
    rating: 4.9,
    reviewCount: 320,
    isPopular: true,
    isRecommended: false,
  },
  {
    name: 'Nissan GT - R',
    brand: 'Nissan',
    type: 'Sport',
    gasolineCapacity: 80,
    steering: 'Manual',
    seatCapacity: 2,
    pricePerDay: 80.0,
    discountPricePerDay: 100.0,
    description:
      "NISMO'nun yarış pistlerindeki benzersiz deneyiminden ilham alan, üstün yol tutuşu ve ikonik çift yuvarlak stop tasarımıyla efsanevi dört çeker performans.",
    features: ['ATTESA E-TS Dört Çeker', 'Brembo Yüksek Performans Frenleri', 'Bose Ses Sistemi', 'Sürüş Modu Seçici', 'Çift Bölgeli Dijital Klima'],
    availability: true,
    slug: 'nissan-gt-r',
    assetId: 'nissan-gt-r',
    rating: 4.4,
    reviewCount: 440,
    isPopular: true,
    isRecommended: false,
  },
  {
    name: 'Rolls - Royce',
    brand: 'Rolls-Royce',
    type: 'Sedan',
    gasolineCapacity: 70,
    steering: 'Manual',
    seatCapacity: 4,
    pricePerDay: 96.0,
    description:
      'Kusursuz el işçiliği deri döşemeleri, yıldız tavan aydınlatması ve fısıltı sessizliğindeki akustik kabin yalıtımıyla lüksün ve prestijin zirvesi.',
    features: ['Yıldızlı Tavan Aydınlatması', 'Akustik Ses Yalıtımı', 'Arka Makam Koltukları', 'Havalı Süspansiyon (Air Suspension)', 'Ahşap Kaplama Konsol'],
    availability: true,
    slug: 'rolls-royce',
    assetId: 'rolls-royce',
    rating: 4.9,
    reviewCount: 280,
    isPopular: true,
    isRecommended: false,
  },
  {
    name: 'Porsche 911 GT3',
    brand: 'Porsche',
    type: 'Sport',
    gasolineCapacity: 64,
    steering: 'Automatic',
    seatCapacity: 2,
    pricePerDay: 150.0,
    description:
      'Atmosferik boxer motor sesi, yarış kökenli şasi ayarları ve milimetrik direksiyon tepkisiyle motor sporları tutkunları için üretilmiş kusursuz bir sürüş makinesi.',
    features: ['4.0L Atmosferik Boxer Motor', 'PDK Çift Kavramalı Şanzıman', 'Arka Aks Yönlendirme', 'Karbon Çanak Koltuklar', 'Sport Chrono Paketi'],
    availability: true,
    slug: 'porsche-911-gt3',
    assetId: 'porsche-911-gt3',
    rating: 4.8,
    reviewCount: 195,
    isPopular: true,
    isRecommended: false,
  },
  {
    name: 'All New Rush',
    brand: 'Daihatsu',
    type: 'SUV',
    gasolineCapacity: 70,
    steering: 'Manual',
    seatCapacity: 6,
    pricePerDay: 72.0,
    discountPricePerDay: 80.0,
    description:
      'Yüksek alt açıklığı, 6 kişilik geniş modüler iç hacmi ve her türlü yol koşulunda sunduğu güven veren sürüş dinamikleriyle modern bir şehir ve seyahat SUV modeli.',
    features: ['Tavan Rayları', 'Geri Görüş Kamerası', 'LED Farlar', 'Dokunmatik Multimedya Ekranı', 'Katlanabilir 3. Sıra Koltuklar'],
    availability: true,
    slug: 'all-new-rush',
    assetId: 'all-new-rush',
    rating: 4.6,
    reviewCount: 310,
    isPopular: false,
    isRecommended: true,
  },
  {
    name: 'CR - V',
    brand: 'Honda',
    type: 'SUV',
    gasolineCapacity: 80,
    steering: 'Manual',
    seatCapacity: 6,
    pricePerDay: 80.0,
    description:
      'Ferah aile yaşam alanı, sessiz kabin konforu ve gelişmiş Honda Sensing aktif güvenlik sistemleriyle uzun yolculuklarda eşsiz konfor sağlayan SUV.',
    features: ['Honda Sensing Güvenlik Paketi', 'Panoramik Cam Tavan', 'Elektrikli Akıllı Bagaj Kapağı', 'Apple CarPlay & Android Auto', 'Isıtmalı Ön Koltuklar'],
    availability: true,
    slug: 'cr-v',
    assetId: 'cr-v',
    rating: 4.7,
    reviewCount: 520,
    isPopular: false,
    isRecommended: true,
  },
  {
    name: 'All New Terios',
    brand: 'Daihatsu',
    type: 'SUV',
    gasolineCapacity: 90,
    steering: 'Manual',
    seatCapacity: 6,
    pricePerDay: 74.0,
    description:
      'Dayanıklı gövde yapısı, dik yokuşlarda dahi kararlı sürüş kabiliyeti ve kalabalık seyahatler için ideal 6 kişilik ergonomik iç mekanıyla doğa ve gezi dostu araç.',
    features: ['Anahtarsız Çalıştırma', 'Yokuş Kalkış Desteği', 'Dijital Klima Paneli', '360 Derece Çevre Görüş Kamerası', '6 Adet Güvenlik Hava Yastığı'],
    availability: true,
    slug: 'all-new-terios',
    assetId: 'all-new-terios',
    rating: 4.5,
    reviewCount: 180,
    isPopular: false,
    isRecommended: true,
  },
  {
    name: 'MG ZX Exclusive',
    brand: 'MG',
    type: 'SUV',
    gasolineCapacity: 70,
    steering: 'Manual',
    seatCapacity: 4,
    pricePerDay: 76.0,
    discountPricePerDay: 80.0,
    description:
      'Köklü İngiliz tasarım mirasını modern hatlar ve geniş panoramik tavanla buluşturan, şehir içinde atak ve son derece ekonomik kompakt SUV.',
    features: ['Deri Döşeme Koltuklar', 'Panoramik Sky-Roof', 'Hız Sabitleyici (Cruise Control)', 'Kör Nokta Uyarı Sistemi', '10.1 inç Renkli Dokunmatik Ekran'],
    availability: true,
    slug: 'mg-zx-exclusive',
    assetId: 'mg-zx-exclusive',
    rating: 4.6,
    reviewCount: 215,
    isPopular: false,
    isRecommended: true,
  },
  {
    name: 'New MG ZS',
    brand: 'MG',
    type: 'SUV',
    gasolineCapacity: 80,
    steering: 'Manual',
    seatCapacity: 6,
    pricePerDay: 80.0,
    description:
      'Yüksek sürüş pozisyonu, dinamik elmas kesim ön ızgarası ve geniş bagaj kapasitesiyle ailelerin ve genç gezginlerin gözdesi olan SUV.',
    features: ['Tam Dijital Hayalet Gösterge', 'Geri Görüş Kamerası', 'Sentetik Deri Konfor Koltuklar', 'Hıza Duyarlı Kapı Kilitleri', 'Bi-LED Farlar'],
    availability: true,
    slug: 'new-mg-zs',
    assetId: 'new-mg-zs',
    rating: 4.5,
    reviewCount: 160,
    isPopular: false,
    isRecommended: true,
  },
  {
    name: 'MG ZX Excite',
    brand: 'MG',
    type: 'Sedan',
    gasolineCapacity: 90,
    steering: 'Manual',
    seatCapacity: 4,
    pricePerDay: 74.0,
    description:
      'Akıcı fastback tavan silüeti, yakıt tasarruflu motoru ve net tepkiler veren çevik direksiyon yapısıyla şehirde fark yaratan konforlu sedan.',
    features: ['Sportif Fastback Gövde', 'Akıllı Anahtarsız Giriş', 'Arka Havalandırma Kanalları', 'Elektronik Denge Programı (ESP)', 'Elektrik Destekli Direksiyon'],
    availability: true,
    slug: 'mg-zx-excite',
    assetId: 'mg-zx-excite',
    rating: 4.4,
    reviewCount: 140,
    isPopular: false,
    isRecommended: true,
  },
  {
    name: 'BMW M4 Coupe',
    brand: 'BMW',
    type: 'Coupe',
    gasolineCapacity: 59,
    steering: 'Automatic',
    seatCapacity: 4,
    pricePerDay: 115.0,
    description:
      'Çift turbo beslemeli sıralı 6 silindirli M motoru, agresif böbrek ızgaraları ve mükemmel ağırlık dağılımıyla spor coupe sınıfının referans noktası.',
    features: ['M TwinPower Turbo 6 Silindir', 'M Karbon Çanak Koltuklar', 'Harman Kardon Çevresel Ses', 'Adaptif M Süspansiyon', 'Head-Up Display'],
    availability: true,
    slug: 'bmw-m4-coupe',
    assetId: 'bmw-m4-coupe',
    rating: 4.8,
    reviewCount: 390,
    isPopular: false,
    isRecommended: true,
  },
  {
    name: 'Mercedes-Benz V-Class',
    brand: 'Mercedes-Benz',
    type: 'MPV',
    gasolineCapacity: 70,
    steering: 'Automatic',
    seatCapacity: 8,
    pricePerDay: 135.0,
    description:
      '8 kişilik VIP oturma düzeni, karşılıklı toplantı yapabilen kaptan koltukları ve birinci sınıf seyahat konforu sunan lüks çok amaçlı taşıt.',
    features: ['8 Kişilik VIP Oturma Düzeni', 'Çift Elektrikli Sürgülü Kapı', 'MBUX Sesli Komutlu Navigasyon', 'Burmester Ses Sistemi', 'Aktif Fren Yardımcısı'],
    availability: true,
    slug: 'mercedes-benz-v-class',
    assetId: 'mercedes-benz-v-class',
    rating: 4.9,
    reviewCount: 220,
    isPopular: false,
    isRecommended: false,
  },
  {
    name: 'Audi RS6 Avant',
    brand: 'Audi',
    type: 'Sedan',
    gasolineCapacity: 73,
    steering: 'Automatic',
    seatCapacity: 5,
    pricePerDay: 145.0,
    description:
      'Süper spor otomobil gücünü geniş bagaj alanı ve quattro dört tekerlekten çekiş teknolojisiyle buluşturan, her mevsime uygun performans ikonu.',
    features: ['4.0L Çift Turbo V8', 'quattro Sürekli Dört Çeker', 'RS Adaptif Havalı Süspansiyon', 'Bang & Olufsen 3D Gelişmiş Ses', 'Audi Sanal Kokpit Plus'],
    availability: true,
    slug: 'audi-rs6-avant',
    assetId: 'audi-rs6-avant',
    rating: 4.9,
    reviewCount: 310,
    isPopular: false,
    isRecommended: false,
  },
  {
    name: 'Tesla Model S Plaid',
    brand: 'Tesla',
    type: 'Sport',
    gasolineCapacity: 0,
    steering: 'Automatic',
    seatCapacity: 5,
    pricePerDay: 125.0,
    description:
      'Üç elektrikli motoruyla 0-100 km/s hızlanmasını 2.1 saniyenin altında tamamlayan, otopilot ve yüksek teknolojiye sahip tamamen elektrikli sedan.',
    features: ['Üç Motorlu Dört Çeker (AWD)', 'Gelişmiş Otopilot Donanımı', '17 inç Sinematik Dokunmatik Ekran', 'Yoke Yarış Tipi Direksiyon', 'Entegre Oyun Konsolu'],
    availability: true,
    slug: 'tesla-model-s-plaid',
    assetId: 'tesla-model-s-plaid',
    rating: 4.7,
    reviewCount: 480,
    isPopular: false,
    isRecommended: false,
  },
  {
    name: 'Toyota Alphard',
    brand: 'Toyota',
    type: 'MPV',
    gasolineCapacity: 65,
    steering: 'Automatic',
    seatCapacity: 8,
    pricePerDay: 120.0,
    description:
      'Yatar pozisyona gelebilen Ottoman business-class koltukları, özel tavan ambiyans aydınlatması ve sarsıntısız otoyol konforuyla seçkin VIP yolculuklar.',
    features: ['Business Class Ottoman Koltuklar', 'Çift Elektrikli Açılır Cam Tavan', 'JBL Premium Surround Ses', 'Toyota Safety Sense', 'Nanoe Hava Temizleme'],
    availability: true,
    slug: 'toyota-alphard',
    assetId: 'toyota-alphard',
    rating: 4.8,
    reviewCount: 190,
    isPopular: false,
    isRecommended: false,
  },
  {
    name: 'Volkswagen Golf R',
    brand: 'Volkswagen',
    type: 'Hatchback',
    gasolineCapacity: 55,
    steering: 'Automatic',
    seatCapacity: 5,
    pricePerDay: 68.0,
    description:
      'Tork yönlendirmeli 4MOTION dört çeker sistemi, Nürburgring yarış modu ve şehir içine uyumlu kompakt boyutlarıyla gerçek bir spor hatchback.',
    features: ['4MOTION Tork Vektörleme Dört Çeker', 'Drift & Özel Nürburgring Sürüş Modu', 'Dijital Kokpit Pro', 'Harman Kardon Ses', 'IQ.LIGHT Matrix LED Farlar'],
    availability: true,
    slug: 'volkswagen-golf-r',
    assetId: 'volkswagen-golf-r',
    rating: 4.6,
    reviewCount: 260,
    isPopular: false,
    isRecommended: false,
  },
];

async function seed() {
  console.log(`MongoDB bağlantısı kuruluyor: ${mongodbUri}...`);
  await mongoose.connect(mongodbUri);
  console.log('MongoDB bağlantısı başarıyla sağlandı.');

  console.log(`${initialCars.length} adet araç sisteme ekleniyor / güncelleniyor...`);
  for (const car of initialCars) {
    await Car.findOneAndUpdate({ slug: car.slug }, { $set: car }, { upsert: true });
    console.log(`- Güncellendi: ${car.name} (${car.slug})`);
  }

  console.log('Demo kullanıcılar oluşturuluyor...');
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Morent123!', salt);

  await User.findOneAndUpdate(
    { email: 'demo@morent.com' },
    {
      $set: {
        name: 'Ahmet Yılmaz',
        email: 'demo@morent.com',
        passwordHash,
        role: 'user',
      },
    },
    { upsert: true }
  );
  console.log('- Demo kullanıcı hazır: demo@morent.com (Şifre: Morent123!)');

  await User.findOneAndUpdate(
    { email: 'admin@morent.com' },
    {
      $set: {
        name: 'Yönetici Morent',
        email: 'admin@morent.com',
        passwordHash,
        role: 'admin',
      },
    },
    { upsert: true }
  );
  console.log('- Yönetici hazır: admin@morent.com (Şifre: Morent123!)');

  console.log('\nVeritabanı tohumlama işlemi başarıyla tamamlandı!');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Tohumlama hatası:', err);
  process.exit(1);
});

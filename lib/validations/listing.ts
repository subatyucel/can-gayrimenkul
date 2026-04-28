import * as z from 'zod';

export const featureOptions = {
  ROOM: [
    '1+0',
    '1+1',
    '2+1',
    '2+2',
    '3+1',
    '3+2',
    '4+1',
    '4+2',
    '5+1',
    '5+2',
    '6+',
  ],

  KITCHEN: ['Açık Mutfak', 'Kapalı Mutfak', 'Amerikan Mutfak'],
  PARKING: ['Açık Otopark', 'Kapalı Otopark', 'Yok', 'Açık ve Kapalı Otopark'],
  HEATING: [
    'Yok',
    'Doğalgaz (Kombi)',
    'Merkezi',
    'Yerden Isıtma',
    'Klima',
    'Soba',
  ],
  FLOOR: [
    'Bodrum',
    'Zemin',
    'Yüksek Giriş',
    'Kot Altı 1',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '20+',
  ],
};

export const listingSchema = z.object({
  title: z.string().trim().min(5, 'İlan başlığı en az 5 harften oluşmalıdır.'),
  description: z
    .string()
    .trim()
    .min(5, 'Açıklama en az 5 harften oluşmalıdır.'),
  listingType: z.enum(['sale', 'rent'], 'İlan türü seçilmelidir.'),
  price: z.coerce
    .number<string>()
    .min(1, 'Fiyat bilgisi pozitif bir değer olmalı.'),
  districtId: z.coerce.number<string>().min(1, 'İlçe seçimi yapılmalıdır.'),
  neighborhoodId: z.coerce
    .number<string>()
    .min(1, 'Mahalle seçimi yapılmalıdır.'),
  roomCount: z.enum(featureOptions.ROOM, 'Oda sayısı seçilmelidir.'),
  netSquareMeters: z.coerce
    .number<string>()
    .min(1, 'Net m² bilgisi girilmelidir.'),
  grossSquareMeters: z.coerce
    .number<string>()
    .min(1, 'Brüt m² bilgisi girilmelidir.'),
  buildingAge: z.coerce
    .number<string>()
    .nonnegative('Bina yaşı negatif olamaz.'),
  floorAt: z.enum(featureOptions.FLOOR, 'Kat bilgisi seçilmelidir.'),
  totalFloor: z.coerce.number<string>().positive('Tek kat için 1 yazınız.'),
  bathroomCount: z.coerce
    .number<string>()
    .nonnegative('Banyo sayısı negatif olamaz'),
  kitchenType: z.enum(featureOptions.KITCHEN, 'Mutfak tipi seçilmelidir.'),
  heating: z.enum(featureOptions.HEATING, 'Isıtma tipi seçilmelidir.'),
  parking: z.enum(featureOptions.PARKING, 'Otopark tipi seçilmelidir.'),
  dues: z.coerce.number<string>().nonnegative('Aidat negatif olamaz.'),
  balcony: z.boolean().default(false),
  elevator: z.boolean().default(false),
  furnished: z.boolean().default(false),
  creditworthy: z.boolean().default(false),
  images: z
    .array(
      z
        .file()
        .max(5 * 1024 * 1024, 'Her fotoğraf maksimum 5MB olabilir.')
        .mime(
          ['image/jpeg', 'image/png', 'image/webp', 'image/heic'],
          'Sadece JPG, PNG veya WEBP formatları desteklenir.',
        ),
    )
    .min(1, 'İlanın en az 1 fotoğrafı olmalıdır.'),
});

const CLOUDINARY_DOMAIN = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/`;
const PROJECT_FOLDER = `assets/${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`;

export const imageUrlsSchema = z.array(
  z
    .url('Geçersiz fotoğraf URL')
    .startsWith(CLOUDINARY_DOMAIN, 'Geçersiz fotoğraf URL')
    .includes(PROJECT_FOLDER, 'Geçersiz fotoğraf URL'),
);

export const serverListingSchema = listingSchema.omit({ images: true });
export type CreateListingPayload = z.infer<typeof serverListingSchema>;

export type ListingFormInput = z.input<typeof listingSchema>;
export type ListingFormOutput = z.infer<typeof listingSchema>;

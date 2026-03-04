import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import fs from "fs";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const dosyaYolu = "ilce-mahalle.csv";

  if (!fs.existsSync(dosyaYolu)) {
    console.error(
      `\nHATA: ${dosyaYolu} dosyası bulunamadı! İsmini kontrol et.\n`,
    );
    return;
  }

  const csvData = fs.readFileSync(dosyaYolu, "utf8");
  const satirlar = csvData
    .split(/\r?\n/)
    .filter((satir) => satir.trim() !== "");

  if (satirlar.length < 2) {
    console.error("\nHATA: CSV dosyası boş veya sadece başlıktan oluşuyor!\n");
    return;
  }

  const basliklar = satirlar[0]
    .split(/[,;]/)
    .map((h) => h.replace(/"/g, "").trim().toUpperCase());
  const ilceIndex = basliklar.findIndex(
    (h) => h.includes("ILCE") || h.includes("İLÇE"),
  );
  const mahalleIndex = basliklar.findIndex((h) => h.includes("MAHALLE"));

  if (ilceIndex === -1 || mahalleIndex === -1) {
    console.error(
      "\nHATA: CSV dosyasında İlçe veya Mahalle sütunları tespit edilemedi!\n",
    );
    return;
  }

  const districtMap = new Map<string, string[]>();

  for (let i = 1; i < satirlar.length; i++) {
    const sutunlar = satirlar[i].split(/[,;]/);

    const ilceAdi = sutunlar[ilceIndex]?.replace(/"/g, "").trim();
    const mahalleAdi = sutunlar[mahalleIndex]?.replace(/"/g, "").trim();

    if (ilceAdi && mahalleAdi) {
      if (!districtMap.has(ilceAdi)) {
        districtMap.set(ilceAdi, []);
      }
      districtMap.get(ilceAdi)?.push(mahalleAdi);
    }
  }

  console.log(
    `\nToplam ${districtMap.size} ilçe bulundu. Supabase'e kayıt başlıyor...\n`,
  );

  for (const [ilceAdi, mahalleler] of districtMap.entries()) {
    await prisma.district.create({
      data: {
        name: ilceAdi,
        neighborhoods: {
          create: mahalleler.map((mahalleAdi) => ({
            name: mahalleAdi,
          })),
        },
      },
    });

    console.log(
      `✅ ${ilceAdi} ilçesi ve ${mahalleler.length} mahallesi kaydedildi.`,
    );
  }

  console.log("\n🎉 Bütün harita veritabanına başarıyla işlendi!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

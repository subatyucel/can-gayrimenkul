import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import fs from "fs";
import bcrypt from "bcrypt";

const connectionString = process.env.DATABASE_URL as string;
const adminEmail = process.env.ADMIN_EMAIL as string;
const plainPassword = process.env.ADMIN_PASSWORD as string;
const adminName = process.env.ADMIN_NAME as string;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Connecting to database...");
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      fullName: adminName,
      password: hashedPassword,
      role: "owner",
    },
  });

  console.log(`Admin account is ready: ${admin.email}`);

  const filePath = "ilce-mahalle.csv";

  if (!fs.existsSync(filePath)) {
    console.error(
      `\nERROR: File ${filePath} not found! Check the file name.\n`,
    );
    return;
  }

  const csvData = fs.readFileSync(filePath, "utf8");
  const rows = csvData.split(/\r?\n/).filter((row) => row.trim() !== "");

  if (rows.length < 2) {
    console.error("\nERROR: CSV file is either empty or has only headers!\n");
    return;
  }

  const headers = rows[0]
    .split(/[,;]/)
    .map((h) => h.replace(/"/g, "").trim().toUpperCase());

  const districtIndex = headers.findIndex(
    (h) => h.includes("ILCE") || h.includes("İLÇE"),
  );
  const neighborhoodIndex = headers.findIndex((h) => h.includes("MAHALLE"));

  if (districtIndex === -1 || neighborhoodIndex === -1) {
    console.error(
      "\nERROR: District or Neighborhood columns could not be found in the CSV file!\n",
    );
    return;
  }

  const districtMap = new Map<string, string[]>();

  for (let i = 1; i < rows.length; i++) {
    const columns = rows[i].split(/[,;]/);

    const districtName = columns[districtIndex]?.replace(/"/g, "").trim();
    const neighborhoodName = columns[neighborhoodIndex]
      ?.replace(/"/g, "")
      .trim();

    if (districtName && neighborhoodName) {
      if (!districtMap.has(districtName)) {
        districtMap.set(districtName, []);
      }
      districtMap.get(districtName)?.push(neighborhoodName);
    }
  }

  console.log(
    `\nFound ${districtMap.size} districts in total. Starting to save to Supabase...\n`,
  );

  for (const [districtName, neighborhoods] of districtMap.entries()) {
    await prisma.district.create({
      data: {
        name: districtName,
        neighborhoods: {
          create: neighborhoods.map((neighborhoodName) => ({
            name: neighborhoodName,
          })),
        },
      },
    });

    console.log(
      `✅ District ${districtName} and its ${neighborhoods.length} neighborhoods have been saved.`,
    );
  }

  console.log("\n🎉 All data has been successfully saved to the database!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

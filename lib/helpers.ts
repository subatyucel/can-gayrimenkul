import { prisma } from './prisma';
import slugify from 'slugify';

export async function generateUniqueSlug(title: string) {
  let slug = slugify(title, { lower: true, strict: true, locale: 'tr' });
  let counter = 1;

  while (true) {
    const existing = await prisma.listing.findUnique({ where: { slug } });

    if (!existing) {
      break;
    }

    slug = `${slug}-${counter}`;
    counter++;
  }

  return slug;
}

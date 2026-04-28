'use server';

import { ActionResponseFactory } from '@/lib/action-response';
import { prisma } from '@/lib/prisma';

export async function getDistricts() {
  try {
    const districts = await prisma.district.findMany({
      orderBy: { name: 'asc' },
    });

    return ActionResponseFactory.success(
      'İlçeler başarıyla getirildi.',
      districts,
    );
  } catch (error) {
    console.error('💥💥 getDistricts action error: ', error);
    return ActionResponseFactory.error('İlçeler getirilirken bir hata oluştu.');
  }
}

export async function getNeighborhoods(districtId: number) {
  try {
    const neighborhoods = await prisma.neighborhood.findMany({
      where: { districtId },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });

    return ActionResponseFactory.success(
      'Mahalleler başarıyla getirildi.',
      neighborhoods,
    );
  } catch (error) {
    console.error('💥💥 getNeighborhoods action error: ', error);
    return ActionResponseFactory.error(
      'Mahalleler getirilirken bir hata oluştu.',
    );
  }
}

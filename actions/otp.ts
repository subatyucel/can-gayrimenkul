'use server';

import { ActionResponseFactory } from '@/lib/action-response';
import { sendOtpMail } from '@/lib/mail';
import { prisma } from '@/lib/prisma';
type OtpType = 'REGISTER' | 'CHANGE_PASSWORD' | 'CHANGE_EMAIL';

export async function generateAndSendOtp(email: string, type: OtpType) {
  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Valid for 10 mins

    await prisma.otpToken.deleteMany({ where: { email, type } });
    await prisma.otpToken.create({
      data: { email, code, type, expiresAt },
    });

    await sendOtpMail(email, 'fkds', code);
    return ActionResponseFactory.success('Kod mail adresine gönderildi.');
  } catch (error) {
    console.error('💥💥 generateAndSendOtp action error: ', error);
    return ActionResponseFactory.error(
      'Kod gönderilirken bir hata meydana geldi.',
    );
  }
}

export async function verifyOtp(email: string, code: string, type: OtpType) {
  try {
    const existingCode = await prisma.otpToken.findUnique({
      where: { email_type: { email, type } },
    });

    if (!existingCode || existingCode.code !== code) {
      return ActionResponseFactory.error('Geçersiz kod!');
    }

    if (existingCode.expiresAt < new Date()) {
      return ActionResponseFactory.error(
        'Kodun süresi dolmuş. Yeniden talep edin.',
      );
    }

    await prisma.otpToken.delete({
      where: { id: existingCode.id },
    });

    return ActionResponseFactory.success('Kod doğrulandı.');
  } catch (error) {
    console.error('💥💥 verifyOtp eror: ', error);
    return ActionResponseFactory.error(
      'Kod doğrulanırken bir hata meydana geldi.',
    );
  }
}

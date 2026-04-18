'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify, SignJWT } from 'jose';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import {
  LoginFormValues,
  loginSchema,
  RegisterFormValues,
  registerSchema,
} from '@/lib/validations/validations';
import { createSession, verifyToken } from '@/lib/auth';
import { ActionResponseFactory, formatZodErrors } from '@/lib/action-response';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function registerUser(formValues: RegisterFormValues) {
  try {
    const { data, error, success } = registerSchema.safeParse(formValues);

    if (!success) {
      return ActionResponseFactory.error(
        'Lütfen formdaki alanları uygun değerler ile doldurun!',
        formatZodErrors(error),
      );
    }

    const payload = await verifyToken(data.token);
    if (!payload || payload.purpose !== 'invite') {
      return ActionResponseFactory.error(
        'Davet linkiniz geçerli değil! Lütfen yöneticiniz ile görüşün.',
      );
    }

    const isUserExist = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (isUserExist) {
      return ActionResponseFactory.error(
        'Bu mail adresi kullanımda. Şifremi unuttum ekranından şifrenizi sıfırlayabilirsiniz.',
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const { confirmPassword, token, ...dbData } = data;

    await prisma.$transaction([
      prisma.user.create({
        data: { ...dbData, password: hashedPassword, role: 'admin' },
      }),
    ]);

    return ActionResponseFactory.success(
      'Kayıt işlemi başarılı. Bilgilerinizle giriş yapabilirsiniz.',
    );
  } catch (error) {
    console.error('💥💥Register action error', error);
    return ActionResponseFactory.error(
      'Sunucu tarafında beklenmeyen bir hata oluştu.',
    );
  }
}

export async function login(formValues: LoginFormValues) {
  try {
    const { data, error, success } = loginSchema.safeParse(formValues);
    if (!success) {
      return ActionResponseFactory.error(
        'Lütfen formdaki alanları uygun değerler ile doldurun!',
        formatZodErrors(error),
      );
    }

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      return ActionResponseFactory.error('Giriş bilgileri hatalı!');
    }

    await createSession(user.id, user.role);

    return ActionResponseFactory.success('Başarıyla giriş yapıldı!');
  } catch (error) {
    console.error('💥💥Login action error: ', error);
    return ActionResponseFactory.error(
      'Sunucu tarafında beklenmeyen bir hata oluştu.',
    );
  }
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function logout() {
  const cookieStore = await cookies();

  cookieStore.set('admin_session', '', {
    path: '/',
    maxAge: 0,
  });

  redirect('/admin/login');
}

const RequestResetSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi girin!'),
});

export async function requestPasswordReset(formData: FormData) {
  const parsed = RequestResetSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { email } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return {
      success: 'Eğer bu e-posta kayıtlıysa, şifre sıfırlama linki gönderildi.',
    };
  }

  const token = await new SignJWT({ purpose: 'password-reset', email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30m')
    .sign(SECRET);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const resetLink = `${baseUrl}/admin/sifremi-unuttum/${token}`;

  await transporter.sendMail({
    from: `"Can Gayrimenkul" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Şifre Sıfırlama',
    html: `
    <h2>Şifre Sıfırlama</h2>
    <p>Merhaba ${user.fullName},</p>
    <p>Şifrenizi sıfırlamak için aşağıdaki butona tıklayın. Bu link 30 dakika geçerlidir.</p>
    <a href="${resetLink}" style="display:inline-block;padding:12px 24px;background:#0f172a;color:#fff;text-decoration:none;border-radius:6px;margin:16px 0;">Şifremi Sıfırla</a>
    <p style="color:#666;font-size:13px;">Bu işlemi siz yapmadıysanız bu e-postayı görmezden gelin.</p>
  `,
  });

  return {
    success: 'Eğer bu e-posta kayıtlıysa, şifre sıfırlama linki gönderildi.',
  };
}

const ResetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Token gerekli!'),
    newPassword: z.string().min(6, 'Şifre en az 6 karakter olmalıdır!'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Şifreler eşleşmiyor!',
    path: ['confirmPassword'],
  });

export async function resetPasswordWithToken(formData: FormData) {
  const parsed = ResetPasswordSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { token, newPassword } = parsed.data;

  let email: string;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    if (payload.purpose !== 'password-reset') {
      return { error: 'Geçersiz link!' };
    }
    email = payload.email as string;
  } catch {
    return { error: 'Şifre sıfırlama linki geçersiz veya süresi dolmuş!' };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: 'Kullanıcı bulunamadı!' };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  redirect('/admin/giris-yap?reset=success');
}

export async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload.userId as string;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, fullName: true, role: true },
  });
}

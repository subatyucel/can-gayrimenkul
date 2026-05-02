'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import {
  createSession,
  deleteSession,
  generateToken,
  getCurrentUser,
  verifyToken,
} from '@/lib/auth';
import { ActionResponseFactory, formatZodErrors } from '@/lib/action-response';
import { sendResetPasswordMail } from '@/lib/mail';
import {
  ChangeEmailFormValues,
  changeEmailSchema,
  ChangePasswordFormValues,
  changePasswordSchema,
  ForgotPasswordFormValues,
  forgotPasswordSchema,
  LoginFormValues,
  loginSchema,
  RegisterFormValues,
  registerSchema,
  ResetPasswordFormValues,
  resetPasswordSchema,
} from '@/lib/validations/auth';
import { generateAndSendOtp, verifyOtp } from './otp';

export async function requestRegister(formValues: RegisterFormValues) {
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

    return await generateAndSendOtp(data.email, 'REGISTER');
  } catch (error) {
    console.error('💥💥 requestRegister action error', error);
    return ActionResponseFactory.error(
      'Sunucu tarafında beklenmeyen bir hata oluştu.',
    );
  }
}

export async function confirmRegister(
  formValues: RegisterFormValues,
  code: string,
) {
  try {
    const payload = await verifyToken(formValues.token);
    if (!payload || payload.purpose !== 'invite') {
      return ActionResponseFactory.error('Davet linkiniz geçerli değil!');
    }

    const verifyResult = await verifyOtp(formValues.email, code, 'REGISTER');
    if (!verifyResult.success) {
      return ActionResponseFactory.error(verifyResult.error);
    }

    const hashedPassword = await bcrypt.hash(formValues.password, 10);
    const { confirmPassword, token, ...dbData } = formValues;

    await prisma.user.create({
      data: { ...dbData, password: hashedPassword, role: 'admin' },
    });
    return ActionResponseFactory.success(
      'Kayıt işlemi başarılı. Bilgilerinizle giriş yapabilirsiniz.',
    );
  } catch (error) {
    console.error('💥💥 verifyRegister error: ', error);
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

export async function requestPasswordReset(
  formValues: ForgotPasswordFormValues,
) {
  try {
    const { data, error, success } = forgotPasswordSchema.safeParse(formValues);
    if (!success) {
      return ActionResponseFactory.error(
        'Lütfen formdaki alanları uygun değerler ile doldurun!',
        formatZodErrors(error),
      );
    }

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (user) {
      const TOKEN = await generateToken(
        { email: user.email },
        'password-reset',
        '30m',
      );

      await sendResetPasswordMail(user.email, TOKEN, user.fullName);
    }

    // Returns success anyway to prevent enumaration attacks
    return ActionResponseFactory.success(
      'Eğer bu e-posta adresi kayıtlıysa, sıfırlama linki gönderilmiştir.',
    );
  } catch (error) {
    console.error('💥💥Send reset mail action error: ', error);
    return ActionResponseFactory.error(
      'Mail gönderirken sunucu tarafında beklenmeyen bir hata oluştu.',
    );
  }
}

export async function resetPassword(formValues: ResetPasswordFormValues) {
  try {
    const { data, error, success } = resetPasswordSchema.safeParse(formValues);

    if (!success) {
      return ActionResponseFactory.error(
        'Lütfen formdaki alanları uygun değerler ile doldurun!',
        formatZodErrors(error),
      );
    }

    const payload = await verifyToken(data.token);
    if (!payload || payload.purpose !== 'password-reset' || !payload.id) {
      return ActionResponseFactory.error(
        'Şifre sıfırlama linkiniz geçerli değil! Şifremi unuttum sayfasından yeniden işlem yapınız.',
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await prisma.user.update({
      where: { email: payload.email as string },
      data: { password: hashedPassword },
    });

    return ActionResponseFactory.success(
      'Şifre başarı ile güncellenmiştir. Yeni şifreniz ile giriş yapabilirsiniz.',
    );
  } catch (error) {
    console.error('👺👺Reset password action error: ', error);
    return ActionResponseFactory.error(
      'Şifre güncellenirken bir hata oluştu. Yeniden deneyiniz!',
    );
  }
}

export async function logout() {
  try {
    await deleteSession();
    return ActionResponseFactory.success('Çıkış işlemi başarılı.');
  } catch (error) {
    console.error('💥💥Logout action error: ', error);
    return ActionResponseFactory.error(
      'Çıkış yapılırken bir hata meydana geldi!',
    );
  }
}

export async function requestPasswordChange(
  formValues: ChangePasswordFormValues,
) {
  try {
    const { data, error, success } = changePasswordSchema.safeParse(formValues);
    if (!success) {
      return ActionResponseFactory.error(
        'Lütfen formdaki alanları uygun değerler ile doldurun!',
        formatZodErrors(error),
      );
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return ActionResponseFactory.error(
        'Bu işlemi yapabilmek için yetkiniz bulunmamaktadır.',
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
    });
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      return ActionResponseFactory.error('Bilgiler hatalı!');
    }

    const otpResult = await generateAndSendOtp(user.email, 'CHANGE_PASSWORD');
    if (!otpResult.success) {
      return ActionResponseFactory.error(otpResult.error);
    }

    return ActionResponseFactory.success('Doğrulama kodu gönderildi.', {
      email: user.email,
    });
  } catch (error) {
    console.error('💥💥 requestPasswordChange action error: ', error);
    return ActionResponseFactory.error(
      'İşlem sırasında bir hata meydana geldi.',
    );
  }
}

export async function confirmPasswordChage(newPassword: string, code: string) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return ActionResponseFactory.error(
        'Bu işlemi yapabilmek için yetkiniz bulunmamaktadır.',
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
    });
    if (!user) return ActionResponseFactory.error('Kullanıcı bulunamadı.');

    const verifyResult = await verifyOtp(user.email, code, 'CHANGE_PASSWORD');
    if (!verifyResult.success) {
      return ActionResponseFactory.error(verifyResult.error);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return ActionResponseFactory.success('Şifreniz başarıyla güncellendi!');
  } catch (error) {
    console.error('💥💥 verifyPasswordChange action error: ', error);
    return ActionResponseFactory.error('Şifre güncellenirken hata oluştu.');
  }
}

export async function requestEmailChange(formValues: ChangeEmailFormValues) {
  try {
    const { data, error, success } = changeEmailSchema.safeParse(formValues);
    if (!success) {
      return ActionResponseFactory.error(
        'Lütfen formdaki alanları uygun değerler ile doldurun!',
        formatZodErrors(error),
      );
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return ActionResponseFactory.error(
        'Bu işlemi yapabilmek için yetkiniz bulunmamaktadır.',
      );
    }

    const isEmailExist = await prisma.user.findUnique({
      where: { email: data.newEmail },
    });
    if (isEmailExist) {
      return ActionResponseFactory.error('Bu mail adresi kullanımda.');
    }

    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
    });

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      return ActionResponseFactory.error('Bilgiler hatalı!');
    }

    return await generateAndSendOtp(data.newEmail, 'CHANGE_EMAIL');
  } catch (error) {
    console.error('💥💥 requestEmailChange action error: ', error);
    return ActionResponseFactory.error(
      'Mail adresine kod gönderilirken bir hata meydana geldi.',
    );
  }
}

export async function confirmEmailChange(newEmail: string, code: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return ActionResponseFactory.error('Giriş yapmanız gerekir.');
  }

  const isVerified = await verifyOtp(newEmail, code, 'CHANGE_EMAIL');
  if (!isVerified.success) return isVerified;

  await prisma.user.update({
    where: { id: currentUser?.id },
    data: { email: newEmail },
  });

  return ActionResponseFactory.success('Mail adresi başarıyla güncellendi.');
}

export async function generateInviteLink() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'owner') {
      return ActionResponseFactory.error(
        'Bu işlemi yapmak için yetkiniz yok. Yöneticinizle iletişime geçin',
      );
    }

    const token = await generateToken(
      { id: currentUser.id, email: currentUser.email },
      'invite',
    );

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const inviteLink = `${baseUrl}/admin/kayit-ol?t=${token}`;

    return ActionResponseFactory.success(
      'Link başarıyla oluşturuldu.',
      inviteLink,
    );
  } catch (error) {
    console.error('💥💥 generateInviteLink error: ', error);
    return ActionResponseFactory.error(
      'Link oluşturulurken bir hata meydana geldi.',
    );
  }
}

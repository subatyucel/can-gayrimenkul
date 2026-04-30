import { Button, Section, Text } from 'react-email';
import MailLayout from './Layout';

export default function ResetPasswordMail({
  fullName,
  resetLink,
}: {
  fullName: string;
  resetLink: string;
}) {
  return (
    <MailLayout
      title="Can Gayrimenkul | Şifre Sıfırla"
      previewText="Can Gayrimenkul Şifre Sıfırlama Talebi"
    >
      <Section className="mt-8">
        <Text className="text-slate-800 text-[16px] leading-6">
          Merhaba <strong>{fullName}</strong>,
        </Text>
        <Text className="text-slate-600 text-[14px] leading-6">
          Hesabınız için bir şifre sıfırlama talebinde bulundunuz. Eğer bu
          işlemi siz yapmadıysanız bu e-postayı güvenle görmezden
          gelebilirsiniz.
        </Text>
      </Section>

      <Section className="text-center mt-8 mb-8">
        <Button
          className="bg-slate-900 rounded-md text-white text-[14px] font-medium no-underline text-center px-6 py-4"
          href={resetLink}
        >
          Şifremi Sıfırla
        </Button>
      </Section>

      <Section className="mt-8 mb-8">
        <Text className="text-slate-500 text-[14px] leading-6">
          Buton çalışmıyorsa aşağıdaki bağlantıyı kopyalayıp tarayıcınıza
          yapıştırabilirsiniz:
        </Text>
        <Text className="text-blue-600 text-[12px] leading-5 break-all">
          <a href={resetLink} className="text-blue-600 underline">
            {resetLink}
          </a>
        </Text>
      </Section>

      <Text className="text-slate-500 text-[12px] leading-5">
        Güvenlik uyarısı: Bu bağlantı <strong>30 dakika</strong> boyunca
        geçerlidir ve sadece bir kez kullanılabilir.
      </Text>
    </MailLayout>
  );
}

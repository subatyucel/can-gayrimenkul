import { Section, Text } from 'react-email';
import MailLayout from './Layout';

export default function OtpMail({ code = '123456' }: { code: string }) {
  return (
    <MailLayout
      title="Can Gayrimenkul | Doğrulama Kodu"
      previewText={`Güvenlik doğrulama kodunuz: ${code}`}
    >
      <Section className="mt-8">
        <Text className="text-slate-800 text-[16px] leading-6">Merhaba,</Text>
        <Text className="text-slate-600 text-[14px] leading-6">
          İşleminize devam edebilmeniz için gereken 6 haneli güvenlik doğrulama
          kodunuz aşağıdadır. Eğer bu işlemi siz başlatmadıysanız, hesabınızın
          güvenliği için lütfen şifrenizi değiştirin.
        </Text>
      </Section>

      <Section className="bg-slate-50 border border-slate-100 rounded-lg my-6 py-6 text-center">
        <Text className="text-4xl font-mono font-bold tracking-[0.5em] text-slate-900 m-0 ml-4">
          {code}
        </Text>
      </Section>

      <Text className="text-slate-500 text-[12px] leading-5 text-center">
        Güvenlik uyarısı: Bu kod <strong>10 dakika</strong> boyunca geçerlidir
        ve tek kullanımlıktır. Lütfen bu kodu çalışanlarımız dahil{' '}
        <strong>kimseyle paylaşmayın</strong>.
      </Text>
    </MailLayout>
  );
}

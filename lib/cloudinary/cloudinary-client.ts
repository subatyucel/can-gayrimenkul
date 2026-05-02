export async function uploadImagesToCloudinary(files: File[]) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary çevre değişkenleri eksik!');
  }

  const uploadedUrls: string[] = [];
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  for (const file of files) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const res = await fetch(uploadUrl, { method: 'POST', body: formData });
    if (!res.ok) throw new Error(`${file.name} yüklenemedi.`);
    const data = await res.json();
    uploadedUrls.push(data.secure_url);
  }

  return uploadedUrls;
}

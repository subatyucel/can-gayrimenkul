import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

function extractPublicIdFromUrl(url: string | null) {
  try {
    const match = url?.match(/\/v\d+\/(.+)\.\w+$/);
    return match ? match[1] : null;
  } catch (_) {
    return null;
  }
}

export async function deleteImagesFromCloudinary(urls: string[]) {
  if (!urls || urls.length === 0) return;

  await Promise.all(
    urls.map(async (url) => {
      const publicId = extractPublicIdFromUrl(url);

      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
          console.log(`🗑️🗑️ Deleted from cloudinary: ${publicId}`);
        } catch (error) {
          console.error('💥💥 deleteImagesFromCloudinary error: ', error);
        }
      }
    }),
  );
}

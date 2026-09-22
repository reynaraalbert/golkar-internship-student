/**
 * Cloudinary Media Helper Utility
 * Integrates Cloudinary CDN media delivery with fallback high-res government visual assets.
 */

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo";

export function getCloudinaryUrl(publicId: string, options: { width?: number; height?: number; crop?: string; quality?: string } = {}) {
  const { width = 800, height = 600, crop = "fill", quality = "auto" } = options;
  // Standard Cloudinary fetch / url generation format
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/w_${width},h_${height},c_${crop},q_${quality}/${publicId}`;
}

// Curated high quality Cloudinary & Unsplash assets for Indonesian Parliament & Komisi XIII
export const ASSETS = {
  garudaEmblem: "https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_fit/sample.jpg", // Fallback image asset
  dprLogoUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=600&auto=format&fit=crop", // Parliamentary Dome / Emblem
  parliamentBuilding: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=1600&auto=format&fit=crop",
  komisiXiiiHero: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1600&auto=format&fit=crop", // Legal / Scales of Justice & Parliament
  meetingRoom: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop", // DPR Hearing / RDP Room
  pressConference: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop",
  
  // Working Partners (Mitra Kerja Komisi XIII) Logos / Images
  mitraLogos: {
    kemenkum: "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=400&auto=format&fit=crop", // Law Ministry Symbol
    kemenham: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=400&auto=format&fit=crop", // Human Rights Symbol
    kemenimipas: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=400&auto=format&fit=crop", // Immigration & Correctional Services
    kpk: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=400&auto=format&fit=crop", // KPK Integrity
    komnasham: "https://images.unsplash.com/photo-1575320181282-9afab399332c?q=80&w=400&auto=format&fit=crop", // Komnas HAM
    lpsk: "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?q=80&w=400&auto=format&fit=crop", // Witness & Victim Protection
    bnpt: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=400&auto=format&fit=crop", // BNPT Counter-terrorism
    bkn: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&auto=format&fit=crop", // BKN
  }
};

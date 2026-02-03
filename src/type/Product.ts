export interface Product {
  name: string
  features: string[]
  price_range: string
  material: string
  custom_logo: boolean
  image_gallery: string[]
  id: string | number; // Allow both
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;      // Fixes "Property 'image' does not exist"
  bannerImage?: string; // fallback if your API uses this name
  category?: string;
}
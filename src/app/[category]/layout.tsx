import { Metadata } from 'next';

type Props = {
  params: { category: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = (await params).category;
  const title = category.charAt(0).toUpperCase() + category.slice(1);

  return {
    title: `${title} of Maharashtra | Ultimate Heritage & Travel Guide`,
    description: `Explore the best ${category} across Maharashtra with interactive maps, local weather, and expert history. Plan your odyssey through the Great Deccan Plateau.`,
    alternates: {
      canonical: `https://goexploremaharashtra.in/${category}`, // Crucial for AdSense
    },
    openGraph: {
      title: `${title} - GoExploreMaharashtra`,
      description: `Hand-crafted guides for ${category} in Maharashtra.`,
      url: `https://goexploremaharashtra.in/${category}`,
      siteName: 'GoExploreMaharashtra',
      images: [`/assets/images/bannerImages/${category === 'beaches' ? 'beahces.jpg' : 'og-default.jpg'}`],
      type: 'website',
    },
  };
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
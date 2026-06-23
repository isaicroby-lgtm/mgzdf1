import dynamic from "next/dynamic";
import HeroSection from "@/components/organisms/home/hero-section";
import { getMetadata } from "@/api/seoSsr";

const BenefitsSection = dynamic(
  () => import("@/components/organisms/home/benefits-section"),
  { ssr: false }
);

const HomeProductsSection = dynamic(
  () => import("@/components/organisms/home/home-products-section"),
  { ssr: false }
);

// const NewsletterSection = dynamic(
//   () => import("@/components/organisms/home/newsletter-section"),
//   { ssr: false }
// );

export default function Home() {
  console.log("oik");
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <HomeProductsSection />
      {/* <NewsletterSection /> */}
    </>
  );
}

export async function generateMetadata({ params }) {
  const metadata = await getMetadata("home");
  return metadata;
}

import Hero from "@/components/homePage/hero";
import Pricing from "@/components/homePage/pricing";
import Reviews from "@/components/homePage/reviews";
import Showcase from "@/components/homePage/showcase";

export default function HomePage() {
  return (
    <>
      <Hero id="hero" />
      <Showcase id="showcase" />
      <Reviews id="reviews" />
      <Pricing id="pricing" />
    </>
  );
}

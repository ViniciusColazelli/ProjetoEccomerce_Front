// pages/index.js
import Hero from "components/home/Hero";
import Features from "components/home/Features";
import CategoryGrid from "components/home/CategoryGrid";
import CtaBanner from "components/home/CtaBanner";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <CategoryGrid />
      <CtaBanner />
    </>
  );
}

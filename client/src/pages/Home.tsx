import React from "react";
import Welcome from "../components/layout/Welcome";
import KeyFeatures from "../components/layout/KeyFeatures";
import WhyChoose from "../components/layout/WhyChoose";
import Hero from "../components/layout/Hero";
import CTA from "../components/layout/CTA";

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <Welcome/>
      <KeyFeatures />
      <WhyChoose />
      <CTA/>
    </>
  );
};

export default Home;

import React from "react";
import Welcome from "../components/layout/Welcome";
import KeyFeatures from "../components/layout/KeyFeatures";
import WhyChoose from "../components/layout/WhyChoose";
import Hero from "../components/layout/Hero";

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <Welcome/>
      <KeyFeatures />
      <WhyChoose />
    </>
  );
};

export default Home;

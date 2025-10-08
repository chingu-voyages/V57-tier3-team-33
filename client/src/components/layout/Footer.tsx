import React from "react";
import { Copyright } from "../ui";
import DateDisplay from "../ui/DateDisplay";
import { PBLogo } from "../brand";
import GitHub from "../icons/github";
import LinkedIn from "../icons/linkedIn";
import { Github } from "../icons";

const Footer: React.FC = () => {
  // Data for developers to make code cleaner
  const developers = {
    "Front-end Developers": [
      {
        name: "Tibamwenda Anthony",
        linkedIn: "#",
        github: "https://github.com/AskTiba",
      },
      {
        name: "Nazeeha Khalil Ahmed",
        linkedIn: "#",
        github: "https://github.com/nazeeha-kb",
      },
    ],
    "Back-end Developers": [
      {
        name: "Banto Klára",
        linkedIn: "#",
        github: "https://github.com/bantoklara",
      },
      {
        name: "Henok Hailemariam",
        linkedIn: "#",
        github: "https://github.com/henokkhm",
      },
      {
        name: "Mohamed Ouederni",
        linkedIn: "#",
        github: "https://github.com/9-barristanselmy-9",
      },
    ],
    "Product Designer": [
      {
        name: "Yusuf Mohsen",
        linkedIn: "#",
        github: "https://github.com/yusufmohsiin",
      },
    ],
  };

  return (
    <footer className="bg-black text-white p-6 md:p-8 lg:p-12">
      <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-8">
        {/* Left Column */}
        <div className="flex flex-col max-w-md items-center text-center lg:items-start lg:text-left">
          <section>
            <div className="lg:-ml-14 lg:-mt-20 -ml-4">
              <PBLogo fill="white" className="mx-auto lg:mx-0" />
            </div>
            <p className="text-lg text-gray-400 -mt-4 lg:text-xl ">
              Streamline your GitHub workflow with comprehensive pull request
              tracking and management
            </p>
          </section>
        </div>

        {/* Right Column */}
        <aside className="flex flex-col">
          {/* --- Desktop View --- */}
          <div className="hidden md:grid md:grid-cols-[auto_1fr] gap-x-8 gap-y-4 items-baseline">
            {Object.entries(developers).map(([role, people]) => (
              <section className="contents" key={role}>
                <p className="whitespace-nowrap text-xl">{role}</p>
                <div className="space-y-2 text-xl">
                  {people.map((person) => (
                    <div
                      key={person.name}
                      className="flex justify-between items-center gap-x-8"
                    >
                      <p>{person.name}</p>
                      <div className="flex items-center gap-x-4">
                        <a
                          href={person.linkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <LinkedIn />
                        </a>
                        <a
                          href={person.github}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <GitHub />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* --- Mobile View --- */}
          <div className="md:hidden space-y-6">
            {Object.entries(developers).map(([role, people]) => (
              <div key={role}>
                <p className="font-semibold text-lg">{role}</p>
                <div className="mt-2 space-y-2">
                  {people.map((person) => (
                    <div
                      key={person.name}
                      className="flex justify-between items-center gap-x-4"
                    >
                      <p className="text-base">{person.name}</p>
                      <div className="flex items-center gap-4">
                        <a
                          href={person.linkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <LinkedIn />
                        </a>
                        <a
                          href={person.github}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <GitHub />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Final Footer Bar */}
      <div className="mt-12 pt-8 border-t border-gray-800 md:border-t-0 md:pt-0 flex flex-col-reverse md:flex-row items-center justify-between gap-6">
        {/* Copyright Section */}
        <section>
          <div className="text-xs flex items-center gap-1 justify-center lg:justify-start">
            <Copyright width={20} fill="#fff" />
            <p className="text-base">
              <DateDisplay format="YYYY" /> PullBoard. All Rights Reserved.
            </p>
          </div>
        </section>

        {/* Voyage Section */}
        <a
          href="https://github.com/chingu-voyages/V57-tier3-team-33"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          <Github />
          <p className="text-base">Voyage 57 - Tier 3 - Team 33</p>
        </a>
      </div>
    </footer>
  );
};

export default Footer;

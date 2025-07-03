"use client";

import { useState } from "react";
import Image from "next/image";

interface Feature {
  title: string;
  content: string;
  image: string;
}

const features: Feature[] = [
  {
    title: "Calculate the What-ifs",
    content: "Explore different financial scenarios based on your inputs.",
    image:
      "https://static.vecteezy.com/system/resources/previews/049/855/259/non_2x/nature-background-high-resolution-wallpaper-for-a-serene-and-stunning-view-photo.jpg",
  },
  {
    title: "Real time monitoring",
    content: "Get up-to-date tracking of your investments and expenses.",
    image:
      "https://img.freepik.com/free-photo/vestrahorn-mountains-stokksnes-iceland_335224-667.jpg?semt=ais_hybrid&w=740",
  },
  {
    title: "Coaching, classes and community",
    content: "Access financial coaching and a supportive community.",
    image:
      "https://t4.ftcdn.net/jpg/04/39/89/01/360_F_439890152_sYbPxa1ANTSKcZuUsKzRAf9O7bJ1Tx5B.jpg",
  },
  {
    title: "Visualizations and insights",
    content: "Visualize your financial future clearly.",
    image:
      "https://img.freepik.com/free-photo/vestrahorn-mountains-stokksnes-iceland_335224-667.jpg?semt=ais_hybrid&w=740",
  },
  {
    title: "Personalized recommendations",
    content: "Get suggestions tailored to your goals.",
    image:
      "https://t4.ftcdn.net/jpg/04/39/89/01/360_F_439890152_sYbPxa1ANTSKcZuUsKzRAf9O7bJ1Tx5B.jpg",
  },
];

export default function FeatureSections() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container grid grid-cols-1 md:grid-cols-2 gap-6 p-6 ">
      <div className="space-y-4">
        {features.map((feature, index) => (
          <>
            <div
              key={index}
              className="hidden md:block  border rounded p-4 shadow-sm"
            >
              <button
                onClick={() => toggleIndex(index)}
                className="flex justify-between w-full items-center text-left text-lg font-semibold"
              >
                <span>{feature.title}</span>
                <span>{openIndex === index ? "-" : "+"}</span>
              </button>
              {openIndex === index && (
                <p className="mt-2 text-gray-600">{feature.content}</p>
              )}
            </div>

            {/* Mobile/Tablet: Always show content & image */}
            <div className="block md:hidden space-y-2">
              <h2 className="text-lg font-semibold">{feature.title}</h2>
              <p className="text-gray-600">{feature.content}</p>
              <img
                src={feature.image}
                alt={feature.title}
                className="w-full h-auto rounded shadow"
              />
            </div>
          </>
        ))}
      </div>

      <div className="hidden md:flex items-center justify-center">
        {openIndex === null ? (
          <img
            src={features[0].image}
            alt={features[0].title}
            width={400}
            height={300}
            className="rounded shadow"
          />
        ) : (
          <img
            src={features[openIndex].image}
            alt={features[openIndex].title}
            width={400}
            height={300}
            className="rounded shadow"
          />
        )}
      </div>
    </div>
  );
}

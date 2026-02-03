"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function ComingSoon() {
  const [heading, setHeading] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");

  const headingText = "Coming Soon";
  const line1Text =
    "We’re curating the best stays across Maharashtra — from beachside resorts to heritage forts and hill retreats.";
  const line2Text =
    "Stay tuned to discover handpicked hotels that let you truly experience Maharashtra’s charm.";

  const speed = 50; // typing speed in ms

  useEffect(() => {
    let h = 0,
      l1 = 0,
      l2 = 0;

    const typeHeading = setInterval(() => {
      setHeading(headingText.slice(0, h));
      h++;
      if (h > headingText.length) {
        clearInterval(typeHeading);
        const typeLine1 = setInterval(() => {
          setLine1(line1Text.slice(0, l1));
          l1++;
          if (l1 > line1Text.length) {
            clearInterval(typeLine1);
            const typeLine2 = setInterval(() => {
              setLine2(line2Text.slice(0, l2));
              l2++;
              if (l2 > line2Text.length) clearInterval(typeLine2);
            }, speed);
          }
        }, speed);
      }
    }, speed);

    return () => {
      clearInterval(typeHeading);
    };
  }, []);

  return (
    <section className="highlight-item p-0 rounded overflow-hidden relative">
      <div className="row align-items-center">
        <div className="col-12 relative">
          <div className="hotelComingSoon text-center px-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-blue-800 mb-6 tracking-wide drop-shadow-sm leading-tight">
              {heading}
            </h1>


            {line1 && (
              <p className="text-gray-700 text-lg sm:text-xl md:text-2xl font-medium max-w-3xl mb-5 leading-relaxed mx-auto hidden">
                {line1}
              </p>
            )}

            {line2 && (
              <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-3xl leading-relaxed italic mx-auto hidden">
                {line2}
              </p>
            )}
          </div>

          <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] mt-6">
            <Image
              src="/assets/images/hotel2.png"
              alt="Hotel"
              fill
              className="object-cover rounded"
              priority
            />
          </div>
        </div>
      </div>

      {/* Floating gradient shapes */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-blue-200/40 rounded-full blur-3xl animate-bounce-slow"></div>
      <div className="absolute bottom-10 right-10 w-52 h-52 bg-cyan-200/40 rounded-full blur-3xl animate-bounce-slow delay-500"></div>
    </section>
  );
}

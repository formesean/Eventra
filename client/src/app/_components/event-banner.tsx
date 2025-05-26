"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const stockImages = [
  "/stock-banner-1.jpg",
  "/stock-banner-2.jpg",
  "/stock-banner-3.jpg",
  "/stock-banner-4.jpg",
  "/stock-banner-5.jpg",
  "/stock-banner-6.jpg",
  "/stock-banner-7.jpg",
];

export default function EventBanner({
  initialBanner,
  onBannerChange,
}: {
  initialBanner: string;
  onBannerChange?: (banner: string) => void;
}) {
  const [selectedBanner, setSelectedBanner] = useState(initialBanner);
  const pathname = usePathname();
  const isCreateRoute = pathname === "/create";

  useEffect(() => {
    setSelectedBanner(initialBanner);
  }, [initialBanner]);

  const handleBannerChange = (banner: string) => {
    setSelectedBanner(banner);
    onBannerChange?.(banner);
  };

  return (
    <>
      <div className="relative h-40 w-full">
        <Image
          src={selectedBanner}
          alt="Event banner"
          fill
          className="object-cover"
        />
      </div>

      {isCreateRoute && (
        <div className="mt-4">
          <p className="text-sm text-gray-400 mb-2">Choose a banner:</p>
          <div className="grid grid-cols-2 gap-2">
            {stockImages.map((img, index) => (
              <div
                key={index}
                onClick={() => handleBannerChange(img)}
                className={`cursor-pointer relative h-24 border-4 rounded-lg overflow-hidden transition-all duration-200 ${
                  selectedBanner === img
                    ? "border-indigo-500"
                    : "border-transparent"
                }`}
              >
                <Image
                  src={img}
                  alt={`Banner ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

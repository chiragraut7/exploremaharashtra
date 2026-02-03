"use client";

import { useEffect, useState } from "react";

interface Hotel {
  name: string;
  slug: string;
  tariff?: string;
}

interface Destination {
  name: string;
  slug: string;
  hotelCount: number;
  hotels?: Hotel[];
}

interface ApiResponse {
  summary: {
    beaches: number;
    hills: number;
    forts: number;
    nature: number;
    religious: number;
  };
  beaches: Destination[];
  hills: Destination[];
  forts: Destination[];
  nature: Destination[];
  religious: Destination[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedDestination, setExpandedDestination] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/admin");
      const json = await res.json();
      setData(json);
    }
    fetchData();
  }, []);

  if (!data) return <div className="p-6">Loading...</div>;

  // ✅ Select category data properly
  const categoryData: Destination[] = (() => {
    switch (activeCategory) {
      case "beaches":
        return data.beaches;
      case "hills":
        return data.hills;
      case "forts":
        return data.forts;
      case "nature":
        return data.nature;
      case "religious":
        return data.religious;
      default:
        return [];
    }
  })();

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(data.summary).map(([category, count]) => (
          <div
            key={category}
            className={`bg-white shadow-md rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition ${
              activeCategory === category ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => {
              setActiveCategory(category);
              setExpandedDestination(null);
            }}
          >
            <h2 className="text-xl font-bold capitalize">{category}</h2>
            <p className="text-3xl font-semibold text-blue-600">{count}</p>
            <button className="mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600">
              View
            </button>
          </div>
        ))}
      </div>

      {/* Category Destinations List */}
      {activeCategory && (
        <div className="bg-gray-50 p-4 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold capitalize mb-4">
            {activeCategory} List
          </h3>
          <div className="space-y-3">
            {categoryData.length > 0 ? (
              categoryData.map((dest) => (
                <div key={dest.slug} className="bg-white p-4 rounded-lg shadow">
                  {/* Destination Header */}
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-lg font-bold">{dest.name}</h4>
                      <p className="text-sm text-gray-600">
                        Hotels: {dest.hotelCount}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                        onClick={() =>
                          setExpandedDestination(
                            expandedDestination === dest.slug ? null : dest.slug
                          )
                        }
                      >
                        {expandedDestination === dest.slug
                          ? "Hide Hotels"
                          : "View Hotels"}
                      </button>
                      <button className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600">
                        Edit
                      </button>
                    </div>
                  </div>

                  {/* Hotel List */}
                  {expandedDestination === dest.slug && (
                    <div className="mt-4 pl-4 border-l border-gray-200 space-y-2">
                      {dest.hotels && dest.hotels.length > 0 ? (
                        dest.hotels.map((hotel) => (
                          <div
                            key={hotel.slug}
                            className="flex justify-between items-center bg-gray-50 p-3 rounded shadow-sm"
                          >
                            <div>
                              <h5 className="font-medium">{hotel.name}</h5>
                              {hotel.tariff && (
                                <p className="text-sm text-gray-600">
                                  Tariff: {hotel.tariff}
                                </p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">
                                View
                              </button>
                              <button className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600">
                                Edit
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No hotels found.</p>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No destinations found for this category.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

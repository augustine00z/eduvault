"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

/**
 * MyMaterialsPage
 * Renders the creator's materials sourced from the canonical backend record.
 * This replaces the fragile client-side deduplication and NFT metadata reconstruction.
 */
export default function MyMaterialsPage() {
  const { address } = useAccount();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!address) return;
    let mounted = true;

    const fetchMaterials = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch canonical records for the connected wallet
        const res = await fetch("/api/materials", { cache: "no-store" });
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Please sign in to view your materials.");
          }
          throw new Error("Failed to fetch materials from the canonical record.");
        }
        const data = await res.json();

        if (mounted) {
          setMaterials(data);
        }
      } catch (err) {
        console.error("Error fetching materials:", err);
        if (mounted) setError(err.message || "Error loading materials.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchMaterials();
    return () => {
      mounted = false;
    };
  }, [address]);

  // Helper: format date like “Nov 02, 2025”
  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown";
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  // 🧩 UI States
  if (!address)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-sm">
          Connect your wallet to view your minted materials.
        </p>
      </div>
    );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-sm">Loading your materials...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );

  // 🖼️ Material Grid
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto py-10 px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">My Materials</h1>
          <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-md">
            {materials.length} Items
          </span>
        </div>

        {(!materials || materials.length === 0) ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
            <p className="text-sm text-gray-600 mb-4">No materials found for this wallet.</p>
            <a 
              href="/dashboard/upload" 
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Upload your first material
            </a>
          </div>
        ) : (
          <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((item) => (
              <li
                key={item._id || item.materialId}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                {/* Thumbnail */}
                <div className="relative h-44 bg-gray-100">
                  {item.thumbnailUrl ? (
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-xs">No preview available</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full shadow-sm ${
                      item.visibility === 'public' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {item.visibility}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-1" title={item.title}>
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                      {item.description}
                    </p>
                  )}
                  
                  <div className="space-y-2 pt-4 border-t border-gray-50">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Price</span>
                      <span className="font-semibold text-gray-900">
                        {item.price > 0 ? `${item.price} CELO` : "Free"}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Created</span>
                      <span className="text-gray-700">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                  </div>

                  {item.fileUrl && (
                    <div className="mt-5">
                      <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-all"
                      >
                        View Material
                      </a>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FaHeart,
  FaCheckCircle,
  FaExclamationCircle,
  FaShieldAlt,
  FaFileContract,
  FaUserShield,
  FaArrowLeft,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import BuyNowModal from "./modals/BuyNowModal";
import { useParams } from "next/navigation";

/**
 * MaterialDetailsPage
 * Redesigned for high-trust and purchase clarity.
 * Maintains all original data-fetching logic and functional state.
 */
export default function MaterialDetailsPage() {
  const { id } = useParams();
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBuyModal, setShowBuyModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchMaterial = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/market-materials?id=${id}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Material not found.");
          throw new Error("Could not load material details.");
        }
        const data = await res.json();
        setMaterial(data);
      } catch (err) {
        console.error("Detail fetch failed:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterial();
  }, [id]);

  // Shorten wallet addresses
  const shortenAddress = (address) => {
    if (!address) return "Anonymous";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Format dates
  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown Date";
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#fffaf6]">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">
            Fetching material secure record...
          </p>
        </div>
      </>
    );
  }

  if (error || !material) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#fffaf6] px-6 text-center">
          <FaExclamationCircle className="text-5xl text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Material Not Found
          </h1>
          <p className="text-gray-600 mb-6 max-w-md">
            {error ||
              "The material you are looking for does not exist or has been moved."}
          </p>
          <Link
            href="/marketplace"
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            Back to Marketplace
          </Link>
        </div>
      </>
    );
  }

  return (
    <div className="bg-[#fffaf6] min-h-screen pb-20">
      <Navbar />

      {/* Visual Background Decor */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#f2ede8_1px,transparent_1px),linear-gradient(to_bottom,#f2ede8_1px,transparent_1px)] bg-[size:40px_40px] opacity-40 pointer-events-none -z-10"
        aria-hidden="true"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Enhanced Navigation */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link
            href="/marketplace"
            className="hover:text-blue-600 transition-colors"
          >
            Marketplace
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-medium truncate max-w-[200px]">
            {material.title}
          </span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Preview & Detailed Metadata */}
          <div className="flex-1 space-y-10">
            {/* Material Preview Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white"
            >
              {material.thumbnailUrl ? (
                <Image
                  src={material.thumbnailUrl}
                  alt={material.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                  <span className="text-sm font-medium italic">
                    Secure Preview Loading...
                  </span>
                </div>
              )}
            </motion.div>

            {/* Description Section */}
            <section className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                  {material.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mt-6">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                      <FaUserShield className="text-blue-600" size={14} />
                    </div>
                    <span className="text-sm font-bold text-gray-800">
                      {shortenAddress(material.userAddress)}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-400 italic">
                    Added on {formatDate(material.createdAt)}
                  </span>
                </div>
              </div>

              <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Material Overview
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
                  {material.description ||
                    "The creator has not provided an extended description for this material."}
                </p>
              </div>

              {/* Trust Signals */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-blue-50/40 rounded-2xl border border-blue-100 flex gap-4">
                  <FaShieldAlt
                    className="text-blue-600 flex-shrink-0"
                    size={24}
                  />
                  <div>
                    <h4 className="font-bold text-blue-900 text-sm italic">
                      Verified Record
                    </h4>
                    <p className="text-xs text-blue-700/80 mt-1">
                      This material is anchored to a verified smart contract on
                      Celo.
                    </p>
                  </div>
                </div>
                <div className="p-5 bg-emerald-50/40 rounded-2xl border border-emerald-100 flex gap-4">
                  <FaFileContract
                    className="text-emerald-600 flex-shrink-0"
                    size={24}
                  />
                  <div>
                    <h4 className="font-bold text-emerald-900 text-sm italic">
                      Rights Information
                    </h4>
                    <p className="text-xs text-emerald-700/80 mt-1">
                      {material.usageRights ||
                        "Standard license: Personal educational use only."}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Side: Sticky Checkout Card */}
          <aside className="lg:w-80 xl:w-96">
            <div className="sticky top-28 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden p-2"
              >
                <div className="bg-white p-6 md:p-8 space-y-8">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Current Price
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-gray-900">
                        {material.price > 0 ? material.price : "Free"}
                      </span>
                      {material.price > 0 && (
                        <span className="text-xl font-bold text-gray-400">
                          CELO
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={() => setShowBuyModal(true)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-200 transition-all hover:-translate-y-1 active:scale-95"
                    >
                      Buy Access Now
                    </button>
                    <button className="w-full bg-white border-2 border-gray-100 hover:bg-gray-50 text-gray-800 font-bold py-4 rounded-2xl transition-all">
                      Add to Cart
                    </button>
                  </div>

                  {/* Detailed Specifications Table */}
                  <div className="pt-6 border-t border-gray-50 space-y-4">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-gray-400 uppercase">
                        Visibility
                      </span>
                      <span className="text-gray-900 bg-gray-100 px-2 py-0.5 rounded capitalize">
                        {material.visibility}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-gray-400 uppercase">
                        Verification
                      </span>
                      <span className="text-emerald-600 flex items-center gap-1 font-bold">
                        <FaCheckCircle size={10} />{" "}
                        {material.status || "Canonical"}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-gray-400 uppercase">Reviews</span>
                      <span className="text-gray-900 font-bold italic">
                        ⭐ 5.0 (New)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50/50 px-6 py-5 text-center">
                  <button className="flex items-center justify-center gap-2 text-pink-500 font-bold text-sm mx-auto hover:scale-105 transition-transform group">
                    <FaHeart className="group-hover:fill-pink-500 transition-colors" />
                    Save for later
                  </button>
                </div>
              </motion.div>

              {/* Trust Footer */}
              <div className="px-4 text-center">
                <p className="text-[10px] text-gray-400 leading-relaxed font-medium uppercase tracking-tight">
                  Secured by eduvault protocol. Digital assets are
                  non-refundable once the claim transaction is verified
                  on-chain.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <BuyNowModal
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
        price={material.price > 0 ? `${material.price} CELO` : "Free"}
      />
    </div>
  );
}

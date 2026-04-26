"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  FaHeart,
  FaCheckCircle,
  FaRegFileAlt,
  FaShieldAlt,
  FaInfoCircle,
  FaStar,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import BuyNowModal from "./modals/BuyNowModal";

export default function MaterialDetailsPage() {
  const [showBuyModal, setShowBuyModal] = useState(false);

  const material = {
    title: "ECO 201 – Principles of Microeconomics (Complete Lecture Notes)",
    description:
      "A detailed 60-page lecture note covering demand, supply, market equilibrium, elasticity, and production theory — essential for first and second-year students preparing for exams.",
    price: "0.25 XLM",
    fiatPrice: "≈ $0.12 USD",
    likes: "18.6K",
    reviews: "76 Reviews",
    rating: 4.8,
    pages: 60,
    fileType: "PDF",
    image: "/images/image2.jpg",
    author: {
      name: "Christian Okafor",
      institution: "University of Nigeria, Nsukka (UNN)",
      department: "Economics",
      level: "200 Level",
      date: "Oct 25, 2025",
      verified: true,
      avatar: "/images/author-avatar.png", // Ensure you have an avatar or default
    },
    tags: ["MicroEconomics", "ECO201", "UNN"],
  };

  const relatedMaterials = [
    {
      id: 1,
      img: "/images/image1.jpg",
      title: "CHM 112 – Lab Report",
      price: "0.15 XLM",
    },
    {
      id: 2,
      img: "/images/image3.jpg",
      title: "PHY 101 – Mechanics",
      price: "0.30 XLM",
    },
    {
      id: 3,
      img: "/images/image4.jpg",
      title: "MTH 201 – Calculus",
      price: "0.25 XLM",
    },
    {
      id: 4,
      img: "/images/image5.jpg",
      title: "GST 101 – Use of English",
      price: "0.10 XLM",
    },
  ];

  return (
    <>
      <Navbar />

      <section className="relative bg-gray-50 min-h-screen py-8 px-4 md:px-12 lg:px-20">
        {/* Breadcrumb */}
        <nav className="max-w-7xl mx-auto mb-6 flex items-center text-sm text-gray-500">
          <Link href="/marketplace" className="hover:text-blue-600 transition">
            Marketplace
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium truncate">
            {material.title}
          </span>
        </nav>

        <main className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column: Preview & Content */}
            <div className="flex-[2] space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm"
              >
                <div className="relative aspect-video bg-gray-100">
                  <Image
                    src={material.image}
                    alt={material.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-4 left-4">
                    <button className="bg-white/90 backdrop-blur px-4 py-2 rounded-lg text-sm font-semibold shadow-lg hover:bg-white transition flex items-center gap-2">
                      <FaRegFileAlt /> Preview Material
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Detailed Description */}
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Description
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {material.description}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-gray-100">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">
                      Format
                    </p>
                    <p className="font-semibold text-gray-900">
                      {material.fileType}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">
                      Length
                    </p>
                    <p className="font-semibold text-gray-900">
                      {material.pages} Pages
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">
                      Language
                    </p>
                    <p className="font-semibold text-gray-900">English</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">
                      Access
                    </p>
                    <p className="font-semibold text-gray-900">Lifetime</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {material.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Author & Rights */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      {material.author.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        {material.author.name}
                        {material.author.verified && (
                          <FaCheckCircle
                            className="text-blue-500 text-sm"
                            title="Verified Creator"
                          />
                        )}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {material.author.institution}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <span className="text-gray-400">Department:</span>{" "}
                      {material.author.department}
                    </p>
                    <p>
                      <span className="text-gray-400">Level:</span>{" "}
                      {material.author.level}
                    </p>
                    <p>
                      <span className="text-gray-400">Published:</span>{" "}
                      {material.author.date}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaShieldAlt className="text-green-600" /> Usage Rights
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-3">
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                      <span>Personal use only for studying and research.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaInfoCircle className="text-amber-500 mt-1 flex-shrink-0" />
                      <span>
                        Standard Digital License: Resale or redistribution is
                        prohibited.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Purchase Action */}
            <div className="flex-1">
              <div className="sticky top-8 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 border-2 border-blue-600 shadow-xl"
                >
                  <h1 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                    {material.title}
                  </h1>

                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex text-yellow-400 text-sm">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {material.rating}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({material.reviews})
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                          Price
                        </p>
                        <div className="flex items-center gap-2">
                          <Image
                            src="/images/stellar.png"
                            alt="XLM"
                            width={24}
                            height={24}
                          />
                          <span className="text-2xl font-black text-gray-900">
                            {material.price}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 pb-1">
                        {material.fiatPrice}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => setShowBuyModal(true)}
                      className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all transform active:scale-95 shadow-lg shadow-blue-200"
                    >
                      Buy Now
                    </button>
                    <button className="w-full py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition">
                      Add to Cart
                    </button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-500">
                        <FaHeart className="text-pink-500" />
                        <span>{material.likes} Likes</span>
                      </div>
                      <span className="text-green-600 font-medium text-xs bg-green-50 px-2 py-1 rounded">
                        Secured by Stellar
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Entitlement Awareness Teaser */}
                <div className="bg-blue-900 text-white rounded-2xl p-6">
                  <h4 className="font-bold mb-2">Student Discount?</h4>
                  <p className="text-blue-200 text-sm mb-4">
                    Verify your student status to unlock lower prices and
                    exclusive academic bundles.
                  </p>
                  <button className="text-sm font-bold underline hover:text-white transition">
                    Verify Status
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Related Materials Section */}
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                More for your department
              </h2>
              <Link
                href="/marketplace"
                className="text-blue-600 font-semibold hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedMaterials.map((item) => (
                <Link
                  href={`/marketplace/${item.id}`}
                  key={item.id}
                  className="group"
                >
                  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="relative h-48 w-full">
                      <Image
                        src={item.img}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500 mb-3">
                        Economics Department
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-blue-600">
                          {item.price}
                        </span>
                        <div className="flex items-center text-[10px] text-gray-400 gap-1">
                          <FaStar className="text-yellow-400" /> 4.5
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </section>

      <BuyNowModal
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
        price={material.price}
      />
    </>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaHeart, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import BuyNowModal from "./modals/BuyNowModal";
import { useParams } from "next/navigation";

/**
 * MaterialDetailsPage
 * Renders the specific material details fetched by its stable identifier (_id).
 * Replaces hardcoded demo data with real material record from the data layer.
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

	// Helper to shorten wallet addresses
	const shortenAddress = (address) => {
		if (!address) return "Anonymous";
		return `${address.slice(0, 6)}...${address.slice(-4)}`;
	};

	// Helper: format date like “Nov 02, 2025”
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
					<p className="text-gray-600">Loading material details...</p>
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
					<h1 className="text-2xl font-bold text-gray-900 mb-2">Material Not Found</h1>
					<p className="text-gray-600 mb-6 max-w-md">
						{error || "The material you are looking for does not exist or has been removed."}
					</p>
					<Link href="/marketplace" className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition">
						Back to Marketplace
					</Link>
				</div>
			</>
		);
	}

	return (
		<>
			<Navbar />

			<section className="relative bg-[#fffaf6] min-h-screen py-10 px-6 md:px-20">
				{/* 🔹 Background Grid Pattern */}
				<div
					className="absolute inset-0 bg-[linear-gradient(to_right,#f2ede8_1px,transparent_1px),linear-gradient(to_bottom,#f2ede8_1px,transparent_1px)] bg-[size:40px_40px] opacity-70 pointer-events-none -z-10"
					aria-hidden="true"
				></div>

				{/* Main Container */}
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="max-w-6xl mx-auto"
				>
					{/* Breadcrumb */}
					<p className="text-sm text-gray-500 mb-6">
						<Link href="/marketplace" className="text-blue-600 hover:underline">
							Marketplace
						</Link>{" "}
						→ {material.title.slice(0, 20)}...
					</p>

					{/* Top Section */}
					<div className="flex flex-col md:flex-row gap-10">
						{/* Image Preview */}
						<div className="flex-1 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 aspect-video relative">
							{material.thumbnailUrl ? (
								<Image
									src={material.thumbnailUrl}
									alt={material.title}
									fill
									className="object-cover"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center text-gray-400">
									No Preview Available
								</div>
							)}
						</div>

						{/* Info Section */}
						<div className="flex-1 space-y-5">
							<h1 className="text-2xl md:text-3xl font-bold text-gray-900">
								{material.title}
							</h1>
							<p className="text-gray-600 text-sm leading-relaxed">
								{material.description || "No description provided for this material."}
							</p>

							{/* Price & Rating */}
							<div className="flex items-center gap-4 mt-4">
								<div className="flex items-center gap-2">
									<Image
										src="/images/celo.png"
										alt="Celo"
										width={28}
										height={28}
										className="rounded-full"
									/>
									<span className="text-lg font-semibold text-gray-900">
										{material.price > 0 ? `${material.price} CELO` : "Free"}
									</span>
								</div>
								<span className="text-sm text-yellow-500">⭐ 0.0</span>
								<span className="text-gray-400 text-sm">
									(0 Reviews)
								</span>
							</div>

							{/* Buttons */}
							<div className="flex items-center gap-3 mt-4">
								<button className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-100 transition">
									Add to Cart
								</button>
								<button
									onClick={() => setShowBuyModal(true)}
									className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition"
								>
									Buy Now!
								</button>
							</div>

							{/* Likes */}
							<div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
								<FaHeart className="text-pink-500" />
								0 Likes
							</div>
						</div>
					</div>

					{/* About + Author Info */}
					<div className="grid md:grid-cols-2 gap-6 mt-10">
						{/* About */}
						<div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
							<h2 className="text-lg font-semibold text-gray-900 mb-3">
								Material Overview
							</h2>
							<div className="text-sm text-gray-600 space-y-4">
								<p className="leading-relaxed">
									{material.description || "No additional information provided."}
								</p>
								{material.usageRights && (
									<div>
										<strong className="text-gray-800">Usage Rights:</strong>
										<p className="mt-1">{material.usageRights}</p>
									</div>
								)}
							</div>
						</div>

						{/* Author Info */}
						<div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
							<h2 className="text-lg font-semibold text-gray-900 mb-3">
								Creator Info
							</h2>
							<div className="text-sm text-gray-600 space-y-3">
								<p>
									<strong className="text-gray-800">Creator Address:</strong>{" "}
									<span className="break-all">{material.userAddress || "Anonymous"}</span>
								</p>
								<p>
									<strong className="text-gray-800">Uploaded On:</strong>{" "}
									{formatDate(material.createdAt)}
								</p>
								<p>
									<strong className="text-gray-800">Visibility:</strong>{" "}
									<span className="capitalize">{material.visibility}</span>
								</p>
								<div className="pt-2">
									<p className="flex items-center gap-2">
										<strong className="text-gray-800">Status:</strong>
										<span className="text-green-600 flex items-center gap-1 text-xs font-medium bg-green-50 px-2 py-1 rounded-full">
											<FaCheckCircle /> Verified Canonical Record
										</span>
									</p>
								</div>
							</div>
						</div>
					</div>
				</motion.div>
			</section>

			{/* 💳 Integrated Buy Now Modal */}
			<BuyNowModal
				isOpen={showBuyModal}
				onClose={() => setShowBuyModal(false)}
				price={material.price > 0 ? `${material.price} CELO` : "Free"}
			/>
		</>
	);
}


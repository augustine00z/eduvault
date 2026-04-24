"use client";

import Image from "next/image";
import Link from "next/link";
import { FaHeart, FaExclamationCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";

/**
 * MarketPage
 * Renders the public marketplace listing sourced from the canonical data layer.
 * Replaces hardcoded demo data with real materials from /api/market-materials.
 */
export default function MarketPage() {
	const [materials, setMaterials] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchMaterials = async () => {
			try {
				const res = await fetch("/api/market-materials");
				if (!res.ok) throw new Error("Could not load marketplace materials.");
				const data = await res.json();
				setMaterials(data.items || []);
			} catch (err) {
				console.error("Marketplace fetch failed:", err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		fetchMaterials();
	}, []);

	const categories = [
		"Past Questions & Exam Papers",
		"Project & School Development",
		"Social Sciences",
		"Education & Languages",
		"Medical & Biological Sciences",
		"Engineering & Tech",
		"Entrepreneurship",
		"Study Tools",
		"Faculty Notes",
		"Community and Learning Resources",
	];

	// Helper to shorten wallet addresses
	const shortenAddress = (address) => {
		if (!address) return "Anonymous";
		return `${address.slice(0, 6)}...${address.slice(-4)}`;
	};

	return (
		<>
			<Navbar />

			{/* 🔹 Background Grid Pattern */}
			<div
				className="absolute inset-0 bg-[linear-gradient(to_right,#f2ede8_1px,transparent_1px),linear-gradient(to_bottom,#f2ede8_1px,transparent_1px)] bg-[size:40px_40px] opacity-70 pointer-events-none -z-1"
				aria-hidden="true"
			></div>

			<section className="flex min-h-screen bg-[#fffaf6]">
				{/* Sidebar Categories */}
				<aside className="hidden lg:block w-64 bg-white border-r border-gray-200 px-6 py-10 overflow-y-auto">
					<h3 className="text-sm font-semibold text-gray-700 mb-6">
						Categories
					</h3>
					<ul className="space-y-3 text-sm text-gray-600">
						{categories.map((category, i) => (
							<li
								key={i}
								className="cursor-pointer hover:text-blue-600 transition-all"
							>
								{category}
							</li>
						))}
					</ul>
				</aside>

				{/* Main Content */}
				<main className="flex-1 px-6 md:px-10 py-10 overflow-y-auto">
					{/* Top Banner */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl p-8 mb-10 flex flex-col md:flex-row justify-between items-center"
					>
						<div className="max-w-lg">
							<h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
								Discover More Study Materials
							</h1>
							<p className="text-gray-700 text-sm mb-4">
								Own your knowledge. Earn from your notes.
							</p>
							<Link href="/dashboard/upload" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md text-sm font-semibold transition-all">
								Become a Creator
							</Link>
						</div>

						<div className="w-40 h-40 mt-6 md:mt-0 flex items-center justify-center">
							<Image
								src="/images/celo.png"
								alt="Celo Token"
								width={144}
								height={144}
								className="object-contain"
							/>
						</div>
					</motion.div>

					{/* Filters */}
					<div className="flex flex-wrap items-center justify-between mb-8">
						<div className="flex flex-wrap items-center gap-4">
							<div className="flex items-center gap-2 text-gray-600 text-sm">
								<span className="font-medium">Filters:</span>
								<select className="border border-gray-300 bg-white rounded-md px-3 py-1 text-sm focus:ring-1 focus:ring-blue-300">
									<option>Category: All</option>
									<option>Social Sciences</option>
									<option>Engineering</option>
									<option>Pharmacy</option>
								</select>
							</div>
						</div>

						<div className="text-sm text-gray-600 mt-4 md:mt-0">
							Sort by:{" "}
							<select className="border border-gray-300 bg-white rounded-md px-3 py-1 text-sm ml-1 focus:ring-1 focus:ring-blue-300">
								<option>Newest</option>
								<option>Price: Low to High</option>
							</select>
						</div>
					</div>

					{/* Loading State */}
					{loading && (
						<div className="flex flex-col items-center justify-center py-20">
							<div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
							<p className="text-gray-600">Loading marketplace materials...</p>
						</div>
					)}

					{/* Error State */}
					{error && !loading && (
						<div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl flex items-center gap-4">
							<FaExclamationCircle className="text-2xl" />
							<p>{error}</p>
						</div>
					)}

					{/* Study Materials Grid */}
					{!loading && !error && materials.length === 0 && (
						<div className="bg-white border border-gray-200 p-12 rounded-2xl text-center shadow-sm">
							<p className="text-gray-600 mb-2">No public materials found.</p>
							<p className="text-sm text-gray-500">Be the first to upload one!</p>
						</div>
					)}

					{!loading && !error && materials.length > 0 && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.6 }}
							className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
						>
							{materials.map((material) => (
								<Link
									href={`/marketplace/${material._id}`}
									key={material._id}
									className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 block"
								>
									{/* Thumbnail */}
									<div className="relative w-full h-44 bg-gray-100">
										{material.thumbnailUrl ? (
											<Image
												src={material.thumbnailUrl}
												alt={material.title}
												fill
												className="object-cover"
											/>
										) : (
											<div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
												No Preview
											</div>
										)}
										<button className="absolute top-3 left-3 bg-white text-xs px-3 py-1 rounded-full shadow-sm text-gray-700 font-medium hover:bg-gray-50 transition">
											Details
										</button>
									</div>

									{/* Info */}
									<div className="p-4">
										<h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1" title={material.title}>
											{material.title}
										</h3>
										<p className="text-xs text-gray-500 mb-3">
											by {shortenAddress(material.userAddress)}
										</p>

										<div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-50">
											<div className="flex items-center gap-1">
												<FaHeart className="text-pink-500" />
												<span>0 Likes</span>
											</div>
											<div className="flex items-center gap-1">
												<span className="font-semibold text-gray-800">
													{material.price > 0 ? `${material.price} CELO` : "Free"}
												</span>
											</div>
										</div>
									</div>
								</Link>
							))}
						</motion.div>
					)}

					{/* Pagination */}
					{!loading && materials.length > 0 && (
						<div className="flex items-center justify-between mt-12 text-sm text-gray-600">
							<button className="border border-gray-300 rounded-md px-3 py-1 hover:bg-gray-100 disabled:opacity-50" disabled>
								Previous
							</button>
							<div className="flex items-center gap-2">
								<button className="w-8 h-8 flex items-center justify-center rounded-md bg-blue-600 text-white">
									1
								</button>
							</div>
							<button className="border border-gray-300 rounded-md px-3 py-1 hover:bg-gray-100 disabled:opacity-50" disabled>
								Next
							</button>
						</div>
					)}
				</main>
			</section>
		</>
	);
}


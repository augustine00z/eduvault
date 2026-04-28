"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHeart, FaSearch, FaFilter, FaStar, FaFilePdf, FaFileWord, FaFilePowerpoint, FaRegClock } from "react-icons/fa";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

// Dummy data generator
const generateMaterials = () => {
	const titles = [
		"CHM 112 – Lab Report Template (UNN)", "MTH 101 – Calculus Cheat Sheet", "BIO 201 – Anatomy Notes",
		"ENG 305 – Research Paper Guide", "PHY 110 – Problem Sets", "COM 210 – Software Eng. Slides",
		"ECO 102 – Microeconomics Past Questions", "MED 401 – Pharmacology Summary", "PSY 100 – Study Tips & Mnemonics",
		"LAW 205 – Contract Law Cases", "CSC 314 – Data Structures in Java", "ACC 101 – Intro to Accounting"
	];
	const authors = ["Chijioke M.", "Ada O.", "Ngozi A.", "Emeka K.", "Uche N.", "Tunde L.", "Funmi S.", "Dr. Amina", "Kemi R.", "Bisi A.", "Olu W.", "Zainab T."];
	const categoriesList = ["Engineering & Tech", "Medical & Biological Sciences", "Social Sciences", "Education & Languages", "Past Questions & Exam Papers", "Study Tools", "Faculty Notes"];
	const fileTypes = ["pdf", "doc", "ppt"];
	
	return Array.from({ length: 45 }, (_, i) => ({
		id: i,
		title: titles[i % titles.length] + (i > titles.length - 1 ? ` ${i}` : ''),
		author: authors[i % authors.length],
		likes: (Math.random() * 20).toFixed(1) + "K",
		price: (Math.random() * 0.5 + 0.05).toFixed(2),
		rating: (Math.random() * 1 + 4).toFixed(1),
		reviews: Math.floor(Math.random() * 500) + 10,
		category: categoriesList[i % categoriesList.length],
		fileType: fileTypes[i % fileTypes.length],
		pages: Math.floor(Math.random() * 100) + 5,
		image: `/images/image${(i % 9) + 1}.jpg`,
	}));
};

const allMaterials = generateMaterials();

export default function MarketPage() {
	const [materials, setMaterials] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [activeCategory, setActiveCategory] = useState("All");
	const [sortBy, setSortBy] = useState("Popular");
	const [priceFilter, setPriceFilter] = useState("All");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 12;

	const categories = [
		"All",
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

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setIsLoading(true);

		// Simulate network delay
		const timer = setTimeout(() => {
			let filtered = allMaterials;

			// Category filter
			if (activeCategory !== "All") {
				filtered = filtered.filter(m => m.category === activeCategory);
			}

			// Search filter
			if (searchQuery) {
				const lowerQuery = searchQuery.toLowerCase();
				filtered = filtered.filter(m => 
					m.title.toLowerCase().includes(lowerQuery) || 
					m.author.toLowerCase().includes(lowerQuery)
				);
			}

			// Price filter
			if (priceFilter === "Free") {
				filtered = filtered.filter(m => parseFloat(m.price) === 0);
			} else if (priceFilter === "Under 0.2 XLM") {
				filtered = filtered.filter(m => parseFloat(m.price) < 0.2);
			} else if (priceFilter === "0.2+ XLM") {
				filtered = filtered.filter(m => parseFloat(m.price) >= 0.2);
			}

			// Sort
			if (sortBy === "Popular") {
				filtered.sort((a, b) => parseFloat(b.likes) - parseFloat(a.likes));
			} else if (sortBy === "Price: Low to High") {
				filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
			} else if (sortBy === "Price: High to Low") {
				filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
			} else if (sortBy === "Highest Rated") {
				filtered.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
			}

			setMaterials(filtered);
			setIsLoading(false);
		}, 600);

		return () => clearTimeout(timer);
	}, [searchQuery, activeCategory, sortBy, priceFilter]);

	// Pagination logic
	const totalPages = Math.ceil(materials.length / itemsPerPage);
	const displayedMaterials = materials.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setCurrentPage(1); // Reset page on filter change
	}, [searchQuery, activeCategory, sortBy, priceFilter]);

	const getFileIcon = (type) => {
		switch(type) {
			case 'pdf': return <FaFilePdf className="text-red-500" />;
			case 'doc': return <FaFileWord className="text-blue-500" />;
			case 'ppt': return <FaFilePowerpoint className="text-orange-500" />;
			default: return <FaFilePdf className="text-gray-500" />;
		}
	};

	return (
		<>
			<Navbar />

			{/* Background Grid Pattern */}
			<div
				className="absolute inset-0 bg-[linear-gradient(to_right,#f2ede8_1px,transparent_1px),linear-gradient(to_bottom,#f2ede8_1px,transparent_1px)] bg-[size:40px_40px] opacity-70 pointer-events-none -z-1"
				aria-hidden="true"
			></div>

			<section className="flex flex-col lg:flex-row min-h-screen bg-[#fffaf6] relative z-0">
				{/* Mobile Category Scroll */}
				<div className="lg:hidden w-full overflow-x-auto bg-white border-b border-gray-200 px-4 py-3 hide-scrollbar flex gap-2">
					{categories.map((category, i) => (
						<button
							key={i}
							onClick={() => setActiveCategory(category)}
							className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm transition-all ${
								activeCategory === category 
								? "bg-blue-600 text-white font-medium shadow-sm" 
								: "bg-gray-100 text-gray-600 hover:bg-gray-200"
							}`}
						>
							{category}
						</button>
					))}
				</div>

				{/* Desktop Sidebar Categories */}
				<aside className="hidden lg:block w-72 bg-white border-r border-gray-200 px-6 py-10 sticky top-0 h-screen overflow-y-auto">
					<h3 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-wider">
						Categories
					</h3>
					<ul className="space-y-1">
						{categories.map((category, i) => (
							<li key={i}>
								<button
									onClick={() => setActiveCategory(category)}
									className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
										activeCategory === category
										? "bg-blue-50 text-blue-700 font-semibold"
										: "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
									}`}
								>
									{category}
								</button>
							</li>
						))}
					</ul>
				</aside>

				{/* Main Content */}
				<main className="flex-1 px-4 md:px-8 py-8 md:py-10 overflow-x-hidden">
					{/* Top Banner - Supportive rather than dominant */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4 }}
						className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 mb-8 flex flex-col md:flex-row justify-between items-center relative overflow-hidden"
					>
						<div className="relative z-10 w-full md:w-2/3">
							<h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
								Academic Marketplace
							</h1>
							<p className="text-gray-600 text-sm mb-4">
								Browse, download, and learn from top-rated study materials shared by peers.
							</p>
							<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm">
								Share Your Notes
							</button>
						</div>
						<div className="hidden md:block absolute right-0 top-0 h-full w-1/3 opacity-30">
							{/* Decorative element replacing dominant image */}
							<div className="w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent"></div>
						</div>
					</motion.div>

					{/* Search and Filters Bar */}
					<div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between relative z-10">
						{/* Search */}
						<div className="relative w-full md:max-w-md">
							<FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
							<input
								type="text"
								placeholder="Search subjects, topics, authors..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
							/>
						</div>

						{/* Filters & Sorting */}
						<div className="flex w-full md:w-auto items-center gap-3 overflow-x-auto hide-scrollbar">
							<div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 shrink-0">
								<FaFilter className="text-gray-400 mr-2 text-xs" />
								<select 
									value={priceFilter}
									onChange={(e) => setPriceFilter(e.target.value)}
									className="bg-transparent text-sm text-gray-700 focus:outline-none cursor-pointer"
								>
									<option value="All">All Prices</option>
									<option value="Free">Free</option>
									<option value="Under 0.2 XLM">Under 0.2 XLM</option>
									<option value="0.2+ XLM">0.2+ XLM</option>
								</select>
							</div>

							<div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 shrink-0">
								<span className="text-gray-500 text-sm mr-2">Sort:</span>
								<select 
									value={sortBy}
									onChange={(e) => setSortBy(e.target.value)}
									className="bg-transparent text-sm font-medium text-gray-800 focus:outline-none cursor-pointer"
								>
									<option>Popular</option>
									<option>Highest Rated</option>
									<option>Price: Low to High</option>
									<option>Price: High to Low</option>
								</select>
							</div>
						</div>
					</div>

					{/* State Handling: Loading, Empty, Grid */}
					{isLoading ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{[...Array(8)].map((_, i) => (
								<div key={i} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 animate-pulse">
									<div className="h-32 bg-gray-200 rounded-lg w-full"></div>
									<div className="h-4 bg-gray-200 rounded w-3/4 mt-2"></div>
									<div className="h-3 bg-gray-200 rounded w-1/2"></div>
									<div className="flex justify-between mt-4">
										<div className="h-4 bg-gray-200 rounded w-1/4"></div>
										<div className="h-4 bg-gray-200 rounded w-1/4"></div>
									</div>
								</div>
							))}
						</div>
					) : displayedMaterials.length === 0 ? (
						<div className="bg-white rounded-2xl border border-gray-200 py-20 px-6 text-center shadow-sm">
							<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<FaSearch className="text-gray-400 text-2xl" />
							</div>
							<h3 className="text-lg font-bold text-gray-900 mb-2">No materials found</h3>
								<p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
								We could not find any materials matching your current filters and search query. Try adjusting them.
							</p>
							<button 
								onClick={() => {
									setSearchQuery("");
									setActiveCategory("All");
									setPriceFilter("All");
								}}
								className="text-blue-600 font-medium text-sm hover:underline"
							>
								Clear all filters
							</button>
						</div>
					) : (
						<>
							<div className="flex justify-between items-end mb-4 px-1">
								<h2 className="text-lg font-bold text-gray-800">
									{activeCategory === "All" ? "All Materials" : activeCategory}
								</h2>
								<span className="text-sm text-gray-500">{materials.length} results</span>
							</div>

							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.4 }}
								className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 relative z-10"
							>
								{displayedMaterials.map((material) => (
									<Link
										href={`/marketplace/${material.id}`}
										key={material.id}
										className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 flex flex-col group"
									>
										{/* Image Banner - Reduced height to emphasize metadata */}
										<div className="relative w-full h-28 bg-gray-100 overflow-hidden">
											<Image
												src={material.image}
												alt={material.title}
												fill
												className="object-cover group-hover:scale-105 transition-transform duration-500"
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
											<div className="absolute bottom-2 left-3 right-3 flex justify-between items-center">
												<span className="bg-white/90 backdrop-blur-sm text-xs px-2 py-0.5 rounded-md text-gray-800 font-medium flex items-center gap-1">
													{getFileIcon(material.fileType)}
													<span className="uppercase">{material.fileType}</span>
												</span>
												<span className="bg-white/90 backdrop-blur-sm text-xs px-2 py-0.5 rounded-md text-gray-800 font-medium flex items-center gap-1">
													<FaStar className="text-yellow-500" />
													{material.rating}
												</span>
											</div>
										</div>

										{/* Metadata Info */}
										<div className="p-4 flex-1 flex flex-col">
											<h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
												{material.title}
											</h3>
											<p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
												by <span className="font-medium text-gray-700">{material.author}</span>
											</p>

											<div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
												<div className="flex items-center text-xs text-gray-500 gap-3">
													<div className="flex items-center gap-1" title="Likes">
														<FaHeart className="text-gray-400" />
														<span>{material.likes}</span>
													</div>
													<div className="flex items-center gap-1" title="Pages">
														<FaRegClock className="text-gray-400" />
														<span>{material.pages} pgs</span>
													</div>
												</div>
												
												<div className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-sm font-bold shadow-sm border border-blue-100">
													{material.price} <span className="text-[10px] font-medium text-blue-500">XLM</span>
												</div>
											</div>
										</div>
									</Link>
								))}
							</motion.div>

							{/* Pagination */}
							{totalPages > 1 && (
								<div className="flex items-center justify-center mt-10 gap-2 relative z-10">
									<button 
										onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
										disabled={currentPage === 1}
										className="border border-gray-300 bg-white rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
									>
										Prev
									</button>
									
									<div className="flex items-center gap-1 hidden sm:flex">
										{[...Array(totalPages)].map((_, i) => {
											// Simple pagination logic to show max 5 buttons
											if (totalPages > 5 && i !== 0 && i !== totalPages - 1 && Math.abs(i + 1 - currentPage) > 1) {
												if (i + 1 === currentPage - 2 || i + 1 === currentPage + 2) {
													return <span key={i} className="px-2 text-gray-400">...</span>;
												}
												return null;
											}
											return (
												<button
													key={i}
													onClick={() => setCurrentPage(i + 1)}
													className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
														currentPage === i + 1
															? "bg-blue-600 text-white shadow-sm"
															: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
													}`}
												>
													{i + 1}
												</button>
											);
										})}
									</div>
									
									<span className="sm:hidden text-sm text-gray-600">
										Page {currentPage} of {totalPages}
									</span>

									<button 
										onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
										disabled={currentPage === totalPages}
										className="border border-gray-300 bg-white rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
									>
										Next
									</button>
								</div>
							)}
						</>
					)}
				</main>
			</section>
		</>
	);
}

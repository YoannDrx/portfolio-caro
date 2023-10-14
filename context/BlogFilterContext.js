import React, { createContext, useContext, useState } from "react";

const BlogFilterContext = createContext();

export const useBlogFilters = () => {
	const context = useContext(BlogFilterContext);
	if (!context) {
		throw new Error("useBlogFilters doit être utilisé dans un composant enfant de BlogFilterProvider");
	}
	return context;
};

export const BlogFilterProvider = ({ children }) => {
	const [selectedTag, setSelectedTag] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [searchKeyword, setSearchKeyword] = useState(null);
	const [selectedYear, setSelectedYear] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);

	const value = {
		selectedTag,
		setSelectedTag,
		selectedCategory,
		setSelectedCategory,
		searchKeyword,
		setSearchKeyword,
		selectedYear,
		setSelectedYear,
		currentPage,
		setCurrentPage,
	};

	return <BlogFilterContext.Provider value={value}>{children}</BlogFilterContext.Provider>;
};

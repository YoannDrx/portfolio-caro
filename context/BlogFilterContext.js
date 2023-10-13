import React, { createContext, useContext, useState } from "react";

const BlogFilterContext = createContext();

export const useBlogFilters = () => {
	return useContext(BlogFilterContext);
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
    setCurrentPage
	};

	return <BlogFilterContext.Provider value={value}>{children}</BlogFilterContext.Provider>;
};

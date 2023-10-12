import React, { useEffect, useState } from "react";
import Div from "../Div";
import AuthorWidget from "../Widget/AuthorWidget";
import RecentPost from "../Widget/RecentPost";
import SearchWidget from "../Widget/SearchWidget";
import SideMenuWidget from "../Widget/CategoryMenuWidget";
import TagWidget from "../Widget/TagWidget";
import { useRouter } from "next/router";
import ArchiveMenuWidget from "../Widget/ArchiveMenuWidget";

export default function Sidebar({
	allPostsData,
	setSelectedTag,
	selectedTag,
	setSelectedCategory,
	selectedCategory,
	setSearchKeyword,
	searchKeyword,
	setSelectedYear,
	selectedYear,
}) {
	const [localPostsData, setLocalPostsData] = useState(allPostsData);
	const [uniqueTags, setUniqueTags] = useState([]);
	const [uniqueCategories, setUniqueCategories] = useState([]);
	const [uniqueYears, setUniqueYears] = useState([]);

	const router = useRouter();
	
	const firstThreePosts = localPostsData ? localPostsData.slice(0, 3) : [];


	useEffect(() => {
		setLocalPostsData(allPostsData);

		const tagSet = new Set();
		const categorySet = new Set();
		const yearSet = new Set();

		allPostsData.forEach((post) => {
			if (post.tags) {
				post.tags.forEach((tag) => {
					tagSet.add(tag);
				});
			}
			if (post.category) {
				categorySet.add(post.category);
			}
			if (post.date) {
				const year = new Date(post.date).getFullYear();
				yearSet.add(year);
			}
		});

		setUniqueYears(Array.from(yearSet).sort().reverse());
		setUniqueTags(Array.from(tagSet));
		setUniqueCategories(Array.from(categorySet));
	}, [allPostsData]);

	useEffect(() => {
		let filteredPosts = allPostsData;

		if (searchKeyword) {
			filteredPosts = allPostsData.filter((post) =>
				post.title.toLowerCase().includes(searchKeyword.toLowerCase())
			);
		}

		setLocalPostsData(filteredPosts);
	}, [allPostsData, searchKeyword]);

	useEffect(() => {
		if (router.query.tag) {
			setSelectedTag(router.query.tag);
		}
	}, [router.query]);

	useEffect(() => {
		if (router.query.category) {
			setSelectedCategory(router.query.category);
		}
	}, [router.query]);

	useEffect(() => {
		if (router.query.keyword) {
			setSearchKeyword(router.query.keyword);
		}
	}, [router.query]);

	useEffect(() => {
		if (router.query.year) {
			setSelectedYear(router.query.year);
		}
	}, [router.query]);

	const addTagToFilter = (newTag) => {
		const newQuery = { ...router.query, tag: newTag };
		router.push(
			{
				pathname: router.pathname,
				query: newQuery,
			},
			undefined,
			{ scroll: false }
		);
	};

	const addCategoryToFilter = (newCategory) => {
		const newQuery = { ...router.query };

		if (newCategory) {
			newQuery.category = newCategory;
		} else {
			delete newQuery.category;
		}

		router.push(
			{
				pathname: router.pathname,
				query: newQuery,
			},
			undefined,
			{ scroll: false }
		);
	};

	const addYearToFilter = (newYear) => {
		const newQuery = { ...router.query };

		if (newYear) {
			newQuery.year = newYear;
		} else {
			delete newQuery.year;
		}

		router.push(
			{
				pathname: router.pathname,
				query: newQuery,
			},
			undefined,
			{ scroll: false }
		);
	};

	const handleSearch = (newKeyword) => {
		const newQuery = { ...router.query };

		if (newKeyword) {
			newQuery.keyword = newKeyword;
		} else {
			delete newQuery.keyword;
		}

		router.push(
			{
				pathname: router.pathname,
				query: newQuery,
			},
			undefined,
			{ scroll: false }
		);

		setSearchKeyword(newKeyword);
	};


	// Utiliser uniqueTags pour alimenter TagWidget
	const tagData = uniqueTags.map((tag) => ({
		title: tag,
		url: `tags/${tag}`,
	}));

	// Utiliser uniqueCategories pour alimenter SideMenuWidget
	const categoryData = uniqueCategories.map((category) => ({
		title: category,
		url: `categories/${category}`,
	}));

	// Utiliser uniqueYears pour alimenter ArchiveMenuWidget
	const archiveData = uniqueYears.map((year) => ({
		title: year.toString(),
		url: `years/${year}`,
	}));

	return (
		<>
			<Div className="cs-sidebar_item">
				<AuthorWidget
					src="/images/avatar_1.png"
					name="Votre Nom"
					description="Spécialiste en gestion des droits et en production, je partage ici mes connaissances et expériences."
				/>
			</Div>
			<Div className="cs-sidebar_item">
				<SearchWidget title="Recherche" setSearchKeyword={handleSearch} />
			</Div>
			<Div className="cs-sidebar_item">
				<TagWidget title="Tags" data={tagData} onTagClick={addTagToFilter} selectedTag={selectedTag} />
			</Div>
			<Div className="cs-sidebar_item">
				<SideMenuWidget
					title="Catégories"
					data={categoryData}
					onCategoryClick={addCategoryToFilter}
					selectedCategory={selectedCategory}
				/>
			</Div>
			<Div className="cs-sidebar_item">
				<RecentPost title="Articles Récents" data={firstThreePosts} />
			</Div>
			<Div className="cs-sidebar_item">
				<ArchiveMenuWidget
					title="Archives"
					data={archiveData}
					onYearClick={addYearToFilter}
					selectedYear={selectedYear}
				/>
			</Div>
		</>
	);
}

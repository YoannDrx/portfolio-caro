import React, { useEffect, useState } from "react";
import Div from "../Div";
import AuthorWidget from "../Widget/AuthorWidget";
import RecentPost from "../Widget/RecentPost";
import SearchWidget from "../Widget/SearchWidget";
import SideMenuWidget from "../Widget/CategoryMenuWidget";
import TagWidget from "../Widget/TagWidget";
import { useRouter } from "next/router";
import ArchiveMenuWidget from "../Widget/ArchiveMenuWidget";
import { useBlogFilters } from "../../context/BlogFilterContext";

export default function Sidebar({ allPostsData }) {
	const [localPostsData, setLocalPostsData] = useState(allPostsData);
	const [uniqueTags, setUniqueTags] = useState([]);
	const [uniqueCategories, setUniqueCategories] = useState([]);
	const [uniqueYears, setUniqueYears] = useState([]);

	const {
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
	} = useBlogFilters();

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
		if (router.query.category) {
			setSelectedCategory(router.query.category);
		}
		if (router.query.keyword) {
			setSearchKeyword(router.query.keyword);
		}
		if (router.query.year) {
			setSelectedYear(router.query.year);
		}
	}, [router.query]);

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

	// const updateQueryAndState = (key, value, stateSetter) => {
	// 	const newQuery = { ...router.query };

	// 	if (value === newQuery[key] || !value) {
	// 		delete newQuery[key];
	// 		stateSetter(null);
	// 	} else {
	// 		newQuery[key] = value;
	// 		stateSetter(value);
	// 	}

	// 	// Supprimer les clés avec des valeurs vides
	// 	Object.keys(newQuery).forEach((key) => {
	// 		if (!newQuery[key]) {
	// 			delete newQuery[key];
	// 		}
	// 	});

	// 	router.push(
	// 		{
	// 			pathname: router.pathname,
	// 			query: newQuery,
	// 		},
	// 		undefined,
	// 		{ scroll: false }
	// 	);
	// };
	const updateQueryAndState = (key, value, stateSetter) => {
		const newQuery = { ...router.query };

		if (value === newQuery[key] || !value) {
			delete newQuery[key];
			stateSetter(null);
		} else {
			newQuery[key] = value;
			stateSetter(value);
		}

		// Supprimer les clés avec des valeurs vides
		Object.keys(newQuery).forEach((key) => {
			if (!newQuery[key]) {
				delete newQuery[key];
			}
		});

		let targetPath = router.pathname; // change this line

		// Si vous êtes dans la page [blogId], changez targetPath pour aller vers la page /blog
		if (router.pathname.includes("[blogId]")) {
			targetPath = "/blog";
		}

		router.push(
			{
				pathname: targetPath,
				query: newQuery,
			},
			undefined,
			{ scroll: false }
		);
	};

	// const resetAllFilters = () => {
	// 	setSelectedTag(null);
	// 	setSelectedCategory(null);
	// 	setSearchKeyword(null);
	// 	setSelectedYear(null);

	// 	router.push(
	// 		{
	// 			pathname: router.pathname,
	// 			query: {},
	// 		},
	// 		undefined,
	// 		{ scroll: false }
	// 	);
	// };
	const resetAllFilters = () => {
		setSelectedTag(null);
		setSelectedCategory(null);
		setSearchKeyword(null);
		setSelectedYear(null);

		let targetPath = router.pathname;

		if (router.pathname.includes("[blogId]")) {
			targetPath = "/blog";
		}

		router.push(
			{
				pathname: targetPath,
				query: {},
			},
			undefined,
			{ scroll: false }
		);
	};

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
				<SearchWidget
					title="Recherche"
					setSearchKeyword={(keyword) => updateQueryAndState("keyword", keyword, setSearchKeyword)}
				/>
			</Div>
			<Div className="cs-sidebar_item">
				<TagWidget
					title="Tags"
					data={tagData}
					onTagClick={(tag) => updateQueryAndState("tag", tag, setSelectedTag)}
					selectedTag={selectedTag}
				/>
			</Div>
			<Div className="cs-sidebar_item">
				<SideMenuWidget
					title="Catégories"
					data={categoryData}
					onCategoryClick={(category) => updateQueryAndState("category", category, setSelectedCategory)}
					selectedCategory={selectedCategory}
				/>
			</Div>

			<Div className="cs-sidebar_item">
				<ArchiveMenuWidget
					title="Archives"
					data={archiveData}
					onYearClick={(year) => updateQueryAndState("year", year, setSelectedYear)}
					selectedYear={selectedYear}
				/>
				<button className="reset-button" onClick={resetAllFilters}>
					Réinitialiser tous les filtres X
				</button>
			</Div>

			<Div className="cs-sidebar_item">
				<RecentPost title="Articles Récents" data={firstThreePosts} />
			</Div>
		</>
	);
}

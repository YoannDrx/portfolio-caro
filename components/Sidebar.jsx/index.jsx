import React, { useEffect, useState } from "react";
import Div from "../Div";
import AuthorWidget from "../Widget/AuthorWidget";
import RecentPost from "../Widget/RecentPost";
import SearchWidget from "../Widget/SearchWidget";
import SideMenuWidget from "../Widget/SideMenuWidget";
import TagWidget from "../Widget/TagWidget";

export default function Sidebar({ allPostsData,setSelectedTag, selectedTag }) {
	const [localPostsData, setLocalPostsData] = useState(allPostsData);
	const [uniqueTags, setUniqueTags] = useState([]);


	useEffect(() => {
    setLocalPostsData(allPostsData);

    // Créer un ensemble pour stocker des tags uniques
    const tagSet = new Set();

    // Parcourir tous les articles et ajouter les tags à l'ensemble
    allPostsData.forEach((post) => {
      if (post.tags) {
        post.tags.forEach((tag) => {
          tagSet.add(tag);
        });
      }
    });

    // Convertir l'ensemble en tableau
    setUniqueTags(Array.from(tagSet));
  }, [allPostsData]);

	 // Utiliser uniqueTags pour alimenter TagWidget
	 const tagData = uniqueTags.map((tag) => ({
    title: tag,
    url: `/tags/${tag}`,  // ou toute autre URL que vous souhaitez utiliser
  }));

	const firstThreePosts = localPostsData ? localPostsData.slice(0, 3) : [];

	// const tagData = [
	// 	{
	// 		title: "Droits d’auteur",
	// 		url: "/",
	// 	},
	// 	{
	// 		title: "Gestion de Projet",
	// 		url: "/",
	// 	},
	// 	{
	// 		title: "Production",
	// 		url: "/",
	// 	},
	// 	{
	// 		title: "Licences",
	// 		url: "/",
	// 	},
	// 	{
	// 		title: "Contrats",
	// 		url: "/",
	// 	},
	// ];
	const archiveData = [
		{
			title: "Archives",
			url: "/",
		},
		{
			title: "15 Août 2022",
			url: "/",
		},
		{
			title: "20 Sep 2021",
			url: "/",
		},
		{
			title: "11 Déc 2020",
			url: "/",
		},
	];
	const categoryData = [
		{
			title: "Gestion des Droits",
			url: "/",
		},
		{
			title: "Production de Contenu",
			url: "/",
		},
		{
			title: "Gestion de Projet",
			url: "/",
		},
		{
			title: "Contrats et Licences",
			url: "/",
		},
	];
	// const recentPostData = [
	// 	{
	// 		title: "Comment gérer les droits d’auteur numériques",
	// 		thumb: "/images/recent_post_1.jpeg",
	// 		href: "/blog/blog-details",
	// 		date: "15 Août 2022",
	// 	},
	// 	{
	// 		title: "Optimisation de la production de contenu",
	// 		thumb: "/images/recent_post_2.jpeg",
	// 		href: "/blog/blog-details",
	// 		date: "14 Août 2022",
	// 	},
	// 	{
	// 		title: "Défis de la gestion de projet en production",
	// 		thumb: "/images/recent_post_3.jpeg",
	// 		href: "/blog/blog-details",
	// 		date: "13 Août 2022",
	// 	},
	// ];
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
				<SearchWidget title="Recherche" />
			</Div>
			<Div className="cs-sidebar_item">
			<TagWidget title='Tags' data={tagData} onTagClick={setSelectedTag} selectedTag={selectedTag}/>
			</Div>
			<Div className="cs-sidebar_item">
				<SideMenuWidget title="Catégories" data={categoryData} />
			</Div>
			<Div className="cs-sidebar_item">
				<RecentPost title="Articles Récents" data={firstThreePosts} />
			</Div>
			<Div className="cs-sidebar_item">
				<SideMenuWidget title="Archives" data={archiveData} />
			</Div>
		</>
	);
}

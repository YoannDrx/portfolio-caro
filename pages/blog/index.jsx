import Head from "next/head";
import React from "react";
import Cta from "../../components/Cta";
import Div from "../../components/Div";
import Layout from "../../components/Layout";
import PageHeading from "../../components/PageHeading";
import Pagination from "../../components/Pagination";
import PostStyle2 from "../../components/Post/PostStyle2";
import Sidebar from "../../components/Sidebar.jsx";
import Spacing from "../../components/Spacing";
import { getSortedPostsData } from "../../lib/blogUtils";
import { useBlogFilters } from "../../context/BlogFilterContext";

export async function getStaticProps() {
	const allPostsData = await getSortedPostsData();

	return {
		props: {
			allPostsData,
		},
	};
}

export default function Blog({ allPostsData }) {
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

	const postsPerPage = 4;

	const filteredPosts = allPostsData.filter((post) => {
		let yearCondition = selectedYear ? new Date(post.date).getFullYear() === parseInt(selectedYear, 10) : true;
		let tagCondition = selectedTag ? post.tags && post.tags.includes(selectedTag) : true;
		let categoryCondition = selectedCategory ? post.category === selectedCategory : true;

		if (searchKeyword) {
			return post.title.toLowerCase().includes(searchKeyword.toLowerCase());
		}

		return tagCondition && categoryCondition && yearCondition;
	});

	const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

	const indexOfLastPost = currentPage * postsPerPage;
	const indexOfFirstPost = indexOfLastPost - postsPerPage;
	const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

	// Formatage de la date
	const formatDate = (dateString) => {
		try {
			const [day, month, year] = dateString.split("/");
			const isoDate = `${year}-${month}-${day}`;

			const options = { year: "numeric", month: "long", day: "numeric" };
			return new Intl.DateTimeFormat("fr-FR", options).format(new Date(isoDate));
		} catch (e) {
			console.error("Erreur de formatage de la date: ", e);
			return "Date inconnue";
		}
	};
	const formattedDate = formatDate("2021-02-11");

	return (
		<>
			<Head>
				<title>Blog sur la Gestion des Droits et la Production</title>
				<meta
					name="description"
					content="Découvrez les dernières tendances et conseils en gestion des droits et production."
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Layout>
				<PageHeading title="Articles" bgSrc="/images/blog_hero_bg.jpeg" pageLinkText="Blog" />
				<Spacing lg="150" md="80" />
				<Div className="container">
					<Div className="row">
						<Div className="col-lg-8">
							{currentPosts.map(({ id, date, title, subtitle, category, contentHtml }, index) => (
								<Div key={id}>
									<PostStyle2
										thumb={"/images/post_4.jpeg"}
										title={title}
										subtitle={subtitle}
										date={formatDate(date)}
										category={category || "Non catégorisé"}
										categoryHref={`/blog/category/${category}`}
										href={`/blog/${id}`}
									/>
									{allPostsData.length > index + 1 && <Spacing lg="95" md="60" />}
								</Div>
							))}
							<Spacing lg="60" md="40" />
							<Pagination
								currentPage={currentPage}
								setCurrentPage={setCurrentPage}
								totalPages={totalPages}
							/>
						</Div>
						<Div className="col-xl-3 col-lg-4 offset-xl-1">
							<Spacing lg="0" md="80" />
							<Sidebar
								allPostsData={allPostsData}
								setSelectedTag={setSelectedTag}
								selectedTag={selectedTag}
								setSelectedCategory={setSelectedCategory}
								selectedCategory={selectedCategory}
								setSearchKeyword={setSearchKeyword}
								searchKeyword={searchKeyword}
								setSelectedYear={setSelectedYear}
								selectedYear={selectedYear}
							/>
						</Div>
					</Div>
				</Div>
				<Spacing lg="150" md="80" />
				<Div className="container">
					<Cta
						title="Discutons et créons <br />quelque chose de <i>génial</i> ensemble"
						btnText="Contact"
						btnLink="/contact"
						bgSrc="/images/cta_bg.jpeg"
					/>
				</Div>
			</Layout>
		</>
	);
}

import Head from "next/head";
import Cta from "../components/Cta";
import Div from "../components/Div";
import Layout from "../components/Layout";
import LogoList from "../components/LogoList";
import MovingText from "../components/MovingText";
import SectionHeading from "../components/SectionHeading";
import TestimonialSlider from "../components/Slider/TestimonialSlider";
import Spacing from "../components/Spacing";
import Hero3 from "../components/Hero/Hero3";
import Portfolio2 from "../components/Portfolio/Portfolio2";
import Portfolio3 from "../components/Portfolio/Portfolio3";
import CaseStudy from "../components/CaseStudy";
import ServiceList from "../components/ServiceList";
import { useState } from "react";
import Portfolio from "../components/Portfolio";
import { Icon } from "@iconify/react";

export default function Home() {
	const [itemShow, setItemShow] = useState(6);

	// Hero Social Links
	const heroSocialLinks = [
		{
			name: "LinkedIn",
			links: "/",
		},
		{
			name: "Contact",
			links: "/contact",
		},
	];

	// FunFact Data
	const funfaceData = [
		{
			title: "Global Happy Clients",
			factNumber: "40K",
		},
		{
			title: "Project Completed",
			factNumber: "50K",
		},
		{
			title: "Team Members",
			factNumber: "245",
		},
		{
			title: "Digital products",
			factNumber: "550",
		},
	];

	const portfolioData1 = [
		{
			title: "Gestion des droits d'auteur pour artistes indépendants",
			subtitle: "Projet 01",
			btnText: "Voir les détails",
			btnLink: "/portfolio/gestion-droits-auteur",
			imageUrl: "/images/portfolio_35.jpeg",
			category: "Droit d'auteur",
		},
		{
			title: "Licences et distribution de musique en ligne",
			subtitle: "Projet 02",
			btnText: "Voir les détails",
			btnLink: "/portfolio/licences-distribution",
			imageUrl: "/images/portfolio_36.jpeg",
			category: "Distribution",
		},
		{
			title: "Conformité et audits de droits d'auteur",
			subtitle: "Projet 03",
			btnText: "Voir les détails",
			btnLink: "/portfolio/conformite-audits",
			imageUrl: "/images/portfolio_37.jpeg",
			category: "Conformité",
		},
		{
			title: "Consultation en gestion de catalogue musical",
			subtitle: "Projet 04",
			btnText: "Voir les détails",
			btnLink: "/portfolio/gestion-catalogue",
			imageUrl: "/images/portfolio_38.jpeg",
			category: "Consultation",
		},
	];

	const portfolioData = [
		{
			title: "Colorful Art Work",
			subtitle: "See Details",
			href: "/portfolio/portfolio-details",
			src: "/images/portfolio_11.jpeg",
			category: "ui_ux_design",
		},
		{
			title: "Colorful Art Work",
			subtitle: "See Details",
			href: "/portfolio/portfolio-details",
			src: "/images/portfolio_12.jpeg",
			category: "logo_design",
		},
		{
			title: "Colorful Art Work",
			subtitle: "See Details",
			href: "/portfolio/portfolio-details",
			src: "/images/portfolio_13.jpeg",
			category: "web_design",
		},
		{
			title: "Colorful Art Work",
			subtitle: "See Details",
			href: "/portfolio/portfolio-details",
			src: "/images/portfolio_14.jpeg",
			category: "mobile_apps",
		},
		{
			title: "Colorful Art Work",
			subtitle: "See Details",
			href: "/portfolio/portfolio-details",
			src: "/images/portfolio_15.jpeg",
			category: "ui_ux_design",
		},
		{
			title: "Colorful Art Work",
			subtitle: "See Details",
			href: "/portfolio/portfolio-details",
			src: "/images/portfolio_16.jpeg",
			category: "web_design",
		},
		{
			title: "Colorful Art Work",
			subtitle: "See Details",
			href: "/portfolio/portfolio-details",
			src: "/images/portfolio_11.jpeg",
			category: "ui_ux_design",
		},
		{
			title: "Colorful Art Work",
			subtitle: "See Details",
			href: "/portfolio/portfolio-details",
			src: "/images/portfolio_12.jpeg",
			category: "logo_design",
		},
		{
			title: "Colorful Art Work",
			subtitle: "See Details",
			href: "/portfolio/portfolio-details",
			src: "/images/portfolio_13.jpeg",
			category: "web_design",
		},
	];

	return (
		<>
			<Head>
				<title>Home - Creative Portfolio</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Layout>
				{/* Start Hero Section */}
				<Hero3
					title="Caroline Senyk <br />Music"
					btnLink="contact"
					btnText={`Venez discuter`}
					socialLinksHeading=""
					heroSocialLinks={heroSocialLinks}
					bgImageUrl="./images/hero_bg_4.jpg"
				/>
				{/* End Hero Section */}

				{/* Start Expertises */}
				<Spacing lg="145" md="80" />
				<Div className="container">
					<SectionHeading title="Mes Expertises" subtitle="Services" variant="cs-style1 text-center" />
					<Spacing lg="70" md="45" />
					<ServiceList />
				</Div>
				{/* End Expertises */}

				{/* Start Projects Section */}
				<Spacing lg="145" md="80" />
				<Div className="container">
					<SectionHeading
						title="Artistes à découvrir"
						subtitle="Derniers projets"
						variant="cs-style1 text-center"
					/>
					<Spacing lg="90" md="45" />
					<Div className="row">
						{portfolioData.slice(0, itemShow).map((item, index) => (
							<Div
								className={`${index === 0 || index === 3 || index === 4 ? "col-lg-8" : "col-lg-4"}`}
								key={index}
							>
								<Portfolio
									title={item.title}
									subtitle={item.subtitle}
									href={item.href}
									src={item.src}
									variant="cs-style1 cs-type1"
								/>
								<Spacing lg="25" md="25" />
							</Div>
						))}
					</Div>

					<Div className="text-center">
						{portfolioData.length <= itemShow ? (
							""
						) : (
							<>
								<Spacing lg="65" md="40" />
								<span className="cs-text_btn" onClick={() => setItemShow(itemShow + 3)}>
									<span>Load More</span>
									<Icon icon="bi:arrow-right" />
								</span>
							</>
						)}
					</Div>
				</Div>
				{/* End Projects Section */}

				{/* Start Portfolio Section */}
				<Spacing lg="150" md="80" />
				<SectionHeading title="Mes Expertises" subtitle="Services" variant="cs-style1 text-center mb-5" />

				{portfolioData1.map((item, index) =>
					index % 2 === 0 ? (
						<Div key={index}>
							<Portfolio2
								title={item.title}
								subtitle={item.subtitle}
								btnText={item.btnText}
								btnLink={item.btnLink}
								imageUrl={item.imageUrl}
								category={item.category}
							/>
							<Spacing lg="100" md="70" />
						</Div>
					) : (
						<Div key={index}>
							<Portfolio3
								title={item.title}
								subtitle={item.subtitle}
								btnText={item.btnText}
								btnLink={item.btnLink}
								imageUrl={item.imageUrl}
								category={item.category}
							/>
							<Spacing lg="100" md="70" />
						</Div>
					)
				)}
				{/* End Portfolio Section */}

				{/* Start Case Study Section */}
				<Spacing lg="45" md="10" />
				<Div className="container">
					<SectionHeading
						title="Obtention de Subventions"
						subtitle="Financement"
						variant="cs-style1 text-center"
					/>
					<Spacing lg="90" md="45" />
				</Div>
				<CaseStudy
					title="Étude de cas de <br /> subvention réussies"
					bgUrl="/images/case_study_2.jpeg"
					href="/case-study-details"
					variant="cs-style2"
				/>
				<CaseStudy
					title="Conseils <br /> et astuces"
					bgUrl="/images/case_study_1.jpeg"
					href="/case-study-details"
				/>
				<Spacing lg="150" md="80" />
				{/* End Case Study Section */}

				{/* Start Testimonial Section */}
				<TestimonialSlider />
				{/* End Testimonial Section */}

				{/* Start MovingText Section */}
				<Spacing lg="125" md="70" />
				<MovingText text="Créez librement. Vos oeuvres entre de bonnes mains." />
				<Spacing lg="105" md="70" />
				{/* End MovingText Section */}

				{/* Start LogoList Section */}
				<Div className="container">
					<LogoList />
				</Div>
				<Spacing lg="150" md="80" />
				{/* End LogoList Section */}

				{/* Start CTA Section */}
				<Div className="container">
					<Cta
						title="Unissons nos forces pour <br /> protéger et valoriser votre <i>art</i>"
						btnText="Discutons ensemble"
						btnLink="/contact"
						bgSrc="/images/cta_bg_3.jpeg"
					/>
				</Div>
				{/* End CTA Section */}
			</Layout>
		</>
	);
}

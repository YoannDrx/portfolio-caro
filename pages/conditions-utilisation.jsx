import Head from "next/head";
import React from "react";
import Cta from "../components/Cta";
import Div from "../components/Div";
import FunFact from "../components/FunFact";
import Layout from "../components/Layout";
import PageHeading from "../components/PageHeading";
import SectionHeading from "../components/SectionHeading";
import TeamSlider from "../components/Slider/TeamSlider";
import Spacing from "../components/Spacing";

export default function ConditionsUtilisation() {
	return (
		<>
			<Head>
				<title>Utilisation</title>
				<meta
					name={"description"}
					content={"En savoir plus sur la politique d'utilisation"}
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Layout>
				{/* Début de la section d'en-tête */}
				<PageHeading
					title="Utilisation"
					bgSrc="images/about_hero_bg.jpeg"
					pageLinkText="Conditions d'utilisation"
				/>
				{/* Fin de la section d'en-tête */}

				<section className="m-5">
					<div>
						<h1>Conditions d'Utilisation</h1>
						<h4>Applicables à partir du 29 Septembre 2023</h4>
					</div>
					<p>
						Ce portfolio est destiné à présenter mes compétences et réalisations en tant que copyright
						manager et production manager. En accédant à ce portfolio, vous acceptez de vous conformer aux
						conditions d'utilisation suivantes.
					</p>
					<h4>1. Objectif du Portfolio</h4>
					<p>
						Le but de ce portfolio est de fournir des informations sur mes compétences, projets et services
						professionnels. Il est destiné à faciliter les échanges professionnels et la mise en réseau dans
						le secteur.
					</p>
					<h4>2. Propriété Intellectuelle</h4>
					<p>
						Tous les contenus de ce portfolio, y compris les textes, images, et codes, sont ma propriété
						exclusive et sont protégés par les lois sur le droit d'auteur.
					</p>
					<h4>3. Utilisation des Contenus</h4>
					<p>
						Vous pouvez visualiser, télécharger et imprimer des contenus de ce portfolio uniquement pour
						votre usage personnel et non commercial.
					</p>
					<h4>4. Limitation de Responsabilité</h4>
					<p>
						Bien que j'aie pris toutes les précautions pour assurer l'exactitude des informations
						présentées, je ne suis pas responsable des erreurs ou omissions.
					</p>
					<h4>5. Modifications des Conditions</h4>
					<p>
						Je me réserve le droit de modifier ces conditions d'utilisation à tout moment. Les modifications
						seront publiées sur cette page.
					</p>
					<h4>6. Contact</h4>
					<p>
						Pour toute question concernant ces conditions, vous pouvez me contacter à l'adresse suivante :
						[Votre adresse email]
					</p>
				</section>
			</Layout>
		</>
	);
}

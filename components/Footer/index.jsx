import React from "react";
import Div from "../Div";
import ContactInfoWidget from "../Widget/ContactInfoWidget";
import MenuWidget from "../Widget/MenuWidget";
import Newsletter from "../Widget/Newsletter";
import SocialWidget from "../Widget/SocialWidget";
import TextWidget from "../Widget/TextWidget";

export default function Footer({ copyrightText, logoSrc, logoAlt, text }) {
	const copyrightLinks = [
		{
			title: "Conditions d’utilisation",
			href: "/conditions-utilisation",
		},
		{
			title: "Politique de confidentialité",
			href: "/politique-confidentialite",
		},
		{
			title: "Politique de cookies",
			href: "/politique-cookies",
		}
	];

	const serviceMenu = [
		{
			title: "Gestion des droits d’auteur",
			href: "/service/gestion-droits-auteur",
		},
		{
			title: "Production musicale",
			href: "/service/production-musicale",
		},
		{
			title: "Obtention de subventions",
			href: "/service/obtention-subventions",
		},
		{
			title: "Consultation en droits d’auteur",
			href: "/service/consultation-droits-auteur",
		},
	];

	return (
		<footer className="cs-fooer">
			<Div className="cs-fooer_main">
				<Div className="container">
					<Div className="row">
						<Div className="col-lg-3 col-sm-6">
							<Div className="cs-footer_item">
								<TextWidget
									logoSrc="/images/footer_logo.svg"
									logoAlt="Logo"
									text="Protégeons et valorisons votre créativité dans le monde de la musique."
								/>
								<SocialWidget />
							</Div>
						</Div>
						<Div className="col-lg-3 col-sm-6">
							<Div className="cs-footer_item">
								<MenuWidget menuItems={serviceMenu} menuHeading="Services" />
							</Div>
						</Div>
						<Div className="col-lg-3 col-sm-6">
							<Div className="cs-footer_item">
								<ContactInfoWidget title="Contact" />
							</Div>
						</Div>
						<Div className="col-lg-3 col-sm-6">
							<Div className="cs-footer_item">
								<Newsletter
									title="Newsletter"
									subtitle="Restez à jour avec les dernières actualités et tendances en droits d’auteur et production musicale."
									placeholder="example@gmail.com"
								/>
							</Div>
						</Div>
					</Div>
				</Div>
			</Div>
			<Div className="container">
				<Div className="cs-bottom_footer">
					<Div className="cs-bottom_footer_left">
						<Div className="cs-copyright">Copyright © 2023 yodev</Div>
					</Div>
					<Div className="cs-bottom_footer_right">
						<MenuWidget menuItems={copyrightLinks} variant=" cs-style2" />
					</Div>
				</Div>
			</Div>
		</footer>
	);
}

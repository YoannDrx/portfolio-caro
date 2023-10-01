import React, { useEffect, useState } from "react";
import SocialWidget from "../Widget/SocialWidget";
import ContactInfoWidget from "../Widget/ContactInfoWidget";
import Div from "../Div";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Header({ variant }) {
	const [isSticky, setIsSticky] = useState(false);
	const [sideHeaderToggle, setSideHeaderToggle] = useState(false);
	const [mobileToggle, setMobileToggle] = useState(false);
	const [activeLink, setActiveLink] = useState("");
	const router = useRouter();

	useEffect(() => {
		window.addEventListener("scroll", () => {
			if (window.scrollY > 0) {
				setIsSticky(true);
			} else {
				setIsSticky(false);
			}
		});
	}, []);

	const handleLinkClick = (path) => {
		// 2. Mettre à jour activeLink
		setActiveLink(path);
		setMobileToggle(false);
	};

	const isActive = (path) => {
		// 3. Utilisez activeLink pour la classe CSS
		return activeLink === path || router.pathname === path;
	};

	return (
		<>
			<header
				className={`cs-site_header cs-style1 text-uppercase ${variant ? variant : ""} cs-sticky_header ${
					isSticky ? "cs-sticky_header_active" : ""
				}`}
			>
				<Div className="cs-main_header">
					<Div className="container">
						<Div className="cs-main_header_in">
							<Div className="cs-main_header_left">
								<Link className="cs-site_branding" href="/">
									<img src="/images/logo.svg" alt="Logo" />
								</Link>
							</Div>
							<Div className="cs-main_header_center">
								<Div className="cs-nav cs-primary_font cs-medium">
									<ul
										className="cs-nav_list"
										style={{ display: `${mobileToggle ? "block" : "none"}` }}
									>
										<li className={isActive("/") ? "active" : ""}>
											<Link href="/" onClick={() => handleLinkClick("/")}>
												Home
											</Link>
										</li>
										<li className={isActive("/about") ? "active" : ""}>
											<Link href="about" onClick={() => handleLinkClick("/about")}>
												About
											</Link>
										</li>
										<li className={isActive("/service") ? "active" : ""}>
											<Link href="/service" onClick={() => handleLinkClick("/service")}>
												Services
											</Link>
										</li>
										<li className={isActive("/portfolio") ? "active" : ""}>
											<Link href="/portfolio" onClick={() => handleLinkClick("/portfolio")}>
												Portfolio
											</Link>
										</li>
										<li className={isActive("/contact") ? "active" : ""}>
											<Link href="/contact" onClick={() => handleLinkClick("/contact")}>
												Contact
											</Link>
										</li>
										<li className={isActive("/blog") ? "active" : ""}>
											<Link href="/blog" onClick={() => handleLinkClick("/blog")}>
												Blog
											</Link>
										</li>
										<li className={isActive("/faq") ? "active" : ""}>
											<Link href="/faq" onClick={() => handleLinkClick("/faq")}>
												Faq
											</Link>
										</li>
									</ul>
									<span
										className={mobileToggle ? "cs-munu_toggle cs-toggle_active" : "cs-munu_toggle"}
										onClick={() => setMobileToggle(!mobileToggle)}
									>
										<span></span>
									</span>
								</Div>
							</Div>
							<Div className="cs-main_header_right">
								<Div className="cs-toolbox">
									<span
										className="cs-icon_btn"
										onClick={() => setSideHeaderToggle(!sideHeaderToggle)}
									>
										<span className="cs-icon_btn_in">
											<span />
											<span />
											<span />
											<span />
										</span>
									</span>
								</Div>
							</Div>
						</Div>
					</Div>
				</Div>
			</header>

			<Div className={sideHeaderToggle ? "cs-side_header active" : "cs-side_header"}>
				<button className="cs-close" onClick={() => setSideHeaderToggle(!sideHeaderToggle)} />
				<Div className="cs-side_header_overlay" onClick={() => setSideHeaderToggle(!sideHeaderToggle)} />
				<Div className="cs-side_header_in">
					<Div className="cs-side_header_shape" />
					<Link className="cs-site_branding" href="/">
						<img src="/images/footer_logo.svg" alt="Logo" />
					</Link>
					<Div className="cs-side_header_box">
						<h2 className="cs-side_header_heading">
							Vous avez des question <br /> concernant vos oeuvres ?
						</h2>
					</Div>
					<Div className="cs-side_header_box">
						<ContactInfoWidget title="Contactez-moi !" withIcon />
					</Div>
					<Div className="cs-side_header_box">
						<SocialWidget />
					</Div>
				</Div>
			</Div>
		</>
	);
}

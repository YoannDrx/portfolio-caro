import { Icon } from "@iconify/react";
import Head from "next/head";
import Div from "../components/Div";
import Layout from "../components/Layout";
import PageHeading from "../components/PageHeading";
import SectionHeading from "../components/SectionHeading";
import Spacing from "../components/Spacing";
import ContactInfoWidget from "../components/Widget/ContactInfoWidget";
import React, { useRef } from "react";
import emailjs from "emailjs-com";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Contact() {
	const form = useRef();

	// Configuration emailJS Yoann = à changer
	const sendEmail = (e) => {
		e.preventDefault();
		emailjs.sendForm("service_hdxsuya", "template_zm2ctt7", form.current, "W4SjcLIIqIH2c8aZX").then(
			(result) => {
				console.log(result);
				toast.success("Message envoyé avec succès !", {
					position: "bottom-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
				});
				document.getElementById("myForm").reset();
			},
			(error) => {
				toast.error("Oups, le message n'a pas été envoyé !", {
					position: "bottom-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
				});
			}
		);
	};

	return (
		<>
			<Head>
				<title>Contact</title>
				<meta name="description" content="Généré par create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Layout>
				<PageHeading title="Me Contacter" bgSrc="/images/contact_hero_bg.jpeg" pageLinkText="Contact" />
				<Spacing lg="150" md="80" />
				<Div className="container">
					<Div className="row">
						<Div className="col-lg-6">
							<SectionHeading
								title="Parlez moi de <br/> votre projet."
								subtitle="Disponibilité et réactivité"
							/>
							<Spacing lg="55" md="30" />
							<ContactInfoWidget withIcon />
							<Spacing lg="0" md="50" />
						</Div>
						<Div className="col-lg-6">
							<form id="myForm" ref={form} onSubmit={sendEmail} className="row">
								<Div className="col-sm-6">
									<label htmlFor="name" className="cs-primary_color">
										Nom complet*
									</label>
									<input type="text" name="name" className="cs-form_field" />
									<Spacing lg="20" md="20" />
								</Div>
								<Div className="col-sm-6">
									<label htmlFor="user_email" className="cs-primary_color">
										Email*
									</label>
									<input type="email" name="user_email" className="cs-form_field" />
									<Spacing lg="20" md="20" />
								</Div>
								<Div className="col-sm-6">
									<label htmlfor="project" className="cs-primary_color">
										Type de projet*
									</label>
									<input type="text" name="project" className="cs-form_field" />
									<Spacing lg="20" md="20" />
								</Div>
								<Div className="col-sm-6">
									<label className="cs-primary_color">Mobile*</label>
									<input type="text" className="cs-form_field" />
									<Spacing lg="20" md="20" />
								</Div>
								<Div className="col-sm-12">
									<label htmlFor="message" className="cs-primary_color">
										Message*
									</label>
									<textarea
										type="text"
										name="message"
										cols="30"
										rows="7"
										className="cs-form_field"
									></textarea>
									<Spacing lg="25" md="25" />
								</Div>
								<Div className="col-sm-12">
									<button type="submit" className="cs-btn cs-style1">
										<span>Envoyer le message</span>
										<Icon icon="bi:arrow-right" />
									</button>
								</Div>
							</form>
						</Div>
					</Div>
				</Div>
				<Spacing lg="150" md="80" />
				<Div className="cs-google_map">
					<iframe
						src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d83998.9677783261!2d2.264635166484754!3d48.85882549254894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e1f06e2b70f%3A0x40b82c3688c9460!2sParis!5e0!3m2!1sen!2sfr!4v1696007063088!5m2!1sen!2sfr&language=fr"
						title="Google Map"
					/>
				</Div>
				<Spacing lg="50" md="40" />
			</Layout>
		</>
	);
}

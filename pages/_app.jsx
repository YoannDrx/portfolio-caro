import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "../styles/globals.scss";
import { ToastContainer } from "react-toastify";
import { BlogFilterProvider } from "../context/BlogFilterContext";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../lang/en";
import fr from "../lang/fr";
import { useEffect } from "react";
import { useRouter } from "next/router";

i18n.use(initReactI18next).init({
	resources: {
		en: {
			translation: en,
		},
		fr: {
			translation: fr,
		},
	},
	lng: "en", // if you're using a language detector, do not define the lng option
	fallbackLng: "fr",

	interpolation: {
		escapeValue: false, // react already safes from xss
	},
});

function MyApp({ Component, pageProps }) {
	const router = useRouter(); // Obtenez le routeur depuis Next.js

	useEffect(() => {
		// Mettez à jour la langue i18n avec la langue actuelle du routeur
		i18n.changeLanguage(router.locale);
	}, [router.locale]);

	return (
		<>
			<BlogFilterProvider>
				<ToastContainer
					position="bottom-right"
					autoClose={2000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
				/>
				<Component {...pageProps} />
			</BlogFilterProvider>
		</>
	);
}

export default MyApp;

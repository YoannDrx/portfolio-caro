import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "../styles/globals.scss";
import { ToastContainer } from "react-toastify";

function MyApp({ Component, pageProps }) {
	return (
		<>
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
			<Component {...pageProps} />;
		</>
	);
}

export default MyApp;

import { Icon } from "@iconify/react";
import Div from "../Div";
import Link from "next/link";

export default function SocialWidget() {
	return (
		<Div className="cs-social_btns cs-style1">
			<Link href="/" className="cs-center" target="_blank" et rel="noopener noreferrer">
				<Icon icon="fa6-brands:linkedin-in" />
			</Link>
			<Link
				href="https://www.facebook.com/parigomusic?locale=fr_FR"
				className="cs-center"
				target="_blank"
				et
				rel="noopener noreferrer"
			>
				<Icon icon="fa6-brands:facebook" />
			</Link>
			<Link
				href="https://www.youtube.com/@parigoproductionmusic"
				className="cs-center"
				target="_blank"
				et
				rel="noopener noreferrer"
			>
				<Icon icon="fa6-brands:youtube" />
			</Link>
			<Link
				href="https://www.parigomusic.com/"
				className="cs-center"
				target="_blank"
				et
				rel="noopener noreferrer"
			>
				<Icon icon="mdi:web" />
			</Link>
		</Div>
	);
}

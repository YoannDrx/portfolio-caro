import { Icon } from "@iconify/react";
import Link from "next/link";

export default function Button({ btnLink, btnText, variant, icon, isExternal }) {
	return isExternal ? (
		<a
			href={btnLink}
			target="_blank"
			rel="noopener noreferrer"
			className={variant ? `cs-text_btn ${variant}` : "cs-text_btn"}
		>
			<span>{btnText}</span>
			{icon ? icon : <Icon icon="bi:arrow-right" />}
		</a>
	) : (
		<Link href={btnLink} className={variant ? `cs-text_btn ${variant}` : "cs-text_btn"}>
			<span>{btnText}</span>
			{icon ? icon : <Icon icon="bi:arrow-right" />}
		</Link>
	);
}

import Link from "next/link";
import Div from "../Div";
import classNames from "classnames";
import { Icon } from "@iconify/react";

export default function TagWidget({ title, data, onTagClick, selectedTag }) {
	return (
		<>
			<h4 className="cs-sidebar_widget_title">{title}</h4>
			<Div className="tagcloud">
				{data?.map((tag, index) => (
					<Link
						href={tag.url}
						key={index}
						className={classNames("tag-cloud-link", {
							"tag-cloud-link-selected": tag.title === selectedTag,
						})}
						onClick={(e) => {
							e.preventDefault();
							if (tag.title !== selectedTag) {
								onTagClick(tag.title); // Ajouter le tag seulement s'il n'est pas déjà sélectionné
							}
						}}
					>
						{tag.title}
						{/* delete tag */}
						{tag.title === selectedTag ? (
							<span
								className="tagcloud-remove"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation(); // Pour empêcher le clic de se propager au lien parent
									onTagClick(null); // Désélectionner le tag
								}}
							>
								<Icon icon="carbon:close" />
							</span>
						) : null}
					</Link>
				))}
			</Div>
		</>
	);
}
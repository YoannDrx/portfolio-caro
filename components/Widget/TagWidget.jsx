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
								onTagClick(tag.title);
							}
						}}
					>
						{tag.title}
						{/* delete tag */}
						{tag.title === selectedTag ? (
							<span
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									onTagClick(null);
								}}
							>
								<Icon icon="carbon:close" width={18}/>
							</span>
						) : null}
					</Link>
				))}
			</Div>
		</>
	);
}
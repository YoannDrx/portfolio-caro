import { Icon } from "@iconify/react";
import Link from "next/link";
import classNames from "classnames";

export default function ArchiveMenuWidget({ title, data, onYearClick, selectedYear }) {
	const handleClick = (itemTitle) => {
		if (typeof onYearClick === "function") {
			onYearClick(itemTitle);
		}
	};
	return (
		<>
			<h4 className="cs-sidebar_widget_title">{title}</h4>
			<ul className="cs-side_menu_widget">
				{data?.map((item, index) => (
					<li key={index}>
						<Icon icon="material-symbols:keyboard-double-arrow-right-rounded" />
						<Link
							href={item.url}
							className={classNames("category-cloud-link", {
								"category-selected": item.title === selectedYear,
							})}
							onClick={(e) => {
								e.preventDefault();
								handleClick(item.title);
							}}
						>
							{item.title}
						</Link>
					</li>
				))}
			</ul>
		</>
	);
}

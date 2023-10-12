import { Icon } from "@iconify/react";
import React from "react";

export default function SearchWidget({ title, setSearchKeyword }) {
	const handleSearch = (e) => {
		if (typeof setSearchKeyword === "function") {
			setSearchKeyword(e.target.value);
		} else {
			console.error("setSearchKeyword is not a function", setSearchKeyword);
		}
	};

	return (
		<>
			<h4 className="cs-sidebar_widget_title">{title}</h4>
			<form className="cs-sidebar_search">
				<input type="text" placeholder="Mot clé..." onChange={handleSearch} />
				<button className="cs-sidebar_search_btn">
					<Icon icon="material-symbols:search-rounded" />
				</button>
			</form>
		</>
	);
}

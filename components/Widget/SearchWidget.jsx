import { Icon } from "@iconify/react";
import React, { useState } from "react";

export default function SearchWidget({ title, setSearchKeyword, handleSearch }) {
	const [keyword, setKeyword] = useState("");

	const handleInputChange = (e) => {
		setKeyword(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (typeof setSearchKeyword === "function") {
			setSearchKeyword(keyword);
		}
	};

	return (
		<>
			<h4 className="cs-sidebar_widget_title">{title}</h4>
			<form className="cs-sidebar_search" onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="Mot clé..."
					value={keyword}
					onChange={handleInputChange}
				/>
				<button className="cs-sidebar_search_btn" type="submit">
					<Icon icon="material-symbols:search-rounded" />
				</button>
			</form>
		</>
	);
}

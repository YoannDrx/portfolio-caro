import { Icon } from "@iconify/react";
import React, { useState } from "react";

export default function SearchWidget({ title, setSearchKeyword }) {
	const [keyword, setKeyword] = useState("");
	const [feedback, setFeedback] = useState("");

	const handleInputChange = (e) => {
		setKeyword(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (keyword.trim() !== "") {
			if (typeof setSearchKeyword === "function") {
				setSearchKeyword(keyword);
			}
			setFeedback("Effacer le filtre par mot-clé");
			setKeyword(""); // Vider le champ de recherche
		} else {
			setFeedback("Veuillez entrer un mot-clé");
		}
	};

	const handleReset = () => {
		setKeyword("");
		setSearchKeyword("");
		setFeedback(""); // Réinitialiser le feedback
	};

	return (
		<>
			<h4 className="cs-sidebar_widget_title">{title}</h4>
			<form className="cs-sidebar_search" onSubmit={handleSubmit}>
				<input type="text" placeholder="Mot clé..." value={keyword} onChange={handleInputChange} />
				<button className="cs-sidebar_search_btn" type="submit">
					{keyword ? (
						<Icon icon="carbon:close" onClick={handleReset} />
					) : (
						<Icon icon="material-symbols:search-rounded" />
					)}
				</button>
			</form>
			{feedback && <p className="reset-accent" onClick={handleReset}>{feedback}</p>}
		</>
	);
}

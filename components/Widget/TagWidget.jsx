import Link from "next/link";
import Div from "../Div";
import classNames from 'classnames';


export default function TagWidget({ title, data, onTagClick, selectedTag }) {
	return (
		<>
			<h4 className="cs-sidebar_widget_title">{title}</h4>
			<Div className="tagcloud">
				{data?.map((tag, index) => (
					<Link
						href={tag.url}
						key={index}
						// className="tag-cloud-link"
						className={classNames("tag-cloud-link", {
							"tag-cloud-link-selected": tag.title === selectedTag,
						})}
						onClick={(e) => {
							e.preventDefault();
							onTagClick(tag.title);
						}}
					>
						{tag.title}
					</Link>
				))}
			</Div>
		</>
	);
}

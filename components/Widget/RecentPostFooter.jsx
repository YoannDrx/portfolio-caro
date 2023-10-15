import Link from "next/link";

import Div from "../Div";

export default function RecentPostFooter({ title, data }) {
	return (
		<>
      {title && <h2 className="cs-widget_title">{title}</h2>}
			<ul className="cs-recent_posts">
				{data?.map((item, index) => (
					<li key={index}>
						<Div className="cs-recent_post">
							<Link href={`/blog/${item.slug}`} className="cs-recent_post_thumb">
								<Div
									className="cs-recent_post_thumb_in cs-bg"
									style={{ backgroundImage: `url(${item.thumb})` }}
								/>
							</Link>
							<Div className="cs-recent_post_info">
								<h3 className="cs-recent_post_title">
									<Link href={`/blog/${item.slug}`}>{item.title}</Link>
								</h3>
								<Div className="cs-recent_post_date cs-primary_40_color">{item.date}</Div>
							</Div>
						</Div>
					</li>
				))}
			</ul>
		</>
	);
}

import { Icon } from "@iconify/react";
import React, { useState } from "react";
import SectionHeading from "./SectionHeading";
import Spacing from "./Spacing";
import ModalImage from "react-modal-image";
import Div from "./Div";

export default function DocumentairesGallery({ labels, documentaires }) {
  const [active, setActive] = useState("all");
  const [itemShow, setItemShow] = useState(10);

  const portfolioData = [
    {
      title: "Titre 1",
      subtitle: "Subtitle 1",
      href: "/portfolio/portfolio-details",
      src: "https://www.5doigts2pieds.fr/blog/wp-content/uploads/2022/03/Bikila-EVO-6-800x473.jpg",
      srcLg: "/images/portfolio_21_lg.jpeg",
      category: "label-1",
      height: 299,
    },
    {
      title: "Titre 2",
      subtitle: "Subtitle 2",
      href: "/portfolio/portfolio-details",
      src: "https://www.verywellfit.com/thmb/dAxgATiA7Fv1yJ7gj8St5Z9c3pA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/tips-for-proper-running-form-4020227-2165-ef4e9ba9dadb4f6c95529a14ae035912.jpg",
      srcLg: "/images/portfolio_25_lg.jpeg",
      category: "label-2",
      height: 622,
    },
    {
      title: "Colorful Art Work",
      subtitle: "View Large",
      href: "/portfolio/portfolio-details",
      src: "https://www.verywellfit.com/thmb/dAxgATiA7Fv1yJ7gj8St5Z9c3pA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/tips-for-proper-running-form-4020227-2165-ef4e9ba9dadb4f6c95529a14ae035912.jpg",
      srcLg: "/images/portfolio_29_lg.jpeg",
      category: "fashion",
      height: 299,
    },
    {
      title: "Colorful Art Work",
      subtitle: "View Large",
      href: "/portfolio/portfolio-details",
      src: "https://www.5doigts2pieds.fr/blog/wp-content/uploads/2022/03/Bikila-EVO-6-800x473.jpg",
      srcLg: "/images/portfolio_22_lg.jpeg",
      category: "commercial",
      height: 622,
    },
    {
      title: "Colorful Art Work",
      subtitle: "View Large",
      href: "/portfolio/portfolio-details",
      src: "https://www.5doigts2pieds.fr/blog/wp-content/uploads/2022/03/Bikila-EVO-6-800x473.jpg",
      srcLg: "/images/portfolio_27_lg.jpeg",
      category: "wedding",
      height: 622,
    },
    {
      title: "Colorful Art Work",
      subtitle: "View Large",
      href: "/portfolio/portfolio-details",
      src: "https://www.verywellfit.com/thmb/dAxgATiA7Fv1yJ7gj8St5Z9c3pA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/tips-for-proper-running-form-4020227-2165-ef4e9ba9dadb4f6c95529a14ae035912.jpg",
      srcLg: "/images/portfolio_23_lg.jpeg",
      category: "fashion",
      height: 299,
    },
    {
      title: "Colorful Art Work",
      subtitle: "View Large",
      href: "/portfolio/portfolio-details",
      src: "/images/portfolio_26.jpeg",
      srcLg: "/images/portfolio_26_lg.jpeg",
      category: "landscape",
      height: 622,
    },
    {
      title: "Colorful Art Work",
      subtitle: "View Large",
      href: "/portfolio/portfolio-details",
      src: "/images/portfolio_30.jpeg",
      srcLg: "/images/portfolio_30_lg.jpeg",
      category: "portrait",
      height: 299,
    },
    {
      title: "Colorful Art Work",
      subtitle: "View Large",
      href: "/portfolio/portfolio-details",
      src: "/images/portfolio_24.jpeg",
      srcLg: "/images/portfolio_24_lg.jpeg",
      category: "shortfilm",
      height: 622,
    },
    {
      title: "Colorful Art Work",
      subtitle: "View Large",
      href: "/portfolio/portfolio-details",
      src: "/images/portfolio_28.jpeg",
      srcLg: "/images/portfolio_28_lg.jpeg",
      category: "fashion",
      height: 622,
    },
    {
      title: "Colorful Art Work",
      subtitle: "View Large",
      href: "/portfolio/portfolio-details",
      src: "/images/portfolio_21.jpeg",
      srcLg: "/images/portfolio_21_lg.jpeg",
      category: "wedding",
      height: 299,
    },
    {
      title: "Colorful Art Work",
      subtitle: "View Large",
      href: "/portfolio/portfolio-details",
      src: "/images/portfolio_25.jpeg",
      srcLg: "/images/portfolio_25_lg.jpeg",
      category: "portrait",
      height: 622,
    },
    {
      title: "Colorful Art Work",
      subtitle: "View Large",
      href: "/portfolio/portfolio-details",
      src: "/images/portfolio_29.jpeg",
      srcLg: "/images/portfolio_29_lg.jpeg",
      category: "fashion",
      height: 299,
    },
    {
      title: "Colorful Art Work",
      subtitle: "View Large",
      href: "/portfolio/portfolio-details",
      src: "/images/portfolio_22.jpeg",
      srcLg: "/images/portfolio_22_lg.jpeg",
      category: "commercial",
      height: 622,
    },
  ];
  const categoryMenu = [
    {
      title: "Wedding",
      category: "wedding",
    },
    {
      title: "Portrait",
      category: "portrait",
    },
    {
      title: "Fashion",
      category: "fashion",
    },
    {
      title: "Commercial",
      category: "commercial",
    },
    {
      title: "Landscape",
      category: "landscape",
    },
    {
      title: "Short film",
      category: "shortfilm",
    },
  ];
  return (
    <>
      <Div className="container">
        <Div className="cs-portfolio_1_heading">
          <SectionHeading title="Some recent work" subtitle="Our Portfolio" />
          <Div className="cs-filter_menu cs-style1">
            <ul className="cs-mp0 cs-center">
              <li className={active === "all" ? "active" : ""}>
                <span onClick={() => setActive("all")}>All</span>
              </li>
              {categoryMenu.map((item, index) => (
                <li className={active === item.category ? "active" : ""} key={index}>
                  <span onClick={() => setActive(item.category)}>{item.title}</span>
                </li>
              ))}
            </ul>
          </Div>
        </Div>
      </Div>
      <Spacing lg="90" md="45" />
      <Div className="cs-masonry_4_col">
        {documentaires.slice(0, itemShow).map((item, index) => (
          <Div className={`${active === "all" ? "" : !(active === item.category) ? "d-none" : ""}`} key={index}>
            <Div className="cs-portfolio cs-style1 cs-type2" style={{ height: `${item.height}px` }}>
              <Div className="cs-lightbox_item">
                <ModalImage small={item.src} large={item.srcLg} alt={item.title} />
              </Div>
              <Div className="cs-portfolio_hover" />
              <span className="cs-plus" />
              <Div className="cs-portfolio_bg cs-bg" style={{ backgroundImage: `url("${item.srcLg}")` }} />
              <Div className="cs-portfolio_info">
                <Div className="cs-portfolio_info_bg cs-accent_bg" />
                <h2 className="cs-portfolio_title">{item.title}</h2>
                <Div className="cs-portfolio_subtitle">{item.subtitle}</Div>
              </Div>
            </Div>
          </Div>
        ))}
      </Div>
      <Div className="container">
        <Div className="text-center">
          {documentaires.length <= itemShow ? (
            ""
          ) : (
            <>
              <Spacing lg="65" md="40" />
              <span className="cs-text_btn" onClick={() => setItemShow(itemShow + 4)}>
                <span>Load More</span>
                <Icon icon="bi:arrow-right" />
              </span>
            </>
          )}
        </Div>
      </Div>
    </>
  );
}

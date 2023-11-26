import { Icon } from "@iconify/react";
import React, { useState } from "react";
import SectionHeading from "./SectionHeading";
import Spacing from "./Spacing";
import ModalImage from "react-modal-image";
import Div from "./Div";
import Link from "next/link";

export default function DocumentairesGallery({ documentaires }) {
  const [active, setActive] = useState("all");
  const [visibleCount, setVisibleCount] = useState(10);

  const categoryMenu = [
    {
      title: "Little big story",
      category: "little-big-story",
    },
    {
      title: "13 prods",
      category: "13-prods",
    },
    {
      title: "Via découvertes",
      category: "via-decouvertes-films",
    },
    {
      title: "Pop films",
      category: "pop-films",
    },
  ];

  const openLink = (e, link) => {
    e.stopPropagation();
    if (link) {
      window.open(link, "_blank");
    }
  };

  return (
    <>
      <Div className="container">
        <Div className="cs-portfolio_1_heading">
          <SectionHeading title="Les dernières productions" subtitle="En collaborations" />
          <Div className="cs-filter_menu cs-style1">
            <ul className="cs-mp0 cs-center">
              <li className={active === "all" ? "active" : ""}>
                <span onClick={() => setActive("all")}>All</span>
              </li>
              {categoryMenu.map((item, index) => {
                return (
                  <li className={active === item.category ? "active" : ""} key={index}>
                    <span
                      onClick={() => {
                        console.log("Clicked category:", item.category);
                        setActive(item.category);
                      }}>
                      {item.title}
                    </span>
                  </li>
                );
              })}
            </ul>
          </Div>
        </Div>
      </Div>
      <Spacing lg="90" md="45" />
      <Div className="cs-masonry_4_col">
        {documentaires.map((item, index) => {
          const shouldDisplay =
            (active === "all" || active === item.category) && (active === "all" ? index < visibleCount : true);

          return shouldDisplay ? (
            <Div className={`${active === "all" ? "" : !(active === item.category) ? "d-none" : ""}`} key={index}>
              <a onClick={(e) => openLink(e, item.link)}>
                <Div className="cs-portfolio cs-style1 cs-type2" style={{ height: `${item.height}px` }}>
                  <Div className="cs-lightbox_item">
                    {/* <ModalImage small={item.src} large={item.srcLg} alt={item.title} /> */}
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
              </a>
            </Div>
          ) : null;
        })}
      </Div>
      <Div className="container">
        <Div className="text-center">
          {visibleCount < documentaires.length && (
            <>
              <Spacing lg="65" md="40" />
              <span className="cs-text_btn" onClick={() => setVisibleCount(visibleCount + 200)}>
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

import { Icon } from "@iconify/react";
import React, { useState } from "react";
import SectionHeading from "./SectionHeading";
import Spacing from "./Spacing";
import ModalImage from "react-modal-image";
import Div from "./Div";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

export default function PortfolioGallery({ portfolioData }) {
  const router = useRouter();
  const { locale } = router;
  const [active, setActive] = useState("all");
  const [visibleCount, setVisibleCount] = useState(10);

  const categoryMenu = [
    {
      title: "Albums librairie musicale",
      category: "albums",
    },
    {
      title: "Vinyles",
      category: "vinyles",
    },
    {
      title: "Clips",
      category: "clips",
    },
    {
      title: "Synchros",
      category: "synchros",
    },
    {
      title: "Documentaires",
      category: "documentaires",
    },
  ];

  return (
    <>
      <Div className="container">
        <Div className="cs-portfolio_1_heading">
          <SectionHeading title="Tous mes projets" subtitle="Production" />
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
        {portfolioData.map((item, index) => {
          const shouldDisplay =
            (active === "all" || active === item.category) && (active === "all" ? index < visibleCount : true);

          return shouldDisplay ? (
            <Div className={`${active === "all" ? "" : !(active === item.category) ? "d-none" : ""}`} key={index}>
              <Link href={`/${locale}${item.link}`}>
                <Div className="cs-portfolio cs-style1 cs-type2" style={{ height: `${item.height}px` }}>
                  <Div className="cs-lightbox_item">
                    {/* <ModalImage small={item.src} large={item.srcLg} alt={item.title} /> */}
                    {/* <Image src={item.src} alt="photo" width={0} height={0} sizes="100vw" className="labelImage" /> */}
                  </Div>
                  <Div className="cs-portfolio_hover" />
                  <span className="cs-plus" />
                  <Div className="cs-portfolio_bg cs-bg" style={{ backgroundImage: `url("${item.src}")` }} />
                  <Div className="cs-portfolio_info">
                    <Div className="cs-portfolio_info_bg cs-accent_bg" />
                    <h2 className="cs-portfolio_title">{item.title}</h2>
                    <Div className="cs-portfolio_subtitle">{item.subtitle}</Div>
                  </Div>
                </Div>
              </Link>
            </Div>
          ) : null;
        })}
      </Div>
      <Div className="container">
        <Div className="text-center">
          {visibleCount < portfolioData.length && (
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

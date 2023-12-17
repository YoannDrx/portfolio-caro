import { Icon } from "@iconify/react";
import React, { useState } from "react";
import SectionHeading from "./SectionHeading";
import Spacing from "./Spacing";
import Div from "./Div";
import Link from "next/link";
import { useRouter } from "next/router";
import { createPortfolioLink } from "../lib/portfolioUtils";
import VideoModal from "./VideoModal";

export default function PortfolioGallery({ portfolioData }) {
  const router = useRouter();
  const { locale } = router;
  const [active, setActive] = useState("all");
  const [visibleCount, setVisibleCount] = useState(20);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState("");

  console.log("activeVideoUrl >>", activeVideoUrl);

  const openVideoModal = (videoUrl) => {
    setActiveVideoUrl(videoUrl);
    setVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setVideoModalOpen(false);
    setActiveVideoUrl("");
  };

  const handleClickItem = (linkInfo, e) => {
    if (linkInfo.isVideoClip) {
      e.preventDefault();
      e.stopPropagation();
      openVideoModal(linkInfo.href);
    }
  };

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

          const linkInfo = createPortfolioLink(item, locale);

          return shouldDisplay ? (
            <Div className={`${active === "all" ? "" : !(active === item.category) ? "d-none" : ""}`} key={index}>
              {linkInfo.isVideoClip ? (
                // Si c'est un clip vidéo, utilisez la fonction openVideoModal
                <Div
                  className="cs-portfolio cs-style-portfoliogallery cs-type2"
                  style={{ height: `${item.height}px` }}
                  onClick={(e) => handleClickItem(linkInfo, e)}>
                  <Div className="cs-portfolio_hover" />
                  <span className="cs-plus" />
                  <Div className="cs-portfolio_bg cs-bg" style={{ backgroundImage: `url("${item.src}")` }} />
                  <Div className="cs-portfolio_info">
                    <Div className="cs-portfolio_info_bg cs-accent_bg" />
                    <h2 className="cs-portfolio_title">{item.title}</h2>
                    <Div className="cs-portfolio_subtitle">{item.subtitle}</Div>
                  </Div>
                </Div>
              ) : // <Link
              //   href={linkInfo.href}
              //   target="_blank"
              //   rel="noopener noreferrer"
              //   onClick={(e) => handleClickItem(linkInfo, e)}>
              //   <Div className="cs-portfolio cs-style-portfoliogallery cs-type2" style={{ height: `${item.height}px` }}>
              //     <Div className="cs-portfolio_hover" />
              //     <span className="cs-plus" />
              //     <Div className="cs-portfolio_bg cs-bg" style={{ backgroundImage: `url("${item.src}")` }} />
              //     <Div className="cs-portfolio_info">
              //       <Div className="cs-portfolio_info_bg cs-accent_bg" />
              //       <h2 className="cs-portfolio_title">{item.title}</h2>
              //       <Div className="cs-portfolio_subtitle">{item.subtitle}</Div>
              //     </Div>
              //   </Div>
              // </Link>
              linkInfo.isExternal ? (
                // Pour les liens externes
                <Link href={linkInfo.href} target="_blank" rel="noopener noreferrer">
                  <Div className="cs-portfolio cs-style-portfoliogallery cs-type2" style={{ height: `${item.height}px` }}>
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
              ) : (
                // Pour les liens internes
                <Link href={linkInfo.href}>
                  <Div className="cs-portfolio cs-style-portfoliogallery cs-type2" style={{ height: `${item.height}px` }}>
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
              )}
              {/* {isExternal ? (
                <Link href={href} target="_blank" rel="noopener noreferrer">
                  <Div className="cs-portfolio cs-style-portfoliogallery cs-type2" style={{ height: `${item.height}px` }}>
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
              ) : (
                <Link href={href}>
                  <Div className="cs-portfolio cs-style-portfoliogallery cs-type2" style={{ height: `${item.height}px` }}>
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
              )} */}
            </Div>
          ) : null;
        })}
      </Div>

      {/* Modal pour les clips vidéo */}
      {videoModalOpen && (
        <VideoModal
          videoSrc={activeVideoUrl}
          onClose={closeVideoModal}
          // ...autres props pour VideoModal si nécessaire...
        />
      )}

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

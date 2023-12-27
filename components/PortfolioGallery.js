import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
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
  const [windowWidth, setWindowWidth] = useState(undefined);

  useEffect(() => {
    // Mettre à jour la largeur initiale de la fenêtre
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const calculateHeight = (item) => {
    if (windowWidth) {
      if (windowWidth <= 320) {
        return item.w320; // Hauteur pour les écrans plus petits que 320px
      } else if (windowWidth <= 575) {
        return item.w575; // Hauteur pour les écrans entre 320px et 574px
      } else if (windowWidth < 768) {
        return item.w768; // Hauteur pour les écrans entre 575px et 767px
      } else if (windowWidth <= 991) {
        return item.w991; // Hauteur pour les écrans entre 768px et 990px
      } else if (windowWidth <= 1080) {
        return item.w1080; // Hauteur pour les écrans entre 991px et 1079px
      } else if (windowWidth <= 1199) {
        return item.w1199; // Hauteur pour les écrans entre 1080px et 1198px
      } else if (windowWidth < 1380) {
        return item.w1380; // Hauteur pour les écrans entre 1199px et 1379px
      } else if (windowWidth < 1400) {
        return item.w1400; // Hauteur pour les écrans entre 1380px et 1399px
      } else return item.w1540; // Hauteur pour les écrans plus grands que 1399px
    }
    return item.defaultHeight; // Retourner une hauteur par défaut si windowWidth n'est pas défini
  };

  const openVideoModal = (videoUrl) => {
    setActiveVideoUrl("");

    setTimeout(() => {
      setActiveVideoUrl(videoUrl);
      setVideoModalOpen(true);
    }, 0);
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
                  // style={{ height: `${item.height}px` }}
                  style={{ height: calculateHeight(item) }}
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
              ) : linkInfo.isExternal ? (
                // Pour les liens externes
                <Link href={linkInfo.href} target="_blank" rel="noopener noreferrer">
                  <Div className="cs-portfolio cs-style-portfoliogallery cs-type2" style={{ height: calculateHeight(item) }}>
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
                  <Div className="cs-portfolio cs-style-portfoliogallery cs-type2" style={{ height: calculateHeight(item) }}>
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
            </Div>
          ) : null;
        })}
      </Div>

      {/* Modal pour les clips vidéo */}
      {videoModalOpen && <VideoModal videoSrc={activeVideoUrl} onClose={closeVideoModal} />}

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

import Head from "next/head";
import React from "react";
import Button from "../../components/Button";
import Cta from "../../components/Cta";
import Div from "../../components/Div";
import Layout from "../../components/Layout";
import PageHeading from "../../components/PageHeading";
import SectionHeading from "../../components/SectionHeading";
import Spacing from "../../components/Spacing";
import frData from "../../lang/fr.json";
import enData from "../../lang/en.json";
import ComposerCard from "../../components/ComposerCard";
import Link from "next/link";
import { FaSpotify } from "react-icons/fa";
import { getSpotifyAlbumId } from "../../lib/portfolioUtils";

export async function getStaticProps({ params, locale }) {
  const data = locale === "fr" ? frData : enData;

  const albums = data.portfolio;
  const albumIndex = albums.findIndex((item) => item.slug === params.portfolioId);

  if (!albums || albumIndex === -1) {
    return { notFound: true };
  }

  const prevAlbum = albums[albumIndex - 1] || null;
  const nextAlbum = albums[albumIndex + 1] || null;

  return { props: { album: albums[albumIndex], prevAlbum, nextAlbum } };
}

export async function getStaticPaths() {
  const frAlbumsWithSlug = frData.portfolio.filter((item) => item.slug);
  const enAlbumsWithSlug = enData.portfolio.filter((item) => item.slug);

  const paths = [
    ...frAlbumsWithSlug.map((album) => ({ params: { portfolioId: album.slug }, locale: "fr" })),
    ...enAlbumsWithSlug.map((album) => ({ params: { portfolioId: album.slug }, locale: "en" })),
  ];

  return { paths, fallback: false };
}

export default function PortfolioDetails({ album, prevAlbum, nextAlbum }) {
  const spotifyAlbumId = getSpotifyAlbumId(album.linkSpotify);

  // Construit l'URL d'intégration Spotify
  const spotifyEmbedUrl = `https://open.spotify.com/embed/album/${spotifyAlbumId}?utm_source=generator&theme=0`;

  const renderLineWithInlineStyles = (line) => {
    const inlineStyle = { color: "#FF4A17" };
    return line.split(/(<a[^>]*>.*?<\/a>)/).map((part, index) => {
      if (part.startsWith("<a")) {
        return <span dangerouslySetInnerHTML={{ __html: part }} style={inlineStyle} key={index}></span>;
      } else {
        return part;
      }
    });
  };

  return (
    <>
      <Head>
        <title>Portfolio - {album.title}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        {/* <PageHeading title="Portfolio Details" bgSrc="/images/service_hero_bg.jpeg" pageLinkText={album.title} /> */}
        <Spacing lg="150" md="80" />
        <Div className="container">
          <Div className="row">
            {/* Colonne pour l'image */}
            <Div className="col-lg-4">
              <img src={album.src} alt="Details" className="cs-radius_15 w-100" />
              <Div className={"mt-4"}>
                <iframe
                  src={spotifyEmbedUrl}
                  width="100%"
                  height="650"
                  allowfullscreen=""
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"></iframe>
              </Div>
            </Div>

            {/* Colonne pour le contenu */}
            <Div className="col-lg-8">
              <SectionHeading title={album.title} subtitle="Creative" />
              <p>
                {album.description.split("\n").map((line, index) => (
                  <React.Fragment key={index}>
                    {renderLineWithInlineStyles(line)}
                    <br />
                  </React.Fragment>
                ))}
              </p>

              {/* Informations supplémentaires */}
              <Div className="row mt-5">
                {/* Colonne pour les compositeurs */}
                <Div className="col-6 mb-4">
                  <h3 className="cs-accent_color cs-font_22 cs-font_18_sm cs-m0 mb-4">Compositeurs:</h3>
                  {album.compositeurs.map((composer, index) => (
                    <ComposerCard key={index} composer={composer} />
                  ))}
                </Div>
                {/* Informations supplémentaires */}
                <Div className="col-6 mb-4">
                  <Div className="mb-4">
                    <h3 className="cs-accent_color cs-font_22 cs-font_18_sm cs-m0">Date de sortie:</h3>
                    <p className="cs-m0">{album.releaseDate}</p>
                  </Div>
                  <Div className="mb-4">
                    <h3 className="cs-accent_color cs-font_22 cs-font_18_sm cs-m0">Categorie:</h3>
                    <p className="cs-m0">{album.category}</p>
                  </Div>
                  <Div className="mb-4">
                    <h3 className="cs-accent_color cs-font_22 cs-font_18_sm cs-m0">Genre:</h3>
                    <p className="cs-m0">{album.genre}</p>
                  </Div>
                </Div>
              </Div>
            </Div>
            <Spacing lg="65" md="10" />
            <Div className="cs-page_navigation cs-center">
              {prevAlbum && (
                <Div>
                  <Button btnLink={`/portfolio/${prevAlbum.slug}`} btnText="Prev Project" variant="cs-type1" />
                </Div>
              )}
              {nextAlbum && (
                <Div>
                  <Button btnLink={`/portfolio/${nextAlbum.slug}`} btnText="Next Project" />
                </Div>
              )}
            </Div>
          </Div>
          <Spacing lg="145" md="80" />
          <Cta title="agency@arino.com" bgSrc="/images/cta_bg_2.jpeg" variant="rounded-0" />
        </Div>
      </Layout>
    </>
  );
}

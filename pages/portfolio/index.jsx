import Head from "next/head";
import React, { useState } from "react";
import Cta from "../../components/Cta";
import Div from "../../components/Div";
import Layout from "../../components/Layout";
import PageHeading from "../../components/PageHeading";
import Spacing from "../../components/Spacing";
import fr from "../../lang/fr.json";
import PortfolioGallery from "../../components/PortfolioGallery";
import { shuffleArray } from "../../lib/portfolioUtils";
import frData from "../../lang/fr.json";
import enData from "../../lang/en.json";

export async function getServerSideProps() {
  const data = fr.portfolio;

  const shuffledData = shuffleArray(data);

  return { props: { portfolioData: shuffledData } };
}

// export async function getStaticProps({ locale }) {
//   const data = locale === "en" ? enData.portfolio : frData.portfolio;
//   return { props: { portfolioData: data } };
// }

export default function PortfolioPage({ portfolioData }) {
  return (
    <>
      <Head>
        <title>Home - Portfolio</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        {/* <PageHeading title="Portfolio" bgSrc="/images/portfolio_hero_bg.jpeg" pageLinkText="Portfolio" /> */}
        <Spacing lg="145" md="80" />
        <Div className="container">
          <PortfolioGallery portfolioData={portfolioData} />
        </Div>
        <Spacing lg="145" md="80" />
        <Cta title="agency@arino.com" bgSrc="/images/cta_bg_2.jpeg" variant="rounded-0" />
      </Layout>
    </>
  );
}

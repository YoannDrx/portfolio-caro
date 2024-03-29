import { Icon } from "@iconify/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Cta from "../../components/Cta";
import Div from "../../components/Div";
import Layout from "../../components/Layout";
import PageHeading from "../../components/PageHeading";
import Sidebar from "../../components/Sidebar.jsx";
import Spacing from "../../components/Spacing";
import { getAllPostIds, getPostData, getSortedPostsData } from "../../lib/blogUtils";

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.blogId);
  const allPostsData = await getSortedPostsData();
  return {
    props: {
      postData,
      allPostsData,
    },
  };
}

export default function BlogDetails({ postData, allPostsData }) {
  const router = useRouter();
  const blogId = router.query.blogId;

  return (
    <>
      <Head>
        <title>Blog - {blogId}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        {/* <PageHeading title="Article Details" bgSrc="/images/blog_details_hero_bg.jpeg" pageLinkText={blogId} /> */}
        <Spacing lg="150" md="80" />
        <Div className="container">
          <Div className="row">
            <Div className="col-lg-8">
              <Div className="cs-post cs-style2">
                <Div className="cs-post_thumb cs-radius_15">
                  <img
                    src="/images/post_5.jpeg" // Image originale conservée
                    alt="Post"
                    className="w-100 cs-radius_15"
                  />
                </Div>
                <Div className="cs-post_info">
                  <Div className="cs-post_meta cs-style1 cs-ternary_color cs-semi_bold cs-primary_font">
                    <span className="cs-posted_by">07 Mar 2022</span>
                    <Link href="/blog" className="cs-post_avatar">
                      Gestion des Droits
                    </Link>
                  </Div>
                  <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
                </Div>
              </Div>
              <Spacing lg="30" md="30" />
              <h2 className="cs-font_50 cs-m0">Laissez un commentaire</h2>
              <Spacing lg="5" md="5" />
              <p className="cs-m0">Votre adresse e-mail ne sera pas publiée. Les champs obligatoires sont indiqués par *</p>
              <Spacing lg="40" md="30" />
              <form className="row">
                <Div className="col-lg-6">
                  <label>Nom complet*</label>
                  <input type="text" className="cs-form_field" />
                  <Div className="cs-height_20 cs-height_lg_20" />
                </Div>
                <Div className="col-lg-6">
                  <label>Email*</label>
                  <input type="text" className="cs-form_field" />
                  <Div className="cs-height_20 cs-height_lg_20" />
                </Div>
                <Div className="col-lg-12">
                  <label>Site Web*</label>
                  <input type="text" className="cs-form_field" />
                  <Div className="cs-height_20 cs-height_lg_20" />
                </Div>
                <Div className="col-lg-12">
                  <label>Votre commentaire*</label>
                  <textarea cols={30} rows={7} className="cs-form_field" />
                  <Div className="cs-height_25 cs-height_lg_25" />
                </Div>
                <Div className="col-lg-12">
                  <button className="cs-btn cs-style1">
                    <span>Envoyer le message</span>
                    <Icon icon="bi:arrow-right" />
                  </button>
                </Div>
              </form>
            </Div>
            <Div className="col-xl-3 col-lg-4 offset-xl-1">
              <Spacing lg="0" md="80" />
              <Sidebar allPostsData={allPostsData} />
            </Div>
          </Div>
        </Div>
        <Spacing lg="150" md="80" />
        <Div className="container">
          <Cta
            title="Discutons ensemble pour créer quelque chose de <i>génial</i>"
            btnText="Demander un rendez-vous"
            btnLink="/contact"
            bgSrc="/images/cta_bg.jpeg"
          />
        </Div>
      </Layout>
    </>
  );
}

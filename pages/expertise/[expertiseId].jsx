import Head from "next/head";
import React from "react";
import Accordion from "../../components/Accordion";
import Cta from "../../components/Cta";
import Div from "../../components/Div";
import Layout from "../../components/Layout";
import PageHeading from "../../components/PageHeading";
import SectionHeading from "../../components/SectionHeading";
import TestimonialSlider from "../../components/Slider/TestimonialSlider";
import Spacing from "../../components/Spacing";
import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import matter from "gray-matter";
import ImageAndTextRight from "../../components/ImageAndTextRight";
import ImageAndTextLeft from "../../components/ImageAndTextLeft";
import ExpertiseSection from "../../components/ExpertiseSection";
import ClickableImageGrid from "../../components/ClickableImageGrid";
import DocumentairesGallery from "../../components/DocumentairesGallery";

export async function getStaticProps({ params, locale }) {
  // Extraire l'identifiant de service à partir des paramètres de la route
  const { expertiseId } = params;
  // Construire le chemin du fichier markdown basé sur l'identifiant
  const filePath = path.join(process.cwd(), "content", "expertises", locale, `${expertiseId}.md`);
  // Lire le contenu du fichier
  const fileContents = fs.readFileSync(filePath, "utf8");
  // Utiliser gray-matter pour analyser les métadonnées du contenu du fichier
  const matterResult = matter(fileContents);

  // matterResult.data contient les métadonnées YAML
  const metaData = matterResult.data;

  const splitMarkdownIntoSections = (markdownContent) => {
    const sectionDelimiter = "<!-- section:end -->";
    return markdownContent
      .split(sectionDelimiter)
      .map((section) => section.replace("<!-- section:start -->", "").replace("<!-- section:end -->", "").trim());
  };

  // Diviser le contenu en sections Markdown
  const markdownSections = splitMarkdownIntoSections(matterResult.content);

  // Retourner les sections HTML et les métadonnées comme props de la page
  return {
    props: {
      markdownSections,
      ...matterResult.data,
      expertiseId: params.expertiseId,
      metaData,
    },
  };
}

export async function getStaticPaths({ locales }) {
  const paths = locales.flatMap((locale) => {
    const directory = path.join(process.cwd(), "content", "expertises", locale);
    const filenames = fs.readdirSync(directory);
    return filenames.map((filename) => {
      const expertiseId = path.parse(filename).name;
      return {
        params: { expertiseId },
        locale,
      };
    });
  });

  return {
    paths,
    fallback: "blocking",
  };
}

const serviceExpertises = [
  {
    link: "/expertise/droits-auteur",
    text: "Gestions des droits d’auteur",
  },
  {
    link: "/expertise/droits-voisins",
    text: "Gestions des droits voisins",
  },
  {
    link: "/expertise/gestion-administrative-et-editoriale",
    text: "Gestions administratives et éditoriales",
  },
  {
    link: "/expertise/gestion-distribution",
    text: "Gestions de la distribution physique et digitale",
  },
  {
    link: "/expertise/sous-edition",
    text: "Gestion des oeuvres en sous édition",
  },
  {
    link: "/expertise/dossier-subvention",
    text: "Gestion des dossiers de subvention",
  },
];
export default function ServiceDetails({ markdownSections, expertiseId, metaData }) {
  // Utiliser les métadonnées directement
  const {
    title,
    intro,
    img1,
    img2,
    img3,
    img4,
    img5,
    img6,
    labels,
    img2Link,
    img3Link,
    img4Link,
    img5Link,
    documentaires,
    imgFooter,
  } = metaData;

  // Utiliser les sections Markdown
  const part1 = markdownSections[0];
  const part2 = markdownSections[1];
  const part3 = markdownSections[2];
  const part4 = markdownSections[3];
  const part5 = markdownSections[4];
  const part6 = markdownSections[5];
  const part7 = markdownSections[6];
  const part8 = markdownSections[7];

  return (
    <>
      <Head>
        <title>Service - {"test"}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        {/* <PageHeading title="Mes expertises" bgSrc="/images/service_hero_bg.jpeg" pageLinkText={expertiseId} /> */}
        <Spacing lg="145" md="80" />
        <Div className="container">
          <SectionHeading title={title} subtitle="Comprendre" variant="cs-style1 text-center" intro={intro} />
        </Div>
        {part1 !== undefined || "" ? (
          <ImageAndTextRight title={""} imagePath={img1} link={null} altText="Service">
            <ReactMarkdown
              children={part1}
              components={{
                h3: ({ node, ...props }) => <h3 className={"mdTitle"} {...props} />,
                a: ({ node, ...props }) => <a className="link" target="_blank" rel="noopener noreferrer" {...props} />,
                strong: ({ node, ...props }) => <b style={{ color: "#ff4b17" }} {...props} />,
                span: ({ node, ...props }) => <span style={{ color: "white", backgroundColor: "pink" }} {...props} />,
                em: ({ node, ...props }) => <span style={{ color: "white", fontWeight: "bold" }} {...props} />,
                img: ({ node, ...props }) => <img className="mdImage" style={{ marginLeft: 100 }} {...props} />,
                ul: ({ node, ...props }) => <ul style={{ marginTop: 0, marginBottom: 50, marginLeft: 20 }} {...props} />,
                br: ({ node, ...props }) => <br />,
              }}
            />
          </ImageAndTextRight>
        ) : null}

        {part2 !== undefined || "" ? (
          <ImageAndTextLeft title={""} imagePath={img2} link={img2Link} altText="Service">
            <ReactMarkdown
              children={part2}
              components={{
                h3: ({ node, ...props }) => <h3 className={"mdTitle"} {...props} />,
                a: ({ node, ...props }) => <a className="link" target="_blank" rel="noopener noreferrer" {...props} />,
                strong: ({ node, ...props }) => <b style={{ color: "#ff4b17" }} {...props} />,
                span: ({ node, ...props }) => <span style={{ color: "white", backgroundColor: "pink" }} {...props} />,
                em: ({ node, ...props }) => <span style={{ color: "white", fontWeight: "bold" }} {...props} />,
                img: ({ node, ...props }) => <img className="mdImage" {...props} />,
                ul: ({ node, ...props }) => <ul style={{ marginTop: 0, marginBottom: 50, marginLeft: 20 }} {...props} />,
              }}
            />
          </ImageAndTextLeft>
        ) : null}
        {part3 !== undefined || "" ? (
          <ImageAndTextRight title={""} imagePath={img3} link={img3Link} altText="Service">
            <ReactMarkdown
              children={part3}
              components={{
                h3: ({ node, ...props }) => <h3 className={"mdTitle"} {...props} />,
                a: ({ node, ...props }) => <a className="link" target="_blank" rel="noopener noreferrer" {...props} />,
                strong: ({ node, ...props }) => <b style={{ color: "#ff4b17" }} {...props} />,
                span: ({ node, ...props }) => <span style={{ color: "white", backgroundColor: "pink" }} {...props} />,
                em: ({ node, ...props }) => <span style={{ color: "white", fontWeight: "bold" }} {...props} />,
                img: ({ node, ...props }) => <img className="mdImage" {...props} />,
                ul: ({ node, ...props }) => <ul style={{ marginTop: 0, marginBottom: 50, marginLeft: 20 }} {...props} />,
              }}
            />
          </ImageAndTextRight>
        ) : null}

        {part4 !== undefined || "" ? (
          <ImageAndTextLeft title={""} imagePath={img4} link={img4Link} altText="Service">
            <ReactMarkdown
              children={part4}
              components={{
                h3: ({ node, ...props }) => <h3 className={"mdTitle"} {...props} />,
                a: ({ node, ...props }) => <a className="link" target="_blank" rel="noopener noreferrer" {...props} />,
                strong: ({ node, ...props }) => <b style={{ color: "#ff4b17" }} {...props} />,
                span: ({ node, ...props }) => <span style={{ color: "white", backgroundColor: "pink" }} {...props} />,
                em: ({ node, ...props }) => <span style={{ color: "white", fontWeight: "bold" }} {...props} />,
                img: ({ node, ...props }) => <img className="mdImage" {...props} />,
                ul: ({ node, ...props }) => <ul style={{ marginTop: 0, marginBottom: 50, marginLeft: 20 }} {...props} />,
              }}
            />
          </ImageAndTextLeft>
        ) : null}

        {part5 !== undefined || "" ? (
          <ImageAndTextRight title={""} imagePath={img5} link={img5Link} altText="Service">
            <ReactMarkdown
              children={part5}
              components={{
                h3: ({ node, ...props }) => <h3 className={"mdTitle"} {...props} />,
                a: ({ node, ...props }) => <a className="link" target="_blank" rel="noopener noreferrer" {...props} />,
                strong: ({ node, ...props }) => <b style={{ color: "#ff4b17" }} {...props} />,
                span: ({ node, ...props }) => <span style={{ color: "white", backgroundColor: "pink" }} {...props} />,
                em: ({ node, ...props }) => <span style={{ color: "white", fontWeight: "bold" }} {...props} />,
                img: ({ node, ...props }) => <img className="mdImage" {...props} />,
                ul: ({ node, ...props }) => <ul style={{ marginTop: 0, marginBottom: 50, marginLeft: 20 }} {...props} />,
              }}
            />
          </ImageAndTextRight>
        ) : null}

        {part6 !== undefined || "" ? (
          <ImageAndTextLeft title={""} imagePath={img6} link={null} altText="Service">
            <ReactMarkdown
              children={part6}
              components={{
                h3: ({ node, ...props }) => <h3 className={"mdTitle"} {...props} />,
                a: ({ node, ...props }) => <a className="link" target="_blank" rel="noopener noreferrer" {...props} />,
                strong: ({ node, ...props }) => <b style={{ color: "#ff4b17" }} {...props} />,
                span: ({ node, ...props }) => <span style={{ color: "white", backgroundColor: "pink" }} {...props} />,
                em: ({ node, ...props }) => <span style={{ color: "white", fontWeight: "bold" }} {...props} />,
                img: ({ node, ...props }) => <img className="mdImage" {...props} />,
                ul: ({ node, ...props }) => <ul style={{ marginTop: 0, marginBottom: 50, marginLeft: 20 }} {...props} />,
              }}
            />
          </ImageAndTextLeft>
        ) : null}

        {part7 !== undefined || "" ? (
          <ImageAndTextRight title={""} imagePath="" link={null} altText="Service">
            <ReactMarkdown
              children={part7}
              components={{
                h3: ({ node, ...props }) => <h3 className={"mdTitle"} {...props} />,
                a: ({ node, ...props }) => <a className="link" target="_blank" rel="noopener noreferrer" {...props} />,
                strong: ({ node, ...props }) => <b style={{ color: "#ff4b17" }} {...props} />,
                span: ({ node, ...props }) => <span style={{ color: "white", backgroundColor: "pink" }} {...props} />,
                em: ({ node, ...props }) => <span style={{ color: "white", fontWeight: "bold" }} {...props} />,
                img: ({ node, ...props }) => <img className="mdImage" {...props} />,
                ul: ({ node, ...props }) => <ul style={{ marginTop: 0, marginBottom: 50, marginLeft: 20 }} {...props} />,
              }}
            />
          </ImageAndTextRight>
        ) : null}

        {part8 !== undefined || "" ? (
          <ImageAndTextLeft title={""} imagePath="" link={null} altText="Service">
            <ReactMarkdown
              children={part8}
              components={{
                h3: ({ node, ...props }) => <h3 className={"mdTitle"} {...props} />,
                a: ({ node, ...props }) => <a className="link" target="_blank" rel="noopener noreferrer" {...props} />,
                strong: ({ node, ...props }) => <b style={{ color: "#ff4b17" }} {...props} />,
                span: ({ node, ...props }) => <span style={{ color: "white", backgroundColor: "pink" }} {...props} />,
                em: ({ node, ...props }) => <span style={{ color: "white", fontWeight: "bold" }} {...props} />,
                img: ({ node, ...props }) => <img className="mdImage" {...props} />,
                ul: ({ node, ...props }) => <ul style={{ marginTop: 0, marginBottom: 50, marginLeft: 20 }} {...props} />,
              }}
            />
          </ImageAndTextLeft>
        ) : null}

        <Div className="container">{labels ? <ClickableImageGrid labels={labels} /> : null}</Div>
        <Div className="container">
          {documentaires ? <DocumentairesGallery labels={labels} documentaires={documentaires} /> : null}
        </Div>
        <ExpertiseSection
          imageSrc={imgFooter}
          altText="Service"
          title="En savoir plus sur mes expertises :"
          services={serviceExpertises}
        />
      </Layout>
    </>
  );
}

import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import Accordion from "../../components/Accordion";
import Button from "../../components/Button";
import Cta from "../../components/Cta";
import Div from "../../components/Div";
import IconBox from "../../components/IconBox";
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

export async function getStaticProps({ params }) {
  // Extraire l'identifiant de service à partir des paramètres de la route
  const { serviceId } = params;
  // Construire le chemin du fichier markdown basé sur l'identifiant
  const filePath = path.join(process.cwd(), "content", "expertises", "fr", `${serviceId}.md`);
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
      serviceId: params.serviceId,
      metaData,
    },
  };
}

export async function getStaticPaths() {
  const directory = path.join(process.cwd(), "content", "expertises", "fr");
  const filenames = fs.readdirSync(directory);

  const paths = filenames.map((filename) => ({
    params: { serviceId: path.parse(filename).name },
  }));

  return {
    paths,
    fallback: "blocking",
  };
}

export default function ServiceDetails({ markdownSections, serviceId, metaData }) {
  const router = useRouter();

  // Utiliser les métadonnées directement
  const { title, description, imgUrl, titlePart1, descPart1, titlePart2, descPart2, titlePart3, descPart3 } = metaData;

  // Utiliser les sections Markdown
  const title1 = markdownSections[0];
  const desc1 = markdownSections[1];
  const title2 = markdownSections[2];
  const desc2 = markdownSections[3];
  const title3 = markdownSections[4];
  const desc3 = markdownSections[5];

  return (
    <>
      <Head>
        <title>Service - {"test"}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <PageHeading title="Mes expertises" bgSrc="/images/service_hero_bg.jpeg" pageLinkText={serviceId} />
        <Spacing lg="145" md="80" />
        <Div className="container">
          <SectionHeading title={title} subtitle="Comprendre" variant="cs-style1 text-center" />
          <Spacing lg="90" md="45" />
          <Div className="row">
            <Div className="col-lg-4">
              <IconBox icon="/images/icons/service_icon_1.svg" title={titlePart1} subtitle={descPart1} />
              <Spacing lg="30" md="30" />
            </Div>
            <Div className="col-lg-4">
              <IconBox icon="/images/icons/service_icon_2.svg" title={titlePart2} subtitle={descPart2} />
              <Spacing lg="30" md="30" />
            </Div>
            <Div className="col-lg-4">
              <IconBox icon="/images/icons/service_icon_3.svg" title={titlePart3} subtitle={descPart3} />
              <Spacing lg="30" md="30" />
            </Div>
          </Div>
        </Div>

        <ImageAndTextRight title={title1} imagePath="/images/post_1.jpeg" altText="Service">
          <ReactMarkdown
            children={desc1}
            components={{
              h3: ({ node, ...props }) => <h3 className={"heading"} {...props} />,
              a: ({ node, ...props }) => <a className={"link"} {...props} />,
              p: ({ node, ...props }) => {
                // Vérifier si le texte du paragraphe commence par "=>"
                const children = React.Children.toArray(props.children);
                const firstChild = children[0];

                // Si le premier enfant est une chaîne et commence par "=>", appliquer le style
                if (typeof firstChild === "string" && firstChild.startsWith("=>")) {
                  // Appliquer un style personnalisé ou une classe CSS
                  return <p className={"subtitleMarkdown"} {...props} />;
                }

                // Si le premier enfant est un tableau, vérifier son premier élément
                if (Array.isArray(firstChild) && typeof firstChild[0] === "string" && firstChild[0].startsWith("=>")) {
                  // Appliquer un style personnalisé ou une classe CSS
                  return <p className={"subtitleMarkdown"} {...props} />;
                }

                // Sinon, retourner un paragraphe normal
                return <p {...props} />;
              },
            }}
          />
        </ImageAndTextRight>

        <ImageAndTextLeft title={title2} imagePath="/images/post_1.jpeg" altText="Service">
          <ReactMarkdown
            children={desc2}
            components={{
              h3: ({ node, ...props }) => <h3 className={"heading"} {...props} />,
              a: ({ node, ...props }) => <a className={"link"} {...props} />,
              p: ({ node, ...props }) => {
                // Vérifier si le texte du paragraphe commence par "=>"
                const children = React.Children.toArray(props.children);
                const firstChild = children[0];

                // Si le premier enfant est une chaîne et commence par "=>", appliquer le style
                if (typeof firstChild === "string" && firstChild.startsWith("=>")) {
                  // Appliquer un style personnalisé ou une classe CSS
                  return <p className={"subtitleMarkdown"} {...props} />;
                }

                // Si le premier enfant est un tableau, vérifier son premier élément
                if (Array.isArray(firstChild) && typeof firstChild[0] === "string" && firstChild[0].startsWith("=>")) {
                  // Appliquer un style personnalisé ou une classe CSS
                  return <p className={"subtitleMarkdown"} {...props} />;
                }

                // Sinon, retourner un paragraphe normal
                return <p {...props} />;
              },
            }}
          />
        </ImageAndTextLeft>

        <ImageAndTextRight title={title3} imagePath="/images/post_1.jpeg" altText="Service">
          <ReactMarkdown
            children={desc3}
            components={{
              h3: ({ node, ...props }) => <h3 className={"heading"} {...props} />,
              a: ({ node, ...props }) => <a className={"link"} {...props} />,
              p: ({ node, ...props }) => {
                // Vérifier si le texte du paragraphe commence par "=>"
                const children = React.Children.toArray(props.children);
                const firstChild = children[0];

                // Si le premier enfant est une chaîne et commence par "=>", appliquer le style
                if (typeof firstChild === "string" && firstChild.startsWith("=>")) {
                  // Appliquer un style personnalisé ou une classe CSS
                  return <p className={"subtitleMarkdown"} {...props} />;
                }

                // Si le premier enfant est un tableau, vérifier son premier élément
                if (Array.isArray(firstChild) && typeof firstChild[0] === "string" && firstChild[0].startsWith("=>")) {
                  // Appliquer un style personnalisé ou une classe CSS
                  return <p className={"subtitleMarkdown"} {...props} />;
                }

                // Sinon, retourner un paragraphe normal
                return <p {...props} />;
              },
            }}
          />
        </ImageAndTextRight>

        <Spacing lg="120" md="50" />

        <Div className="container">
          <Div className="row align-items-center">
            <Div className="col-xl-5 col-lg-6">
              <Div className="cs-radius_15 cs-shine_hover_1">
                <img src="/images/post_1.jpeg" alt="Service" className="cs-radius_15 w-100" />
              </Div>
              <Spacing lg="0" md="40" />
            </Div>
            <Div className="col-lg-6 offset-xl-1">
              <h2 className="cs-font_50 cs-m0">Nos services les plus demandés</h2>
              <Spacing lg="50" md="30" />
              <Div className="row">
                <Div className="col-lg-6">
                  <Button btnLink="/service/service-details" btnText="Gestion des licences" variant="cs-type2" />
                  <Spacing lg="20" md="10" />
                  <Button btnLink="/service/service-details" btnText="Audit des droits" variant="cs-type2" />
                  <Spacing lg="20" md="10" />
                </Div>
                <Div className="col-lg-6">
                  <Button btnLink="/service/service-details" btnText="Conseil en production" variant="cs-type2" />
                  <Spacing lg="20" md="10" />
                  <Button btnLink="/service/service-details" btnText="Obtention de subventions" variant="cs-type2" />
                  <Spacing lg="20" md="10" />
                </Div>
              </Div>
            </Div>
          </Div>
        </Div>
        <Spacing lg="150" md="80" />
        <TestimonialSlider />
        <Spacing lg="145" md="80" />
        <Div className="container cs-shape_wrap_4">
          <Div className="cs-shape_4"></Div>
          <Div className="cs-shape_4"></Div>
          <Div className="container">
            <Div className="row">
              <Div className="col-xl-5 col-lg-6">
                <SectionHeading title="Questions fréquentes" subtitle="FAQ" />
                <Spacing lg="90" md="45" />
              </Div>
              <Div className="col-lg-6 offset-xl-1">
                <Accordion />
              </Div>
            </Div>
          </Div>
        </Div>
        <Spacing lg="150" md="80" />
        <Div className="container">
          <Cta
            title="Discutons ensemble de votre <br />projet <i>créatif</i>"
            btnText="Prendre rendez-vous"
            btnLink="/contact"
            bgSrc="/images/cta_bg.jpeg"
          />
        </Div>
      </Layout>
    </>
  );
}
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
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

export default function ExpertiseDetails() {
  const router = useRouter();
  const [expertiseDetails, setExpertiseDetails] = useState(null);
  const expertiseId = router.query.expertiseId;

  useEffect(() => {
    const fetchExpertiseDetails = async () => {
      if (expertiseId) {
        try {
          const response = await fetch("/locales/fr/expertise.json");
          const data = await response.json();
          // Trouvez l'expertise correspondante par le slug
          const expertise = data.expertises.find((e) => e.slug === expertiseId);
          if (expertise) {
            setExpertiseDetails(expertise);
          } else {
            console.error("Expertise introuvable avec l'ID:", expertiseId);
          }
        } catch (error) {
          console.error("Erreur lors du chargement des détails de l'expertise", error);
        }
      }
    };

    fetchExpertiseDetails();
  }, [expertiseId]);

  // Gérer le cas où les données ne sont pas encore chargées
  if (!expertiseDetails) {
    return <div>Chargement...</div>;
  }

  return (
    <>
      <Head>
        <title>Expertise - {expertiseDetails.title}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <PageHeading title="Détails expertise" bgSrc="/images/service_hero_bg.jpeg" pageLinkText={expertiseId} />
        <Spacing lg="145" md="80" />
        <Div className="container">
          <SectionHeading
            title="Processus de gestion des droits"
            subtitle="Gestion des Droits d'Auteur"
            variant="cs-style1 text-center"
          />
          <Spacing lg="90" md="45" />
          <Div className="row">
            <Div className="col-lg-4">
              <IconBox
                icon="/images/icons/service_icon_1.svg"
                title="Identification"
                subtitle="Identification des œuvres et des ayants droit, suivi des licences et des contrats."
              />
              <Spacing lg="30" md="30" />
            </Div>
            <Div className="col-lg-4">
              <IconBox
                icon="/images/icons/service_icon_2.svg"
                title="Monétisation"
                subtitle="Stratégies pour maximiser les revenus générés par les droits d'auteur."
              />
              <Spacing lg="30" md="30" />
            </Div>
            <Div className="col-lg-4">
              <IconBox
                icon="/images/icons/service_icon_3.svg"
                title="Protection"
                subtitle="Mise en place de mesures pour protéger les œuvres et les droits d'auteur."
              />
              <Spacing lg="30" md="30" />
            </Div>
          </Div>
        </Div>

        {/* part 1 */}
        <Div className="container">
          <Div className="row align-items-center">
            <Div className="col-xl-5 col-lg-6">
              <Div className="cs-radius_15 cs-shine_hover_1">
                <img src="/images/service_img_1.jpeg" alt="Expertise" className="cs-radius_15 w-100" />
              </Div>
              <Spacing lg="0" md="40" />
            </Div>
            <Div className="col-lg-6 offset-xl-1">
              <h1 className="cs-font_50 cs-m0">Gérer les droits d’auteur</h1>
              <p>
                Dans la musique, le terme 'auteur' désigne l'individu qui rédige les paroles d'une chanson, tandis que
                'compositeur' fait est à celui qui en compose la musique. Ces deux acteurs jouissent de droits de propriété
                équivalents sur leurs créations, d'où le terme d’"auteur-compositeur". En réalité, cela peut désigner deux
                personnes différentes. Cependant, il se peut qu'une seule et même personne remplisse ces deux rôles, assumant
                ainsi simultanément le rôle d'auteur et de compositeur. De plus, nous distinguons les compositions musicales sans
                parole, dans lesquelles seuls les compositeurs interviennent.
                <br />
                <br />
                Qu’il s’agisse d’un auteur, d’un compositeur ou d’un auteur-compositeur, l’œuvre produite est protégée par les
                DROITS D’AUTEUR. Cela implique que l'auteur est le propriétaire du texte qu'il a écrit et que le compositeur a la
                propriété de la musique qu'il a composée. Ils ont le droit d'autoriser ou d'interdire l'exploitation de leur
                œuvre, et ce, contre une compensation financière. Concrètement, cela signifie que toute utilisation de l'œuvre
                (soit le texte, soit la musique), nécessite une autorisation préalable de l’auteur-compositeur, accompagnée du
                versement de redevances. Il est important de souligner que l’auteur-compositeur a droit à une protection légale
                dès l’instant de la création de son œuvre. Les formalités de déclaration auprès de la SACEM s’avèrent nécessaires
                uniquement pour obtenir une preuve légale de la priorité de création.
                <br />
                <br />
                L'éditeur musical représente un partenaire essentiel pour l’auteur-compositeur. Il a pour rôle d'aider ces
                derniers à exploiter leurs œuvres pour développer leur carrière. Ainsi, l'éditeur cherchera toutes opportunités
                possibles pour promouvoir et diffuser l'œuvre musicale en question (paroles et musique, ensemble ou séparément).
              </p>
              <Spacing lg="50" md="30" />
            </Div>
          </Div>
        </Div>
        {/* fin part 1 */}
        <Spacing lg="120" md="50" />
        <Div className="container">
          <Div className="row align-items-center">
            <Div className="col-xl-5 col-lg-6">
              <Div className="cs-radius_15 cs-shine_hover_1">
                <img src="/images/service_img_1.jpeg" alt="Expertise" className="cs-radius_15 w-100" />
              </Div>
              <Spacing lg="0" md="40" />
            </Div>
            <Div className="col-lg-6 offset-xl-1">
              <h2 className="cs-font_50 cs-m0">Nos services les plus demandés</h2>
              <Spacing lg="50" md="30" />
              <Div className="row">
                <Div className="col-lg-6">
                  <Button btnLink="/expertise/service-details" btnText="Gestion des licences" variant="cs-type2" />
                  <Spacing lg="20" md="10" />
                  <Button btnLink="/expertise/service-details" btnText="Audit des droits" variant="cs-type2" />
                  <Spacing lg="20" md="10" />
                </Div>
                <Div className="col-lg-6">
                  <Button btnLink="/expertise/service-details" btnText="Conseil en production" variant="cs-type2" />
                  <Spacing lg="20" md="10" />
                  <Button btnLink="/expertise/service-details" btnText="Obtention de subventions" variant="cs-type2" />
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
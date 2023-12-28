import Head from "next/head";
import React from "react";
import Layout from "../components/Layout";
import PageHeading from "../components/PageHeading";

export default function PolitiqueConfidentialite() {
  return (
    <>
      <Head>
        <title>Confidentialité</title>
        <meta name={"description"} content={"En savoir plus sur la politique de confidentialité"} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <PageHeading title="Confidentialité" bgSrc="images/about_hero_bg.jpeg" pageLinkText="Politique de confidentialité" />
        <section className="col-lg-8 m-auto mt-5">
          <div>
            <h1>Politique de confidentialité</h1>
            <br />
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD), ce portfolio s'engage à respecter la
              confidentialité de vos informations personnelles. Cette politique décrit nos engagements et directives concernant la
              protection de vos Données Personnelles lorsque vous utilisez ce portfolio.
            </p>
          </div>
          <h4>
            <br />
            Responsabilité du traitement
          </h4>
          <p>
            En tant que copyright manager et production manager, je suis responsable du traitement de vos données. Ce portfolio a
            pour but de faciliter les échanges professionnels et de présenter mes compétences et réalisations dans le secteur.
          </p>
          <h4>Objectif du traitement</h4>
          <p>
            Ce portfolio a pour objectif de promouvoir mes services professionnels et d'informer les visiteurs sur mes
            compétences, réalisations et actualités.
          </p>
          <ul>
            <li>La gestion et l'envoi de messages via le formulaire de contact.</li>
          </ul>
          <p>
            Pour améliorer votre expérience sur ce portfolio et réaliser des statistiques de visite, des cookies sont utilisés.
            Vous pouvez consulter notre politique de cookies pour plus d'informations.
          </p>
          <h4>Fondement juridique du traitement des données</h4>
          <p>
            La base légale pour le traitement de vos données personnelles est votre consentement, symbolisé par une case à cocher
            à la fin des formulaires ou un bouton « accepter » pour les cookies.
          </p>
          <h4>Données personnelles traitées</h4>
          <p>Les données personnelles susceptibles d'être traitées incluent :</p>
          <ul>
            <li>Informations de contact (Nom, Adresse Mail) si vous utilisez le formulaire de contact ;</li>
            <li>Données de connexion (Adresse IP) ;</li>
            <li>Données relatives à la navigation sur le portfolio.</li>
          </ul>
          <h4>Durée de conservation des données</h4>
          <p>
            Les données personnelles sont conservées pour une durée conforme aux obligations légales ou proportionnelle aux
            finalités pour lesquelles elles ont été enregistrées.
          </p>
          <h4>Vos droits en vertu de la législation européenne sur la protection des données</h4>
          <p>
            Vous pouvez exercer plusieurs droits conformément à la législation européenne sur la protection des données, notamment
            le droit d'accès, de rectification, et d'effacement de vos données.
          </p>
          <p>
            Pour toutes les demandes concernant l'exercice de vos droits, vous pouvez me contacter à l'adresse suivante : [Votre
            adresse email]
          </p>
          <h4>Modifications du document</h4>
          <p>Ce document est sujet à des modifications.</p>
          <br />
        </section>
      </Layout>
    </>
  );
}

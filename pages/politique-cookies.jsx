import Head from "next/head";
import React from "react";
import Layout from "../components/Layout";
import PageHeading from "../components/PageHeading";

export default function PolitiqueConfidentialite() {
  return (
    <>
      <Head>
        <title>Politique de cookies</title>
        <meta name={"description"} content={"En savoir plus sur la politique de cookies"} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <PageHeading title="Cookies" bgSrc="images/about_hero_bg.jpeg" pageLinkText="Politique de cookies" />
        <section className="col-lg-8 m-auto mt-5">
          <div>
            <h1>Politique de Cookies</h1>
          </div>
          <p>
            Ce portfolio utilise des cookies pour améliorer votre expérience utilisateur et collecter des données à des fins
            analytiques.
          </p>
          <h4>1. Qu'est-ce qu'un cookie ?</h4>
          <p>
            Un cookie est un petit fichier texte stocké sur votre ordinateur lors de la visite d'un site web. Ce fichier
            enregistre des informations qui peuvent être lues par le site lors de vos visites ultérieures.
          </p>
          <h4>2. Types de cookies utilisés</h4>
          <p>
            <strong>Cookies de session</strong>: Ces cookies sont temporaires et sont supprimés lorsque vous fermez votre
            navigateur.
          </p>
          <p>
            <strong>Cookies analytiques</strong>: Ces cookies permettent de collecter des données sur l'utilisation du site,
            telles que les pages visitées, le temps passé, etc.
          </p>
          <h4>3. Gestion des cookies</h4>
          <p>
            Vous pouvez configurer votre navigateur pour accepter ou refuser les cookies. Notez que le refus des cookies peut
            affecter la fonctionnalité du site.
          </p>
          <h4>4. Consentement</h4>
          <p>En utilisant ce portfolio, vous consentez à l'utilisation de cookies conformément à cette politique de cookies.</p>
          <h4>5. Contact</h4>
          <p>
            Pour toute question concernant cette politique de cookies, vous pouvez me contacter à caroline.senyk@parigomusic.com
          </p>
        </section>
      </Layout>
    </>
  );
}

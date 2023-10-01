import Head from 'next/head';
import React from 'react';
import Cta from '../../components/Cta';
import Div from '../../components/Div';
import Layout from '../../components/Layout';
import PageHeading from '../../components/PageHeading';
import Pagination from '../../components/Pagination';
import PostStyle2 from '../../components/Post/PostStyle2';
import Sidebar from '../../components/Sidebar.jsx';
import Spacing from '../../components/Spacing';

export default function Blog() {
  const postData = [
    {
      thumb: '/images/post_4.jpeg',
      title: 'Gestion des droits d’auteur à l’ère du numérique',
      subtitle:
        'La gestion des droits d’auteur est devenue de plus en plus complexe avec l’avènement du numérique. Découvrez comment naviguer dans ce nouvel environnement.',
      date: '07 Mar 2022',
      category: 'Droit d’auteur',
      categoryHref: '/blog',
      href: '/blog/blog-details',
    },
    {
      thumb: '/images/post_5.jpeg',
      title: 'Comment optimiser la production de contenu',
      subtitle:
        'La production de contenu est un élément clé de toute stratégie de marketing. Apprenez comment optimiser vos processus pour une meilleure efficacité.',
      date: '05 Mar 2022',
      category: 'Production',
      categoryHref: '/blog',
      href: '/blog/blog-details',
    },
    {
      thumb: '/images/post_6.jpeg',
      title: 'Les défis de la gestion de projet en production',
      subtitle:
        'La gestion de projet en production présente son propre ensemble de défis. Voici quelques conseils pour les surmonter.',
      date: '04 Mar 2022',
      category: 'Gestion de Projet',
      categoryHref: '/blog',
      href: '/blog/blog-details',
    },
  ];
  return (
    <>
      <Head>
        <title>Blog sur la Gestion des Droits et la Production</title>
        <meta name="description" content="Découvrez les dernières tendances et conseils en gestion des droits et production." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <PageHeading
          title="Articles"
          bgSrc="/images/blog_hero_bg.jpeg"
          pageLinkText="Blog"
        />
        <Spacing lg="150" md="80" />
        <Div className="container">
          <Div className="row">
            <Div className="col-lg-8">
              {postData.map((item, index) => (
                <Div key={index}>
                  <PostStyle2
                    thumb={item.thumb}
                    title={item.title}
                    subtitle={item.subtitle}
                    date={item.date}
                    category={item.category}
                    categoryHref={item.categoryHref}
                    href={item.href}
                  />
                  {postData.length > index + 1 && <Spacing lg="95" md="60" />}
                </Div>
              ))}
              <Spacing lg="60" md="40" />
              <Pagination />
            </Div>
            <Div className="col-xl-3 col-lg-4 offset-xl-1">
              <Spacing lg="0" md="80" />
              <Sidebar />
            </Div>
          </Div>
        </Div>
        <Spacing lg="150" md="80" />
        <Div className="container">
          <Cta
            title="Discutons et créons <br />quelque chose de <i>génial</i> ensemble"
            btnText="Contact"
            btnLink="/contact"
            bgSrc="/images/cta_bg.jpeg"
          />
        </Div>
      </Layout>
    </>
  );
}
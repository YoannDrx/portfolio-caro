import Head from "next/head";

const Seo = ({ pageTitle }) => (
  <>
    <Head>
      <title>
        {pageTitle &&
          `${pageTitle} || Bostami - Tailwind CSS  Personal Portfolio React Nextjs Template}`}
      </title>
    </Head>
  </>
);

export default Seo;

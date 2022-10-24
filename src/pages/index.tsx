const SitecorePage = (): JSX.Element => {
  return (
    <div>
      <h1>JSS test without SSR/ISR</h1>
    </div>
  );
};

// This function gets called at build and export time to determine
// pages for SSG ("paths", as tokenized array).
// export const getStaticPaths: GetStaticPaths = async () => {
//   // Fallback, along with revalidate in getStaticProps (below),
//   // enables Incremental Static Regeneration. This allows us to
//   // leave certain (or all) paths empty if desired and static pages
//   // will be generated on request (development mode in this example).
//   // Alternatively, the entire sitemap could be pre-rendered
//   // ahead of time (non-development mode in this example).
//   // See https://nextjs.org/docs/basic-features/data-fetching#incremental-static-regeneration

//   if (process.env.NODE_ENV !== 'development') {
//     // Note: Next.js runs export in production mode
//     // const paths = await sitemapFetcher.fetch(context);

//     return {
//       paths: [],
//       fallback: process.env.EXPORT_MODE ? false : 'blocking',
//     };
//   }

//   return {
//     paths: [],
//     fallback: true,
//   };
// };

// // This function gets called at build time on server-side.
// // It may be called again, on a serverless function, if
// // revalidation (or fallback) is enabled and a new request comes in.
// export const getStaticProps: GetStaticProps = async (context) => {
//   const props = await sitecorePagePropsFactory.create(context);

//   return {
//     props,
//     // Next.js will attempt to re-generate the page:
//     // - When a request comes in
//     // - At most once every 5 seconds
//     revalidate: 5, // In seconds
//     notFound: props.notFound, // Returns custom 404 page with a status code of 404 when true
//   };
// };

export default SitecorePage;

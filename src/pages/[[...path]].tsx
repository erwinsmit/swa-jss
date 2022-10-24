import { useEffect } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import NotFound from 'src/NotFound';
import Layout from 'src/Layout';
import {
  RenderingType,
  SitecoreContext,
  ComponentPropsContext,
  handleEditorFastRefresh,
  EditingComponentPlaceholder,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { SitecorePageProps } from 'lib/page-props';
// import { sitecorePagePropsFactory } from 'lib/page-props-factory';
// different componentFactory method will be used based on whether page is being edited
import { componentFactory, editingComponentFactory } from 'temp/componentFactory';

const SitecorePage = ({ notFound, componentProps, layoutData }: SitecorePageProps): JSX.Element => {
  useEffect(() => {
    // Since Sitecore editors do not support Fast Refresh, need to refresh editor chromes after Fast Refresh finished
    handleEditorFastRefresh();
  }, []);

  if (notFound || !layoutData?.sitecore.route) {
    // Shouldn't hit this (as long as 'notFound' is being returned below), but just to be safe
    return <NotFound />;
  }

  const isEditing = layoutData.sitecore.context.pageEditing;
  const isComponentRendering =
    layoutData.sitecore.context.renderingType === RenderingType.Component;

  return (
    <ComponentPropsContext value={componentProps}>
      <SitecoreContext
        componentFactory={isEditing ? editingComponentFactory : componentFactory}
        layoutData={layoutData}
      >
        {/*
          Sitecore Pages supports component rendering to avoid refreshing the entire page during component editing.
          If you are using Experience Editor only, this logic can be removed, Layout can be left.
        */}
        {isComponentRendering ? (
          <EditingComponentPlaceholder rendering={layoutData.sitecore.route} />
        ) : (
          <Layout layoutData={layoutData} />
        )}
      </SitecoreContext>
    </ComponentPropsContext>
  );
};

// This function gets called at build and export time to determine
// pages for SSG ("paths", as tokenized array).
export const getStaticPaths: GetStaticPaths = async () => {
  // Fallback, along with revalidate in getStaticProps (below),
  // enables Incremental Static Regeneration. This allows us to
  // leave certain (or all) paths empty if desired and static pages
  // will be generated on request (development mode in this example).
  // Alternatively, the entire sitemap could be pre-rendered
  // ahead of time (non-development mode in this example).
  // See https://nextjs.org/docs/basic-features/data-fetching#incremental-static-regeneration

  if (process.env.NODE_ENV !== 'development') {
    // Note: Next.js runs export in production mode
    // const paths = await sitemapFetcher.fetch(context);

    return {
      paths: [],
      fallback: 'blocking',
    };
  }

  return {
    paths: [],
    fallback: true,
  };
};

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation (or fallback) is enabled and a new request comes in.
export const getStaticProps: GetStaticProps = async () => {
  // const props = await sitecorePagePropsFactory.create(context);
  // console.log('getStaticProps', JSON.stringify(props));

  const props = {
    locale: 'en',
    layoutData: {
      sitecore: {
        context: {
          pageEditing: false,
          site: { name: 'jss-nextjs-app' },
          pageState: 'normal',
          language: 'en',
          itemPath: '/',
        },
        route: {
          name: 'home',
          displayName: 'home',
          fields: { pageTitle: { value: 'Sitecore JSS @ Azure' } },
          databaseName: 'master',
          deviceId: 'fe5d7fdf-89c0-4d99-9aa3-b5fbd009c9f3',
          itemId: '9f1a55c0-ad8b-51e4-8064-6e427bf80000',
          itemLanguage: 'en',
          itemVersion: 1,
          layoutId: 'bd8dcbaf-957d-545f-9178-40d0edd062c7',
          templateId: 'a6d9e332-0bb7-5bf9-adb8-b334a09e7c44',
          templateName: 'App Route',
          placeholders: {
            'jss-header': [
              {
                uid: 'f913eca5-820f-5195-85e8-491c608b953f',
                componentName: 'Navigation',
                dataSource: '',
                fields: {
                  data: {
                    item: {
                      language: { displayName: 'English : English' },
                      children: {
                        results: [
                          {
                            url: { path: '/Page-Components' },
                            id: 'D06CFF27FF1D5381A03F87995F510783',
                            children: { results: [] },
                          },
                          {
                            pageTitle: { value: 'FAQ' },
                            url: { path: '/faq' },
                            id: '18C4DB50A4E8500D9D4B28BFEF9D659D',
                            children: { results: [] },
                          },
                          {
                            pageTitle: { value: 'GraphQL' },
                            url: { path: '/graphql' },
                            id: '167BD5A4E515584CB0BFA4570A5FF9AD',
                            children: { results: [] },
                          },
                          {
                            pageTitle: { value: 'Ordercloud' },
                            url: { path: '/ordercloud' },
                            id: '56FC088FDF735980ABAF56C52F7FC6FB',
                            children: { results: [] },
                          },
                        ],
                      },
                    },
                  },
                },
              },
            ],
            'jss-main': [
              {
                uid: '2c4a53cc-9da8-5f51-9d79-6ee2fc671b2d',
                componentName: 'ContentBlock',
                dataSource: '{792F1DB5-32BB-59A8-A2B6-40BA13CE33F1}',
                fields: {
                  heading: { value: 'Welcome!' },
                  content: {
                    value:
                      '<p>On this Sitecore JSS website hosted on azure functions. All websites need a carousel right? Easy way for filling up a homepage</p>',
                  },
                },
              },
              {
                uid: 'a81bd2ab-2e6c-5221-8a04-bd1c4ac02aa9',
                componentName: 'Carousel',
                dataSource: '',
                placeholders: {
                  'carousel-items': [
                    {
                      uid: 'e0dc1351-1721-54ff-859e-56905b46afd0',
                      componentName: 'CarouselItem',
                      dataSource: '{EDF76D2D-05E7-57D9-9FFC-047CAD60D693}',
                      fields: {
                        heading: { value: 'Carousel item 1' },
                        image: {
                          value: {
                            src: 'https://dev-mi-paas-xm110-rg-118130-single.azurewebsites.net/-/media/jss-nextjs-app/data/media/img/laptop1.ashx?h=500&iar=0&w=700&hash=FF39B6BA8E38D46008387D4469A92B39',
                            alt: 'Laptop 1',
                            width: '700',
                            height: '500',
                          },
                        },
                      },
                    },
                    {
                      uid: '3e9dc780-42e8-5d97-9723-2f0534306ada',
                      componentName: 'CarouselItem',
                      dataSource: '{0251A3BE-0B57-55FC-99CD-18E0D3D2089B}',
                      fields: {
                        heading: { value: 'Carousel item 2' },
                        image: {
                          value: {
                            src: 'https://dev-mi-paas-xm110-rg-118130-single.azurewebsites.net/-/media/jss-nextjs-app/data/media/img/laptop2.ashx?h=500&iar=0&w=700&hash=3A3FB9F5C5036D7A96AE4823A8399274',
                            alt: 'Laptop 2',
                            width: '700',
                            height: '500',
                          },
                        },
                      },
                    },
                    {
                      uid: '8034ed41-fdfa-52d8-92d8-69c37c6b363a',
                      componentName: 'CarouselItem',
                      dataSource: '{1E46E766-A597-51DA-B9D9-7F939E261DD6}',
                      fields: {
                        heading: { value: 'Carousel item 3' },
                        image: {
                          value: {
                            src: 'https://dev-mi-paas-xm110-rg-118130-single.azurewebsites.net/-/media/jss-nextjs-app/data/media/img/laptop3.ashx?h=500&iar=0&w=700&hash=1E35F9EC21756889C7A95D92C3ACBEB6',
                            alt: 'Laptop 3',
                            width: '700',
                            height: '500',
                          },
                        },
                      },
                    },
                  ],
                },
              },
              {
                uid: '3e3e521a-0a97-5057-9311-21bd2935338d',
                componentName: 'ContentBlock',
                dataSource: '{634323DF-AE06-5B7A-AA8B-4E56B07D918C}',
                fields: {
                  heading: { value: 'Three column grid with teasers' },
                  content: { value: '' },
                },
              },
              {
                uid: '41f94770-559f-5a7b-a418-de1b9fa87919',
                componentName: 'ThreeColumns',
                dataSource: '',
                params: { theme: 'primary' },
                placeholders: {
                  col1: [
                    {
                      uid: '82a95f26-0465-5895-8915-ee23905e7de1',
                      componentName: 'Teaser',
                      dataSource: '{AA970407-9F58-5674-9DBA-AA380D7E89E6}',
                      fields: {
                        heading: { value: 'Teaser 1' },
                        description: {
                          value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
                        },
                        image: {
                          value: {
                            src: 'https://dev-mi-paas-xm110-rg-118130-single.azurewebsites.net/-/media/jss-nextjs-app/data/media/img/macbook.ashx?h=400&iar=0&w=500&hash=9E28A861C28AB27D85891E74A6706BF2',
                            alt: 'Macbook',
                            width: '500',
                            height: '400',
                          },
                        },
                      },
                    },
                  ],
                  col2: [
                    {
                      uid: 'cadabf12-7324-5428-9191-fca354adab66',
                      componentName: 'Teaser',
                      dataSource: '{3992A5AC-B60B-5DD3-8F6E-E1DF6F03B2B4}',
                      fields: {
                        heading: { value: 'Teaser 2' },
                        description: {
                          value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
                        },
                        image: {
                          value: {
                            src: 'https://dev-mi-paas-xm110-rg-118130-single.azurewebsites.net/-/media/jss-nextjs-app/data/media/img/macbook.ashx?h=400&iar=0&w=500&hash=9E28A861C28AB27D85891E74A6706BF2',
                            alt: 'Macbook',
                            width: '500',
                            height: '400',
                          },
                        },
                      },
                    },
                  ],
                  col3: [
                    {
                      uid: 'adf5fd31-29a1-5290-80c2-a56dcd4618c6',
                      componentName: 'Teaser',
                      dataSource: '{7030A684-086F-5695-B05B-3A4FC78D4DFC}',
                      fields: {
                        heading: { value: 'Teaser 3' },
                        description: {
                          value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
                        },
                        image: {
                          value: {
                            src: 'https://dev-mi-paas-xm110-rg-118130-single.azurewebsites.net/-/media/jss-nextjs-app/data/media/img/macbook.ashx?h=400&iar=0&w=500&hash=9E28A861C28AB27D85891E74A6706BF2',
                            alt: 'Macbook',
                            width: '500',
                            height: '400',
                          },
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    },
    dictionary: {
      Documentation: 'Documentation',
      GraphQL: 'GraphQL',
      Styleguide: 'Styleguide',
      'styleguide-sample': 'This is a dictionary entry in English as a demonstration',
    },
    componentProps: {},
  };

  return {
    props,
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 5 seconds
    revalidate: 5, // In seconds
    notFound: false, // Returns custom 404 page with a status code of 404 when true
  };
};

export default SitecorePage;

import { useEffect } from 'react';
import { GetServerSideProps } from 'next';
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
import { sitecorePagePropsFactory } from 'lib/page-props-factory';
// different componentFactory method will be used based on whether page is being edited
import { componentFactory, editingComponentFactory } from 'temp/componentFactory';

const SitecorePage = ({ notFound, componentProps, layoutData }: SitecorePageProps): JSX.Element => {
  useEffect(() => {
    // Since Sitecore editors do not support Fast Refresh, need to refresh editor chromes after Fast Refresh finished
    handleEditorFastRefresh();
  }, []);

  if (notFound || !layoutData.sitecore.route) {
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

// This function gets called at request time on server-side.
export const getServerSideProps: GetServerSideProps = async (context) => {
  const props = await sitecorePagePropsFactory.create(context);

  // Check if we have a redirect (e.g. custom error page)
  if (props.redirect) {
    return {
      redirect: props.redirect,
    };
  }

  return {
    props,
    notFound: props.notFound, // Returns custom 404 page with a status code of 404 when true
  };
};

export default SitecorePage;

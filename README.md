# Sitecore JSS Next.js that can deploy to Azure Static Web Apps
This repo has some changes to the original Sitecore JSS Next.js that allow it to be deployed to Azure Static Web Apps.

![Blob storage editing cache](https://www.erwinsmit.com/static/57715677ddc24328f7ffb5132cc1efed/05649/new-architecture.png)

Azure Static Web App now supports Next.js fully (With ISR/SSG), but some changes are necessary to the original JSS Next.js code to make it work.

The changes are done in the following files
- [src/lib/page-props-factory/plugins/preview-mode.ts](src/lib/page-props-factory/plugins/preview-mode.ts)
- [src/pages/api/editing/render.ts](src/pages/api/editing/render.ts)
- [src/pages/api/editing/data/[key.ts]](src/pages/api/editing/data/%5Bkey%5D.ts)

The above files use a custom EditingDataCache. The files required for this custom EditingDataCache are all saved in the [src/lib/editing]('lib/editing')

Everything else is the same as the official JSS Next.js SDK.

For this solution to work you'll need to provide create an Azure Storage Account with a pre-configured Blob Container. To allow the connection, create an .env file and set the values **AZURE_STORAGE_CONNECTION_STRING** & **AZURE_BLOB_CONTAINER* Accordingly**. 

For more information, please refer to my [blogpost](https://www.erwinsmit.com/sitecore-jss-nextjs-on-azure-static-web-app/)

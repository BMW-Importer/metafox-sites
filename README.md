# Your Project's Title...
Your project's description...

## Environments
- Preview: https://main--{repo}--{owner}.hlx.page/
- Live: https://main--{repo}--{owner}.hlx.live/

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Local development

1. Create a new repository based on the `aem-boilerplate` template and add a mountpoint in the `fstab.yaml`
1. Add the [AEM Code Sync GitHub App](https://github.com/apps/aem-code-sync) to the repository
1. Install the [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
1. Start AEM Proxy: `aem up` (opens your browser at `http://localhost:3000`)
1. Open the `{repo}` directory in your favorite IDE and start coding :)

## AEM Importer

This project uses the work-in-progress AEM importer that supports to create JCR packages. 

### Setup

1. Create the `tools/importer` folder if it does not exist yet:
   ```
   mkdir -p tools/importer
   cd tools/importer
   ```
2. Clone the importer UI into that folder, checkout the `html2jcr` branch, install the importer core and build it:
   ```
   git clone git@github.com:mhaack/helix-importer-ui.git
   cd helix-importer-ui
   git checkout html2jcr
   npm i github:mhaack/helix-importer#html2jcr
   npm run build 
   ```
3. Go back into the root of the project and run the importer
   ```
   cd ../../../
   aem import --ui-repo https://github.com/mhaack/helix-importer-ui
   ```

### Usage

- Create a file with your import rules in `tools/importer/import.js`
- Open https://localhost:3001 in you browser
- In the UI, expand the Import Options
- Deselect save as docx and select save as jcr instead
- Provide a site name

The importer will create a package with the root path set to `/content/<site-name>`. Pages installed into it can be copied to the right place. To preview the imported pages you have to configure the Context Aware Configuration path on the imported site's root page.

import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '2it7abok',
    dataset: 'production'
  },
  deployment: {
    /**
     * Auto-updates are disabled because they pulled an incompatible @sanity/cli
     * (6.7.2) that broke `sanity dev` ("Cannot find renderDocument.worker.js").
     * Sanity/runtime versions are pinned in package.json instead.
     */
    autoUpdates: false,
  }
})

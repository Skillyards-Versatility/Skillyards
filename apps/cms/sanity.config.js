import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {codeInput} from '@sanity/code-input'

const singleton = (S, typeName, title, documentId) =>
  S.listItem()
    .title(title)
    .id(documentId)
    .child(
      S.document()
        .schemaType(typeName)
        .documentId(documentId)
    )

export default defineConfig({
  name: 'default',
  title: 'skillyards-cms',

  projectId: '2it7abok',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            singleton(S, 'siteSettings', 'Site Settings', 'siteSettings'),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (listItem) => listItem.getId() !== 'siteSettings'
            ),
          ]),
    }),
    visionTool(),
    codeInput(),
  ],

  schema: {
    types: schemaTypes,
  },

  vite: (config) => {
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        'styled-components': 'styled-components/dist/styled-components.browser.esm.js',
      },
    }
    return config
  },
})
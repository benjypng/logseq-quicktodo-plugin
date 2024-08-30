import '@logseq/libs'

import { createRoot } from 'react-dom/client'

import { QuickTodo } from './features/quick-todo'
import { handlePopup } from './handle-popup'
import { settings } from './settings'

const main = () => {
  console.log('logseq-quicktodo-plugin loaded')

  handlePopup()

  const el = document.getElementById('app')
  if (!el) return
  const root = createRoot(el)

  logseq.App.registerCommandPalette(
    {
      key: 'logseq-quicktodo-plugin',
      label: "Quick todo to today's journal page",
      keybinding: {
        binding: 'm t',
      },
    },
    async () => {
      root.render(<QuickTodo />)
      logseq.showMainUI()
    },
  )

  // Convert block to todo
  // logseq.App.registerCommandPalette(
  //   {
  //     key: 'convert-todo',
  //     label: 'Convert block to TODO',
  //     keybinding: {
  //       binding: 'mod+t',
  //       mode: 'global',
  //     },
  //   },
  //   async (e: any) => {
  //     const content = await logseq.Editor.getEditingBlockContent()
  //     await logseq.Editor.updateBlock(
  //       e.uuid,
  //       `TODO **${getDateForPage(
  //         new Date(),
  //         logseq.settings!.preferredDateFormat,
  //       )}** ${content}`,
  //     )
  //   },
  // )
}

logseq.useSettingsSchema(settings).ready(main).catch(console.error)

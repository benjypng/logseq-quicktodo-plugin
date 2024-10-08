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
}

logseq.useSettingsSchema(settings).ready(main).catch(console.error)

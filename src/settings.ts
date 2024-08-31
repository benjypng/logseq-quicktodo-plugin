import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user'

export const settings: SettingSchemaDesc[] = [
  {
    key: 'appendTodo',
    type: 'boolean',
    title: 'Append TODO By Default',
    description:
      'When indicated, all inserted items will be TODOs. You can also change this when inserting an item.',
    default: true,
  },
  {
    key: 'defaultPage',
    type: 'string',
    description:
      "Default page to send tasks or items to. If left blank, it will be sent to today's journal page.",
    title: 'Default Page',
    default: '',
  },
  {
    key: 'defaultBlock',
    type: 'string',
    description:
      'Default block in the Daily Notes Page to send tasks or items to. This block must exist or the item will be added to the bottom of the page. If more than one block of the same name exists, there will be an error message.',
    title: 'Default Block',
    default: '',
  },
]

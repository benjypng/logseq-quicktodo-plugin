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
    key: 'appendSource',
    type: 'boolean',
    title: 'Append Source By Default',
    description:
      'When indicated, all inserted items will indicate which page you are at when you inserted the item. You can also change this when inserting an item.',
    default: false,
  },
  {
    key: 'defaultLocation',
    type: 'string',
    title: 'Default Location',
    description:
      "Default page or block to send items to. If left blank, it will be sent to today's journal page. If a page name is indicated (e.g. Inbox), it will be sent to that. If a block UUID is indicated (include open and closing parantheses, e.g. ((66d288d1-dc32-481e-b0a5-c7bc649e1dd2)) ), it will be appended to the block.",
    default: '',
  },
]

import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";

export const callSettings = () => {
  const settings: SettingSchemaDesc[] = [
    {
      key: "defaultPage",
      type: "string",
      default: "",
      description:
        "Default page to send tasks or items to. If left blank, it will be sent to today's journal page.",
      title: "Default Page",
    },
    {
      key: "defaultBlock",
      type: "string",
      default: "",
      description:
        "Default block in the Daily Notes Page to send tasks or items to. This block must exist or the item will be added to the bottom of the page. If more than one block of the same name exists, there will be an error message.",
      title: "Default Block",
    },
  ];
  logseq.useSettingsSchema(settings);
};

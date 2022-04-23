import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";

export const callSettings = () => {
  const settings: SettingSchemaDesc[] = [
    {
      key: "defaultPage",
      type: "string",
      default: "",
      description:
        "Default page to send tasks to. If left blank, it will be sent to today's journal page.",
      title: "Default page",
    },
  ];

  logseq.useSettingsSchema(settings);
};

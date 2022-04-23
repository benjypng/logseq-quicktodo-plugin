import "@logseq/libs";
import { BlockEntity } from "@logseq/libs/dist/LSPlugin";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { callSettings } from "./callSettings";
import { handleClosePopup } from "./handleClosePopup";

const main = () => {
  console.log("logseq-quicktodo-plugin loaded");

  handleClosePopup();

  callSettings();

  // Get preferred date format
  window.setTimeout(async () => {
    const userConfigs = await logseq.App.getUserConfigs();
    const preferredDateFormat: string = userConfigs.preferredDateFormat;
    const preferredWorkflow: string = userConfigs.preferredWorkflow;
    logseq.updateSettings({
      preferredDateFormat: preferredDateFormat,
      preferredWorkflow: preferredWorkflow,
    });

    if (!logseq.settings.appendTodo) {
      logseq.updateSettings({
        appendTodo: true,
      });
    }

    console.log(
      `Settings updated to ${preferredDateFormat} and ${preferredWorkflow}.`
    );
  }, 3000);

  // register shortcut for quick todo
  logseq.App.registerCommandPalette(
    {
      key: "logseq-quicktodo-plugin",
      label: "Quick todo to today's journal page",
      keybinding: {
        binding: "m t",
      },
    },
    async () => {
      logseq.showMainUI();

      const currBlock: BlockEntity = await logseq.Editor.getCurrentBlock();
      ReactDOM.render(
        <React.StrictMode>
          {/* @ts-ignore */}
          <App currBlock={currBlock} />
        </React.StrictMode>,
        document.getElementById("app")
      );

      document.addEventListener("keydown", (e: any) => {
        if (e.keyCode !== 27) {
          (document.querySelector(".task-field") as HTMLElement).focus();
        }
      });
    }
  );
};

logseq.ready(main).catch(console.error);

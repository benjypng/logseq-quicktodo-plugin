import '@logseq/libs';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { handleClosePopup } from './handleClosePopup';

const main = () => {
  console.log('logseq-quicktodo-plugin loaded');

  // Get preferred date format
  window.setTimeout(async () => {
    const userConfigs = await logseq.App.getUserConfigs();
    const preferredDateFormat: string = userConfigs.preferredDateFormat;
    const preferredWorkflow: string = userConfigs.preferredWorkflow;
    logseq.updateSettings({
      preferredDateFormat: preferredDateFormat,
      preferredWorkflow: preferredWorkflow,
    });

    console.log(
      `Settings updated to ${preferredDateFormat} and ${preferredWorkflow}.`
    );

    if (!logseq.settings.lang) {
      logseq.updateSettings({
        lang: '',
      });
    }
  }, 3000);

  if (!logseq.settings.appendTodo) {
    logseq.updateSettings({
      appendTodo: true,
    });
  }

  // register shortcut for quick todo
  logseq.App.registerCommandPalette(
    {
      key: 'logseq-quicktodo-plugin',
      label: "Quick todo to today's journal page",
      keybinding: {
        binding: 'm t',
      },
    },
    () => {
      logseq.showMainUI();

      document.addEventListener('keydown', (e: any) => {
        if (e.keyCode !== 27) {
          (document.querySelector('.task-field') as HTMLElement).focus();
        }
      });
    }
  );

  handleClosePopup();

  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('app')
  );
};

logseq.ready(main).catch(console.error);

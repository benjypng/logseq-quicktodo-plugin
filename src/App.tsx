import React, { useState } from 'react';
import './App.css';
import { getDateForPageWithoutBrackets } from 'logseq-dateutils';

const App = () => {
  const [taskVal, setTaskVal] = useState('');
  const [appendTodo, setAppendTodo] = useState(logseq.settings.appendTodo);

  const handleForm = (e: any) => {
    setTaskVal(e.target.value);
  };

  const handleToggle = () => {
    if (appendTodo) {
      setAppendTodo(false);
      logseq.updateSettings({ appendTodo: false });
    } else if (!appendTodo) {
      setAppendTodo(true);
      logseq.updateSettings({ appendTodo: true });
    }
  };

  const handleSubmit = async (e: any) => {
    const { preferredWorkflow } = logseq.settings;

    if ((e.key === 'a' && e.ctrlKey) || (e.key === 'a' && e.metaKey)) {
      handleToggle();
    } else if (
      (e.key === 'Enter' && e.ctrlKey) ||
      (e.key === 'Enter' && e.metaKey)
    ) {
      const regExp = /\[\[(.*?)\]\]/;
      const matched = regExp.exec(taskVal);
      const page = matched[1];

      const getPage = await logseq.Editor.getPage(page);

      if (getPage === null) {
        await logseq.Editor.createPage(page, '', {
          redirect: false,
          createFirstBlock: false,
          format: 'markdown',
        });
      }

      await logseq.Editor.insertBlock(
        page,
        (appendTodo ? (preferredWorkflow === 'todo' ? 'TODO ' : 'NOW ') : '') +
          taskVal,
        {
          isPageBlock: true,
        }
      );

      logseq.App.showMsg(`${taskVal} added to [[${page}]]!`);

      setTaskVal('');

      logseq.hideMainUI({ restoreEditingCursor: true });
    } else if (e.key === 'Enter') {
      if (taskVal.length > 0) {
        const startingDate = getDateForPageWithoutBrackets(
          new Date(),
          logseq.settings.preferredDateFormat
        );

        if (logseq.settings.defaultPage) {
          await logseq.Editor.insertBlock(
            logseq.settings.defaultPage.toLowerCase(),
            (appendTodo
              ? preferredWorkflow === 'todo'
                ? 'TODO '
                : 'NOW '
              : '') + taskVal,
            {
              isPageBlock: true,
            }
          );

          logseq.App.showMsg(
            `${taskVal} added to your default page: ${logseq.settings.defaultPage}!`
          );
        } else if (logseq.settings.parsePage) {
          const regExp = /\[\[(.*?)\]\]/;
          const matched = regExp.exec(taskVal);
          const page = matched[1];

          const getPage = await logseq.Editor.getPage(page);

          if (getPage === null) {
            await logseq.Editor.createPage(page, '', {
              redirect: false,
              createFirstBlock: false,
              format: 'markdown',
            });
          }

          await logseq.Editor.insertBlock(
            page,
            (appendTodo
              ? preferredWorkflow === 'todo'
                ? 'TODO '
                : 'NOW '
              : '') + taskVal,
            {
              isPageBlock: true,
            }
          );

          logseq.App.showMsg(`${taskVal} added to [[${page}]]!`);
        } else {
          await logseq.Editor.insertBlock(
            startingDate,
            (appendTodo
              ? preferredWorkflow === 'todo'
                ? 'TODO '
                : 'NOW '
              : '') + taskVal,
            {
              isPageBlock: true,
            }
          );

          logseq.App.showMsg(`${taskVal} added to today's journal page!`);
        }

        setTaskVal('');

        logseq.hideMainUI({ restoreEditingCursor: true });
      } else {
        logseq.App.showMsg(
          'Please enter a task first or press Esc to close the popup.'
        );
      }
    }
  };

  return (
    <div
      className="task-container flex justify-center border border-black"
      tabIndex={-1}
    >
      <div className=" absolute top-10 bg-white rounded-lg p-3 w-1/3 border flex flex-col">
        <label
          htmlFor="toggle-example"
          className="flex items-center cursor-pointer relative mb-4"
        >
          <input
            type="checkbox"
            id="toggle-example"
            className="sr-only"
            checked={appendTodo}
            onChange={handleToggle}
          />
          <div className="toggle-bg bg-gray-200 border-2 border-gray-200 h-6 w-11 rounded-full"></div>
          <span className="ml-3 text-gray-900 text-sm font-medium">
            Append TODO to Item (ctrl/cmd + a)
          </span>
        </label>

        <input
          className="task-field appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="text"
          placeholder="Enter your task or item and press Enter to insert into today's journal page or Cmd+Enter to insert into a mentioned page (using [[ ]])"
          aria-label="quick todo"
          name="taskVal"
          onChange={handleForm}
          value={taskVal}
          onKeyDown={(e) => handleSubmit(e)}
        />
      </div>
    </div>
  );
};

export default App;

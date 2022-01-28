import React, { useState } from 'react';
import './App.css';
import { getDateForPage } from './dateUtils';

const App = () => {
  const [taskVal, setTaskVal] = useState('');

  const handleForm = (e: any) => {
    setTaskVal(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    if (e.keyCode === 13) {
      if (taskVal.length > 0) {
        const startingDate = getDateForPage(
          new Date(),
          logseq.settings.preferredDateFormat
        );

        const todayPage = await logseq.Editor.getPage(
          startingDate.substring(2, startingDate.length - 2)
        );

        if (logseq.settings.defaultPage) {
          await logseq.Editor.insertBlock(
            logseq.settings.defaultPage.toLowerCase(),
            `TODO ${taskVal}`,
            {
              isPageBlock: true,
            }
          );
        } else {
          await logseq.Editor.insertBlock(todayPage.name, `TODO ${taskVal}`, {
            isPageBlock: true,
          });
        }

        setTaskVal('');

        logseq.hideMainUI({ restoreEditingCursor: true });

        logseq.App.showMsg(`${taskVal} added to today's journal page!`);
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
      <div className=" absolute top-10 bg-white rounded-lg p-3 w-1/3 border">
        <input
          className="task-field appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="text"
          placeholder="Enter your task to add to today's journal page"
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

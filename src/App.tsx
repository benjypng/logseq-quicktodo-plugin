import React, { useState } from "react";
import "./App.css";
import { getDateForPageWithoutBrackets } from "logseq-dateutils";
import { BlockEntity } from "@logseq/libs/dist/LSPlugin.user";

const App = (props: BlockEntity) => {
  const [taskVal, setTaskVal] = useState("");
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
    const {
      preferredWorkflow,
      preferredDateFormat,
      defaultPage,
      defaultBlock,
    } = logseq.settings;

    if ((e.key === "t" && e.ctrlKey) || (e.key === "t" && e.metaKey)) {
      // HANDLE TOGGLING OF APPEND TODO
      handleToggle();
    } else if (
      (e.key === "Enter" && e.ctrlKey) ||
      (e.key === "Enter" && e.metaKey)
    ) {
      // SEND TASK TO MENTIONED PAGE REGARDLESS OF SETTINGS
      const regExp = /\[\[(.*?)\]\]/;
      const matched = regExp.exec(taskVal);
      if (matched === null) {
        logseq.UI.showMsg(
          "If you are using Cmd/Ctrl + Enter, please ensure that you include a [[page]] in your item.",
          "error"
        );
        return;
      }

      const page = matched[1];

      const getPage = await logseq.Editor.getPage(page);

      if (getPage === null) {
        await logseq.Editor.createPage(page, "", {
          redirect: false,
          createFirstBlock: false,
          format: "markdown",
        });
      }

      await logseq.Editor.insertBlock(
        page,
        (appendTodo ? (preferredWorkflow === "todo" ? "TODO " : "NOW ") : "") +
          taskVal,
        {
          isPageBlock: true,
        }
      );

      logseq.UI.showMsg(`${taskVal} added to [[${page}]]!`);

      setTaskVal("");
      logseq.hideMainUI({ restoreEditingCursor: true });
      await logseq.Editor.editBlock(props.currBlock.uuid);
    } else if (e.key === "Enter") {
      if (taskVal.length > 0) {
        const startingDate = getDateForPageWithoutBrackets(
          new Date(),
          preferredDateFormat
        );

        // SEND TO DEFAULT PAGE
        if (defaultPage) {
          await logseq.Editor.insertBlock(
            defaultPage.toLowerCase(),
            (appendTodo
              ? preferredWorkflow === "todo"
                ? "TODO "
                : "NOW "
              : "") + taskVal,
            {
              isPageBlock: true,
            }
          );

          logseq.UI.showMsg(
            `${taskVal} added to your default page: [[${defaultPage}]]!`
          );

          setTaskVal("");
          logseq.hideMainUI({ restoreEditingCursor: true });
          await logseq.Editor.editBlock(props.currBlock.uuid);
        } else {
          // SEND TO TODAY'S JOURNAL PAGE
          if (defaultBlock) {
            let pbt: BlockEntity[] = await logseq.Editor.getPageBlocksTree(
              startingDate
            );
            pbt = pbt.filter((b) => b.content.includes(defaultBlock));
            if (pbt.length > 1) {
              logseq.UI.showMsg(
                `More than one instance of the default block was found`,
                "error"
              );
              return;
            } else if (pbt.length === 1) {
              await logseq.Editor.insertBlock(
                pbt[0].uuid,
                (appendTodo
                  ? preferredWorkflow === "todo"
                    ? "TODO "
                    : "NOW "
                  : "") + taskVal,
                { before: false, sibling: false }
              );
              logseq.UI.showMsg(`${taskVal} added to today's journal page!`);
            } else {
              await logseq.Editor.insertBlock(
                startingDate,
                (appendTodo
                  ? preferredWorkflow === "todo"
                    ? "TODO "
                    : "NOW "
                  : "") + taskVal,
                {
                  isPageBlock: true,
                }
              );
              logseq.UI.showMsg(`${taskVal} added to today's journal page!`);
            }
          } else {
            await logseq.Editor.insertBlock(
              startingDate,
              (appendTodo
                ? preferredWorkflow === "todo"
                  ? "TODO "
                  : "NOW "
                : "") + taskVal,
              {
                isPageBlock: true,
              }
            );
            logseq.UI.showMsg(`${taskVal} added to today's journal page!`);
          }
        }

        setTaskVal("");
        logseq.hideMainUI({ restoreEditingCursor: true });
        await logseq.Editor.editBlock(props.currBlock.uuid);
      } else {
        logseq.UI.showMsg(
          "Please enter a task first or press Esc to close the popup.",
          "error"
        );
      }
    }
  };

  return (
    <div
      className="task-container flex justify-center border border-black"
      tabIndex={-1}
    >
      <div className="absolute top-10 bg-white rounded-lg p-3 w-2/3 border flex flex-col">
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
            Append TODO to Item (ctrl/cmd + t to toggle)
          </span>
        </label>

        <input
          className="task-field appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none placeholder:text-xs"
          autoFocus={true}
          type="text"
          placeholder="Enter to send to today's journal page or Cmd+Enter to send to mentioned page (mentioned page must be in [[square brackets]])"
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

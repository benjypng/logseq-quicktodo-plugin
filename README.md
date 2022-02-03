# Overview

This simple plugin helps you to insert a TODO item on your today's journal page, without navigating to it. This maybe useful when you are writing notes on one page, and suddenly want to add a task item regarding a separate matter. Instead of going to your daily page and adding the task there, this plugin allows you to add it using the command palatte.

![](/screenshots/demo.gif)

# Installation

Please install from the marketplace. If it's not available there, you can [download the latest release here](https://github.com/hkgnp/logseq-quicktodo-plugin/releases), unzip the file and manually load it into Logseq.

# Usage

## Adding to today's journal page

To begin, just activate the command palatte (Win: `Ctrl + Shift + p`, Mac: `Cmd + Shift + p`) and type `quick`, and the option `Quick todo to today's journal page` will appear. Select it and you can start keying in your task, and pressing `Enter` after. Your task will then appear on today's journal page.

## Adding to default page

If you would like to set a default page for the task items to go to, e.g. `Task Items`, please key in the following in your plugin settings, and **restart** Logseq:

```
{
    "defaultPage": "Task Items"
}
```

## Adding to page mentioned in task

If you would like for the task to be in a mentioned page, e.g. `Plan party for [[Acme Company]]` to go to the page `[[Acme Company]]`, please key in the following in your plugin settings, and **restart** Logseq':

```
{
    "parsePage": true
}
```

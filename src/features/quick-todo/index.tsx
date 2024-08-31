import '../../styles/bg.css'
import '@mantine/core/styles.css'

import {
  Container,
  Flex,
  MantineProvider,
  Space,
  Switch,
  TextInput,
} from '@mantine/core'
import { getDateForPageWithoutBrackets } from 'logseq-dateutils'
import { KeyboardEvent } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import { theme } from '../../styles/theme'

interface FormProps {
  item: string
  append_todo: boolean
  append_source: boolean
}

export const QuickTodo = () => {
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormProps>({
    defaultValues: {
      item: '',
      append_todo: logseq.settings!.appendTodo as boolean,
      append_source: logseq.settings!.appendSource as boolean,
    },
  })

  const getItemToInsert = async (data: FormProps) => {
    const itemToInsert = data.append_todo ? `TODO ${data.item}` : data.item
    const currPage = await logseq.Editor.getCurrentPage()
    return data.append_source
      ? currPage
        ? `${itemToInsert} (from: [[${currPage?.name}]])`
        : itemToInsert
      : itemToInsert
  }

  const onNormalSubmit: SubmitHandler<FormProps> = async (data) => {
    const itemToInsert = await getItemToInsert(data)

    // Insert
    const defaultLocation = logseq.settings!.defaultLocation as string
    if (defaultLocation.length > 0) {
      await logseq.Editor.appendBlockInPage(defaultLocation, itemToInsert)
    } else if (defaultLocation.startsWith('((')) {
      const block = defaultLocation.replace('((', '').replace('))', '')
      await logseq.Editor.insertBlock(block, itemToInsert)
    } else {
      const { preferredDateFormat } = await logseq.App.getUserConfigs()
      const dnp = getDateForPageWithoutBrackets(new Date(), preferredDateFormat)
      await logseq.Editor.appendBlockInPage(dnp, itemToInsert)
    }

    logseq.UI.showMsg(`${itemToInsert} added`, 'success', { timeout: 3000 })
    reset()
    logseq.hideMainUI()
  }

  const onModEnter: SubmitHandler<FormProps> = async (data) => {
    const re = /\[\[(.*?)\]\]/.exec(data.item)
    if (!re || !re[0] || !re[1]) {
      logseq.UI.showMsg('No target page specified')
      return
    }
    const itemToInsert = await getItemToInsert(data)
    await logseq.Editor.appendBlockInPage(
      re[1],
      itemToInsert.replace(re[0], ''),
    )

    logseq.UI.showMsg(`${itemToInsert} added`, 'success', { timeout: 3000 })
    reset()
    logseq.hideMainUI()
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault()
      const wrappedSubmitFunction = handleSubmit(onModEnter)
      wrappedSubmitFunction()
    }
  }

  return (
    <MantineProvider theme={theme}>
      <Container
        py="md"
        mt="xl"
        bg="white"
        w="30rem"
        bd="0.1rem solid #ccc"
        style={{ borderRadius: '0.2rem' }}
      >
        <form onSubmit={handleSubmit(onNormalSubmit)} onKeyDown={handleKeyDown}>
          <Flex direction="row" gap="xl">
            <Controller
              control={control}
              name="append_todo"
              render={({ field }) => (
                <Switch
                  labelPosition="left"
                  label="Append TODO"
                  checked={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="append_source"
              render={({ field }) => (
                <Switch
                  labelPosition="left"
                  label="Append Source"
                  checked={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </Flex>
          <Space h="1rem" />
          <Controller
            control={control}
            rules={{ required: 'This field is required' }}
            name="item"
            render={({ field }) => (
              <TextInput
                {...field}
                placeholder="Enter task and press Enter"
                id="quicktodo"
                error={errors.item?.message}
              />
            )}
          />
        </form>
      </Container>
    </MantineProvider>
  )
}

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

  const onSubmit: SubmitHandler<FormProps> = async (data) => {
    let itemToInsert = data.append_todo ? `TODO ${data.item}` : data.item

    const currPage = await logseq.Editor.getCurrentPage()
    itemToInsert = data.append_source
      ? currPage
        ? `${itemToInsert} (from: [[${currPage?.name}]])`
        : itemToInsert
      : itemToInsert

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

    reset()
    logseq.hideMainUI()
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="row" gap="xl">
            <Controller
              control={control}
              name="append_todo"
              render={({ field }) => (
                <Switch
                  required
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
                  required
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

import '../../styles/bg.css'
import '@mantine/core/styles.css'

import { Container, Input, MantineProvider, Space, Switch } from '@mantine/core'
import { getDateForPageWithoutBrackets } from 'logseq-dateutils'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import { theme } from '../../styles/theme'

interface FormProps {
  item: string
  append_todo: boolean
}

export const QuickTodo = () => {
  const { control, reset, handleSubmit } = useForm<FormProps>({
    defaultValues: {
      item: '',
      append_todo: logseq.settings!.appendTodo as boolean,
    },
  })

  const onSubmit: SubmitHandler<FormProps> = async (data) => {
    const itemToInsert = data.append_todo ? `TODO ${data.item}` : data.item
    const { preferredDateFormat } = await logseq.App.getUserConfigs()
    const dnp = getDateForPageWithoutBrackets(new Date(), preferredDateFormat)
    await logseq.Editor.appendBlockInPage(dnp, itemToInsert)
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
          <Controller
            control={control}
            name="append_todo"
            rules={{ required: true }}
            render={({ field }) => (
              <Switch
                label="Append TODO"
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Space h="1rem" />
          <Controller
            control={control}
            name="item"
            render={({ field }) => (
              <Input {...field} placeholder="Enter task" id="quicktodo" />
            )}
          />
        </form>
      </Container>
    </MantineProvider>
  )
}

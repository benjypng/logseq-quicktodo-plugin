import '../../styles/bg.css'
import '@mantine/core/styles.css'

import { Container, Input, MantineProvider } from '@mantine/core'
import { Controller, useForm } from 'react-hook-form'

import { theme } from '../../styles/theme'

interface FormProps {
  todo: string
}

export const QuickTodo = () => {
  const { control, handleSubmit } = useForm<FormProps>({
    defaultValues: {
      todo: '',
    },
  })

  const addTask = (data: FormProps) => {
    console.log(data)
  }

  return (
    <MantineProvider theme={theme}>
      <Container
        py="md"
        mt="xl"
        bg="white"
        style={{ border: '0.1rem solid #ccc' }}
      >
        <form onSubmit={handleSubmit(addTask)}>
          <Controller
            control={control}
            name="todo"
            render={({ field }) => (
              <Input {...field} placeholder="Enter task" id="quicktodo" />
            )}
          />
        </form>
      </Container>
    </MantineProvider>
  )
}

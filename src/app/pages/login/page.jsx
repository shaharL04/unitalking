'use client'
import { useToggle, upperFirst } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { useForm } from '@mantine/form';
import axios from 'axios';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
} from '@mantine/core';

export default function Login() {
  const [type, toggle] = useToggle(['login', 'register']);
  const router = useRouter();
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  function handleFormSubmit(values){
    if(type =="login"){
      checkIfUserExist(values.email, values.password);
    }else{
      createNewUser(values.name,values.email, values.password)
    }
  }

  async function checkIfUserExist(email,password){
    const response = await axios.post("http://localhost:5000/checkIfUserExistInDB" , {email:email , password: password}, { withCredentials: true })
    router.push('/pages/chatsList')
  }

  async function createNewUser(name, email,password){
    const response = await axios.post("http://localhost:5000/createUserInDB",{name:name , email:email , password: password} )
  }

  return (
    <Paper radius="md" p="xl" withBorder >
      <Text size="lg" fw={500}>
        Welcome to Mantine, {type} with
      </Text>

      <form onSubmit={form.onSubmit(handleFormSubmit)}>
        <Stack>
          {type === 'register' && (
            <TextInput
              required
              label="Name"
              placeholder="Your name"
              value={form.values.name}
              onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
              radius="md"
            />
          )}

          <TextInput
            required
            label="Email"
            placeholder="hello@mantine.dev"
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            error={form.errors.email && 'Invalid email'}
            radius="md"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && 'Password should include at least 6 characters'}
            radius="md"
          />

          {type === 'register' && (
            <Checkbox
              label="I accept terms and conditions"
              checked={form.values.terms}
              onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
            />
          )}
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
            {type === 'register'
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </Anchor>
          <Button type="submit" radius="xl">
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}

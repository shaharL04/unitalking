'use client'
import { useToggle, upperFirst } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { useForm } from '@mantine/form';
import SearchBox from '@/src/components/searchBox/SearchBox';
import axios from 'axios';
import { useEffect, useState } from 'react';
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
  Select
} from '@mantine/core';
import './login.css'
export default function Login() {
  const [type, toggle] = useToggle(['login', 'register']);
  const [langArr, setLangArr] = useState([])
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



  useEffect(() => {
    async function fetchTranslationLangs() {
      try {
        const response = await axios.get("http://localhost:8080/getTranslationLangs");
        const modifiedData = response.data.map(({ targets, ...rest }) => rest);
        setLangArr(modifiedData);
        console.log(modifiedData);
      } catch (error) {
        console.error('Error fetching translation languages:', error);
      }
    }

    fetchTranslationLangs();
  }, []);

  function handleFormSubmit(values){
    console.log(values)
    if(type =="login"){
      checkIfUserExist(values.email, values.password);
    }else{
      createNewUser(values.name,values.email, values.password, values.langCode)
    }
  }

  async function checkIfUserExist(email,password){
    const response = await axios.post("http://localhost:8080/checkIfUserExistInDB" , {email:email , password: password}, { withCredentials: true })
    router.push('/pages/chatsList')
  }

  async function createNewUser(name, email,password,langCode){
    const response = await axios.post("http://localhost:8080/createUserInDB",{name:name , email:email , password: password, langCode: langCode} )
  }

  return (
    <div className='loginPageDiv'>
    <Paper radius="md" p="xl" withBorder className='customMantinePaper'>
      <Text size="lg" fw={500}>
        Welcome to Unitalking, {type} with
      </Text>

      <form onSubmit={form.onSubmit(handleFormSubmit)}>
        <Stack>
          {type === 'register' && (
            <div className='apearOnlyOnReg'>
            <TextInput
              required
              label="Name"
              placeholder="Your name"
              value={form.values.name}
              onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
              radius="md"
            />
            <Select 
              label="Select a language"
              placeholder="Pick a language"
              data={langArr.map((lang) => ({ value: lang.code, label: lang.name }))}
              onChange={(value) => form.setFieldValue('langCode', value)}
            />
           </div>
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

        <Group justify="space-between" mt="xl" className='groupCustom'>
          <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
            {type === 'register'
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </Anchor>
          <Button type="submit" radius="xl" className='customMantineBtn'>
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Paper>
    </div>
  );
}

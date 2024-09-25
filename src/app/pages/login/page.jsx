"use client";
import { useToggle, upperFirst } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import { useForm } from "@mantine/form";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  Button,
  Checkbox,
  Anchor,
  Stack,
  Select,
  FileInput,
  Image,
} from "@mantine/core";
import Alerts from "@/src/components/Alerts";
import "./login.css";

export default function Login() {
  const [type, toggle] = useToggle(["login", "register"]);
  const [langArr, setLangArr] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [groupImage, setGroupImage] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const router = useRouter();
  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      terms: true,
      langCode: "", // Add this to capture the selected language
      photo: null, // Field to store uploaded photo
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  });

  useEffect(() => {
    async function fetchTranslationLangs() {
      try {
        setAlerts([])
        const response = await axios.get(
          "http://localhost:8080/getTranslationLangs"
        );
        const modifiedData = response.data.map(({ targets, ...rest }) => rest);
        modifiedData.unshift({
          code: "NULL",
          name: "Do not Translate Message",
        });
        setLangArr(modifiedData);
      } catch (error) {
        if (error.response) {
          setAlerts([ error.response.data]);
          console.error('Errors:', error.response.data); 
      } else {
          console.error('Error:', error.message);
      }
      }
    }

    fetchTranslationLangs();
  }, []);

  // Generic function to add an alert if it doesn't already exist
  const addAlert = (alert) => {
    setAlerts((prevAlerts) => {
      if (!prevAlerts.includes(alert)) {
        return [...prevAlerts, alert];
      }
      return prevAlerts;
    });
  };

  // Handle form submission
  function handleFormSubmit(values) {
    if (type === "login") {
      checkIfUserExist(values.email, values.password);
    } else {
      createNewUser(
        values.name,
        values.email,
        values.password,
        values.langCode,
        groupImage
      );
    }
  }

  // Check if user exists
  async function checkIfUserExist(email, password) {
    try {
      setAlerts([]);
        const response = await axios.post(
            "http://localhost:8080/checkIfUserExistInDB",
            { email, password },
            { withCredentials: true }
        );

        // Log the response on successful request
        console.log(response.data); // This will contain the response data from the server
        router.push("/pages/chatsList"); // Redirect to chatsList if the user exists
    } catch (error) {
        if (error.response) {
            setAlerts([ error.response.data]);
            console.error('Errors:', error.response.data); 
        } else {
            // Log any other errors that may occur
            console.error('Error:', error.message);
        }
    }
}


  // Create a new user
    async function createNewUser(name, email, password, langCode, photo) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("langCode", langCode);
      if (photo) {
        formData.append("userPhoto", photo);
      }
    
      try {
        setAlerts([])
        const response = await axios.post(
          "http://localhost:8080/createUserInDB",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } catch (error) {
        if (error.response) {
          // If there's an error response from the server, set it as an alert
          setAlerts([error.response.data]);
          console.error('Errors:', error.response.data);
        } else {
          console.error('Error:', error.message);
        }
      }
    }
    

  // Handle image change and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setGroupImage(file);
    }
  };

  return (
    <div className="loginPageDiv">
      <Paper radius="md" p="xl" withBorder className="customMantinePaper">
        <Text size="lg" fw={500}>
          Welcome to Unitalking, {type} with
        </Text>

        <form onSubmit={form.onSubmit(handleFormSubmit)}>
          <Stack>
            {/* Image preview and upload */}
            {type === "register" && (
              <div className="inputImageDiv">
                <div className="form-group">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="rounded-image"
                      />
                    ) : (
                      <div className="placeholder rounded-image">
                        <div className="textNoImageSelected">
                          No Image Selected
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="image-input"
                        />
                      </div>
                    )}
                  </div>
              </div>
            )}

            {/* Registration fields */}
            {type === "register" && (
              <div className="appearOnlyOnReg">
                <TextInput
                  required
                  label="Username"
                  placeholder="Your Username"
                  value={form.values.name}
                  onChange={(event) =>
                    form.setFieldValue("name", event.currentTarget.value)
                  }
                  radius="md"
                />
                <Select
                  label="Select a language"
                  placeholder="Pick a language"
                  data={langArr.map((lang) => ({
                    value: lang.code,
                    label: lang.name,
                  }))}
                  onChange={(value) => form.setFieldValue("langCode", value)}
                />
              </div>
            )}

            {/* Email and password fields */}
            <TextInput
              required
              label="Email"
              placeholder="hello@mantine.dev"
              value={form.values.email}
              onChange={(event) =>
                form.setFieldValue("email", event.currentTarget.value)
              }
              error={form.errors.email && "Invalid email"}
              radius="md"
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) =>
                form.setFieldValue("password", event.currentTarget.value)
              }
              error={
                form.errors.password &&
                "Password should include at least 6 characters"
              }
              radius="md"
            />

            {type === "register" && (
              <Checkbox
                label="I accept terms and conditions"
                checked={form.values.terms}
                onChange={(event) =>
                  form.setFieldValue("terms", event.currentTarget.checked)
                }
              />
            )}
          </Stack>

          <Group justify="space-between" mt="xl" className="groupCustom">
            <Anchor
              component="button"
              type="button"
              c="dimmed"
              onClick={() => toggle()}
              size="xs"
            >
              {type === "register"
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </Anchor>
            <Button type="submit" radius="xl" className="customMantineBtn">
              {upperFirst(type)}
            </Button>
            <Alerts alerts={alerts}/>
          </Group>
        </form>
      </Paper>
    </div>
  );
}

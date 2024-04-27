import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import { FC, useState } from "react";

export const SignUpForm: FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit() {
    console.log({
      name,
      email,
      password,
    });
  }

  return (
    <Container maxWidth="sm">
      <Box marginTop="3vh" sx={{ typography: "h5" }}>
        Sign up to start creating your own shopping list
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        gap={2}
        marginTop="3vh"
      >
        <TextField
          label="Name"
          fullWidth
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Email"
          fullWidth
          placeholder="jdoe@email.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          fullWidth
          placeholder="Make it a good one"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" size="large" onClick={handleSubmit}>
          Sign Up
        </Button>
      </Box>
    </Container>
  );
};

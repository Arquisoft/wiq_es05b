import React, { useState } from "react";
import { Container, Typography, TextField, Button, Snackbar, Paper } from "@mui/material";

import { Link } from "react-router-dom";

const introHandler = (event, submit) => {
  if (event.key === "Enter") submit();
}

const SuggestionText = ({ text, linkText, link }) => {
  return (
    <Typography variant="body2" sx={{ marginTop: 2 }}>
      {text} <Link to={link}>{linkText}</Link>
    </Typography>
  );
};

const Form = ({ formData }) => {
  const [error, setError] = useState("");
  
  return (
    <>
      <Typography component="h1" variant="h5">
        {formData.title || "Form"}
      </Typography>
      {
        formData.fields.map((field, i) => {
          return (
            <TextField
              key={i}
              required={field.required}
              name={field.name}
              margin="normal"
              fullWidth
              label={field.displayed}
              value={field.value}
              type={field.type || "text"}
              onChange={field.changeHandler}
              onKeyDown={e => introHandler(e, () => formData.submit(setError))}
            />
          )
        })
      }
      <Button variant="contained" color="primary" onClick={() => formData.submit(setError)}>
        {formData.submitButtonTx || "Submit"}
      </Button>
      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError("")}
          message={`Error: ${error}`}
        />
      )}
    </>
  );
};

const CustomForm = ({ formData, suggestion }) => {
  return (
    <Container component="main" maxWidth="xs" sx={{ marginTop: 4 }}>
      <Paper elevation={3} style={{ padding: "2rem" }}>
        <Form formData={formData} />
        {suggestion && (
        <SuggestionText
          text={suggestion.text}
          linkText={suggestion.linkText}
          link={suggestion.link}
        />)}
      </Paper>
    </Container>
  );
};

export default CustomForm;

import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useState } from "react";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import FormControlLabel from "@mui/material/FormControlLabel";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Checkbox from "@mui/material/Checkbox";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";

import CircularIndeterminate from "../../components/CircularIndeterminate";
import FeedbackSnackbar from "../../components/FeedbackSnackbar";
import BasicTextField from "../../components/BasicTextField";
import { APP_ROUTES } from "../../constants/app-routes";
import BasicButton from "../../components/button/Basic";
import { validateEmail } from "../../utils/validators";
import { useAuth } from "../../context/AuthContext";
import Copyright from "../../components/Copyright";

const defaultTheme = createTheme();

export default function SignUp() {
  const navigate = useNavigate();

  const [isLoadingAnimation, setIsLoadingAnimation] = useState(false);

  /* snackbar feedback */
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [severitySnackbar, setSeveritySnackbar] = useState("warning");
  const [messageSnackbar, setMessageSnackbar] = useState("");

  const handleOpenSnackbar = (props) => {
    setSeveritySnackbar(props.severity);
    setMessageSnackbar(props.message);
    setOpenSnackbar(true);
  };

  /* init form data */
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  /* init form errors */
  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const validateForm = () => {
    const errors = {
      // object to store errors
    };

    if (!formData.firstName) errors.firstName = "Nome é obrigatório.";
    if (!formData.lastName) errors.lastName = "Sobrenome é obrigatório.";
    if (!formData.email) {
      errors.email = "Email é obrigatório.";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Formato de email inválido.";
    }
    if (!formData.password) errors.password = "Senha é obrigatória.";

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  /* submitting action */
  const { register } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoadingAnimation(true);
      await register(formData);
      navigate(APP_ROUTES.private.inicio);
    } catch (error) {
      handleOpenSnackbar({
        severity: "error",
        message: error.message,
      });
    } finally {
      setIsLoadingAnimation(false);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            mt: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box component="div" sx={{ width: "100%" }}>
            <Avatar sx={{ my: 2, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h6">
              Criar uma conta
            </Typography>
            <Typography variant="subtitle1">
              senectus et netus et malesuada
            </Typography>
          </Box>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            autoComplete="off"
            sx={{ mt: 1 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <BasicTextField
                  required
                  id="firstName"
                  label="Nome"
                  name="firstName"
                  onChange={handleFieldChange}
                  error={!!formErrors.firstName}
                  helperText={formErrors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <BasicTextField
                  required
                  id="lastName"
                  label="Sobrenome"
                  name="lastName"
                  onChange={handleFieldChange}
                  error={!!formErrors.lastName}
                  helperText={formErrors.lastName}
                />
              </Grid>
              <Grid item xs={12}>
                <BasicTextField
                  required
                  id="email"
                  label="Email"
                  name="email"
                  onChange={handleFieldChange}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <BasicTextField
                  required
                  id="password"
                  label="Senha"
                  name="password"
                  type="password"
                  onChange={handleFieldChange}
                  error={!!formErrors.password}
                  helperText={formErrors.password}
                />
              </Grid>
              {/* <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="Entre em contato comigo por email"
                />
              </Grid> */}
            </Grid>
            <BasicButton
              type="submit"
              fullWidth
              disabled={isLoadingAnimation}
              sx={{ mt: 3, mb: 2 }}
            >
              {isLoadingAnimation && (
                <CircularIndeterminate size={24} color="inherit" />
              )}
              {!isLoadingAnimation && "Sign Up"}
            </BasicButton>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  component={RouterLink}
                  to={APP_ROUTES.public.sign_in}
                  variant="body2"
                >
                  Já tem uma conta? Faça logon
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
        <FeedbackSnackbar
          open={openSnackbar}
          severity={severitySnackbar}
          message={messageSnackbar}
          onClose={() => setOpenSnackbar(false)}
        />
      </Container>
    </ThemeProvider>
  );
}

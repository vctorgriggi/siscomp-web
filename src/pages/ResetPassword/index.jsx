import { Link as RouterLink, useParams } from "react-router-dom";
import { useState, useEffect, Fragment } from "react";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";

import { resetPassword, validateResetToken } from "../../services/authService";
import CircularIndeterminate from "../../components/CircularIndeterminate";
import FeedbackSnackbar from "../../components/FeedbackSnackbar";
import BasicTextField from "../../components/BasicTextField";
import { APP_ROUTES } from "../../constants/app-routes";
import BasicButton from "../../components/button/Basic";
import Copyright from "../../components/Copyright";

const defaultTheme = createTheme();

export default function ResetPassword() {
  const { id, token } = useParams();

  /* loading animation */
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

  /* stepper settings */
  const [activeStep, setActiveStep] = useState(0);

  /* init form data */
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  /* init form errors */
  const [formErrors, setFormErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    const errors = {
      // object to store errors
    };

    if (!formData.password) errors.password = "Senha é obrigatória.";
    if (!formData.confirmPassword)
      errors.confirmPassword = "Confirmação de senha é obrigatória.";
    if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = "Senhas não conferem.";

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  /* submitting action */
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoadingAnimation(true);
      await resetPassword(id, token, formData);
      setActiveStep(2);
    } catch (error) {
      handleOpenSnackbar({
        severity: "error",
        message: error.message,
      });
    } finally {
      setIsLoadingAnimation(false);
    }
  };

  /* validate token */
  const [isValidatingTokenAnimation, setIsValidatingTokenAnimation] =
    useState(true);

  const handleValidateToken = async () => {
    try {
      await validateResetToken(id, token);
      setActiveStep(1);
    } catch (error) {
      handleOpenSnackbar({
        severity: "error",
        message: "O código de redefinição de senha é inválido.",
      });
    } finally {
      setIsValidatingTokenAnimation(false);
    }
  };

  useEffect(() => {
    handleValidateToken();
  }, [id, token]);

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
            {activeStep === 0 && (
              <Fragment>
                {isValidatingTokenAnimation && <CircularIndeterminate />}
                {!isValidatingTokenAnimation && (
                  <Box component="div">
                    <Typography component="h1" variant="h6">
                      Código inválido
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        textAlign: "justify",
                        mt: 1,
                        mb: 2,
                      }}
                    >
                      O código para redefinição de senha é inválido ou expirou.
                      Por favor, solicite um novo link de redefinição de senha
                      ou entre em contato com o suporte para obter assistência.
                    </Typography>
                    <Grid container>
                      <Grid item>
                        <Link
                          component={RouterLink}
                          to={APP_ROUTES.public.sign_in}
                          variant="body2"
                        >
                          Voltar para entrar
                        </Link>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Fragment>
            )}
            {activeStep === 1 && (
              <Box component="div">
                <Typography component="h1" variant="h6">
                  Atualize sua senha
                </Typography>
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  autoComplete="off"
                  sx={{ mt: 1 }}
                >
                  <Grid container spacing={2}>
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
                    <Grid item xs={12}>
                      <BasicTextField
                        required
                        id="confirmPassword"
                        label="Confirme sua senha"
                        name="confirmPassword"
                        type="password"
                        onChange={handleFieldChange}
                        error={!!formErrors.confirmPassword}
                        helperText={formErrors.confirmPassword}
                      />
                    </Grid>
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
                    {!isLoadingAnimation && "Alterar senha"}
                  </BasicButton>
                </Box>
              </Box>
            )}
            {activeStep === 2 && (
              <Box component="div">
                <Typography component="h1" variant="h6">
                  Senha atualizada
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    textAlign: "justify",
                    mt: 1,
                    mb: 2,
                  }}
                >
                  Sua senha foi redefinida com sucesso. Agora você pode usar sua
                  nova senha para acessar sua conta. Se precisar de mais
                  assistência, por favor, entre em contato com o suporte.
                </Typography>
                <Grid container>
                  <Grid item>
                    <Link
                      component={RouterLink}
                      to={APP_ROUTES.public.sign_in}
                      variant="body2"
                    >
                      Voltar para entrar
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            )}
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

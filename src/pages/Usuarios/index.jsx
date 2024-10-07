import { Fragment, useState, useEffect } from "react";

import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import DialogContentText from "@mui/material/DialogContentText";
import TablePagination from "@mui/material/TablePagination";
import TableContainer from "@mui/material/TableContainer";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TableFooter from "@mui/material/TableFooter";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";

import CircularIndeterminate from "../../components/CircularIndeterminate";
import { create, get, updateById } from "../../services/userService";
import AdministrativePanel from "../../layouts/AdministrativePanel";
import FeedbackSnackbar from "../../components/FeedbackSnackbar";
import BasicTextField from "../../components/BasicTextField";
import CancelButton from "../../components/button/Cancel";
import BasicButton from "../../components/button/Basic";
import BasicSelect from "../../components/BasicSelect";
import { validateEmail } from "../../utils/validators";
import SaveButton from "../../components/button/Save";
import { useAuth } from "../../context/AuthContext";

/* table settings */
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function Usuarios() {
  const { user: loggedUser } = useAuth();

  /* users */
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSearchingAnimation, setIsSearchingAnimation] = useState(false);

  async function find() {
    try {
      setIsSearchingAnimation(true);
      const data = await get();
      setUsers(data);
    } catch (error) {
      handleOpenSnackbar({
        severity: "error",
        message: error.message,
      });
    } finally {
      setIsSearchingAnimation(false);
    }
  }

  useEffect(() => {
    find();
  }, []);

  /* changing status */
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [statusDialogAction, setStatusDialogAction] = useState(null);
  const [isChangingStatusAnimation, setIsChangingStatusAnimation] =
    useState(false);

  const showStatusDialog = (user, action) => {
    setSelectedUser(user);
    setStatusDialogAction(action);
    setIsStatusDialogOpen(true);
  };

  const hideStatusDialog = () => {
    setIsStatusDialogOpen(false);
    setSelectedUser(null);
    setStatusDialogAction(null);
  };

  const handleStatusDialogAction = async () => {
    if (!selectedUser) return;

    try {
      setIsChangingStatusAnimation(true);
      if (statusDialogAction === "block") {
        await updateById(selectedUser.id, { isActive: false });
        handleOpenSnackbar({
          severity: "success",
          message: "Mudança de status: o usuário foi bloqueado com sucesso.",
        });
      } else if (statusDialogAction === "unblock") {
        await updateById(selectedUser.id, { isActive: true });
        handleOpenSnackbar({
          severity: "success",
          message: "Mudança de status: o usuário foi liberado com sucesso.",
        });
      }
      await find();
    } catch (error) {
      handleOpenSnackbar({
        severity: "error",
        message: error.message,
      });
    } finally {
      setIsChangingStatusAnimation(false);
      hideStatusDialog();
    }
  };

  /* init form data */
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    isAdmin: false,
    isActive: true,
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

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  /* setup form */
  const [formMode, setFormMode] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    formMode === "create" ? handleCreate() : handleUpdate();
  };

  const hideForm = () => {
    setFormMode(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      isAdmin: false,
      isActive: true,
    });
    setFormErrors({
      firstName: "",
      lastName: "",
      email: "",
    });
    setSelectedUser(null);
  };

  /* creating action */
  const [isCreatingAnimation, setIsCreatingAnimation] = useState(false);

  const handleCreate = async () => {
    try {
      setIsCreatingAnimation(true);
      await create(formData);
      await find();
      handleOpenSnackbar({
        severity: "success",
        message: "Nova adição: o conteúdo foi criado conforme solicitado.",
      });
    } catch (error) {
      // TODO: sometimes a user will be created, but an error notification will appear because the email couldn't be sent. in such cases, I may need to call the find() function here.
      handleOpenSnackbar({
        severity: "error",
        message: error.message,
      });
    } finally {
      setIsCreatingAnimation(false);
      hideForm();
    }
  };

  /* updating action */
  const [isUpdatingAnimation, setIsUpdatingAnimation] = useState(false);

  const showUpdate = (user) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      isAdmin: user.isAdmin,
      isActive: user.isActive,
    });
    setFormMode("update");
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;

    try {
      setIsUpdatingAnimation(true);
      await updateById(selectedUser.id, formData);
      await find();
      handleOpenSnackbar({
        severity: "success",
        message: "Sucesso na edição: as alterações foram salvas.",
      });
    } catch (error) {
      handleOpenSnackbar({
        severity: "error",
        message: error.message,
      });
    } finally {
      setIsUpdatingAnimation(false);
      hideForm();
    }
  };

  /* snackbar feedback */
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [severitySnackbar, setSeveritySnackbar] = useState("warning");
  const [messageSnackbar, setMessageSnackbar] = useState("");

  const handleOpenSnackbar = (props) => {
    setSeveritySnackbar(props.severity);
    setMessageSnackbar(props.message);
    setOpenSnackbar(true);
  };

  /* table pagination */
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <AdministrativePanel>
      <Stack direction="column" spacing={4}>
        <Box component="div" sx={{ width: "100%" }}>
          <BasicButton onClick={() => setFormMode("create")} />
        </Box>
        {isSearchingAnimation && <CircularIndeterminate />}
        {!isSearchingAnimation && (
          <Fragment>
            {users.length > 0 && (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Ações</StyledTableCell>
                      <StyledTableCell align="left">Nome</StyledTableCell>
                      <StyledTableCell align="left">Sobrenome</StyledTableCell>
                      <StyledTableCell align="left">Email</StyledTableCell>
                      <StyledTableCell align="left">Acesso</StyledTableCell>
                      <StyledTableCell align="left">Status</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(rowsPerPage > 0
                      ? users.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                      : users
                    ).map((user) => (
                      <StyledTableRow key={user.id}>
                        <StyledTableCell component="th" scope="row">
                          <Stack direction="row" spacing={1}>
                            <IconButton
                              title="Editar"
                              aria-label="Editar"
                              onClick={() => showUpdate(user)}
                            >
                              <EditIcon />
                            </IconButton>
                            {user.isActive && (
                              <IconButton
                                title="Bloquear"
                                aria-label="Bloquear"
                                onClick={() => showStatusDialog(user, "block")}
                                disabled={user.id === loggedUser.id}
                              >
                                <ClearIcon />
                              </IconButton>
                            )}
                            {!user.isActive && (
                              <IconButton
                                title="Liberar"
                                aria-label="Liberar"
                                onClick={() =>
                                  showStatusDialog(user, "unblock")
                                }
                              >
                                <CheckIcon />
                              </IconButton>
                            )}
                          </Stack>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {user.firstName}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {user.lastName}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {user.email}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {user.isAdmin && "Gestor"}
                          {!user.isAdmin && "Colaborador"}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {user.isActive && <Chip label="Liberado" />}
                          {!user.isActive && (
                            <Chip label="Bloqueado" color="warning" />
                          )}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        rowsPerPageOptions={[
                          5,
                          10,
                          25,
                          { label: "All", value: -1 },
                        ]}
                        // colSpan={3}
                        count={users.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            )}
            {users.length === 0 && (
              <Typography
                variant="body1"
                sx={{
                  textAlign: "center",
                  textTransform: "lowercase",
                }}
              >
                não há usuários cadastrados.
              </Typography>
            )}
          </Fragment>
        )}
      </Stack>
      <Dialog open={isStatusDialogOpen} onClose={hideStatusDialog} fullWidth>
        <DialogTitle id="status-dialog-title">Você tem certeza?</DialogTitle>
        <DialogContent>
          <DialogContentText id="status-dialog-description">
            {statusDialogAction === "unblock"
              ? "Você realmente deseja liberar este usuário? Após a liberação, o usuário poderá acessar o sistema novamente. Essa ação poderá ser revertida a qualquer momento."
              : "Você realmente deseja bloquear este usuário? Após o bloqueio, o usuário não poderá mais acessar o sistema. Essa ação poderá ser revertida a qualquer momento."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <CancelButton onClick={hideStatusDialog} />
          <Button
            variant="contained"
            color={statusDialogAction === "unblock" ? "primary" : "error"}
            onClick={handleStatusDialogAction}
            disabled={isChangingStatusAnimation}
            sx={{ minWidth: "150px", textTransform: "capitalize" }}
          >
            {isChangingStatusAnimation && (
              <CircularIndeterminate size={24} color="inherit" />
            )}
            {!isChangingStatusAnimation &&
              (statusDialogAction === "unblock"
                ? "Sim, liberar"
                : "Sim, bloquear")}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={formMode !== null}
        onClose={hideForm}
        scroll="paper"
        fullWidth
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          autoComplete="off"
        >
          <DialogTitle>
            {formMode === "update"
              ? "Atualize as informações do item"
              : "Novo item"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </DialogContentText>
            <BasicTextField
              required
              id="firstName"
              label="Nome"
              name="firstName"
              value={formData.firstName}
              onChange={handleFieldChange}
              error={!!formErrors.firstName}
              helperText={formErrors.firstName}
            />
            <BasicTextField
              required
              id="lastName"
              label="Sobrenome"
              name="lastName"
              value={formData.lastName}
              onChange={handleFieldChange}
              error={!!formErrors.lastName}
              helperText={formErrors.lastName}
            />
            <BasicTextField
              required
              id="email"
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleFieldChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
            />
            <BasicSelect
              id="isAdmin"
              name="isAdmin"
              label="Cargo"
              value={formData.isAdmin}
              onChange={handleFieldChange}
              disabled={
                formMode === "update" && selectedUser.id === loggedUser.id
              }
            >
              <MenuItem value={true}>Gestor</MenuItem>
              <MenuItem value={false}>Colaborador</MenuItem>
            </BasicSelect>
            {formMode === "update" && (
              <BasicSelect
                id="isActive"
                name="isActive"
                label="Status"
                value={formData.isActive}
                onChange={handleFieldChange}
                disabled={selectedUser.id === loggedUser.id}
              >
                <MenuItem value={true}>Liberado</MenuItem>
                <MenuItem value={false}>Bloqueado</MenuItem>
              </BasicSelect>
            )}
          </DialogContent>
          <DialogActions>
            <CancelButton onClick={hideForm} />
            <SaveButton
              isCreatingAnimation={isCreatingAnimation}
              isUpdatingAnimation={isUpdatingAnimation}
              formMode={formMode}
            />
          </DialogActions>
        </Box>
      </Dialog>
      <FeedbackSnackbar
        open={openSnackbar}
        severity={severitySnackbar}
        message={messageSnackbar}
        onClose={() => setOpenSnackbar(false)}
      />
    </AdministrativePanel>
  );
}

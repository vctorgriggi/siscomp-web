import { Fragment, useState, useEffect } from "react";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DialogContentText from "@mui/material/DialogContentText";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TablePagination from "@mui/material/TablePagination";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TableContainer from "@mui/material/TableContainer";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DownloadIcon from "@mui/icons-material/Download";
import PostAddIcon from "@mui/icons-material/PostAdd";
import CardContent from "@mui/material/CardContent";
import DeleteIcon from "@mui/icons-material/Delete";
import DialogTitle from "@mui/material/DialogTitle";
import TableFooter from "@mui/material/TableFooter";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import TableRow from "@mui/material/TableRow";
import Dialog from "@mui/material/Dialog";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { CSVLink } from "react-csv";
import "dayjs/locale/pt-br";
import dayjs from "dayjs";

import { deleteById as deleteQuotationById } from "../../services/quotationService";
import CircularIndeterminate from "../../components/CircularIndeterminate";
import AdministrativePanel from "../../layouts/AdministrativePanel";
import { get as getProducts } from "../../services/productService";
import FeedbackSnackbar from "../../components/FeedbackSnackbar";
import BasicTextField from "../../components/BasicTextField";
import QuotationDialog from "./components/QuotationDialog";
import CancelButton from "../../components/button/Cancel";
import DeleteDialog from "../../components/DeleteDialog";
import BasicButton from "../../components/button/Basic";
import BasicSelect from "../../components/BasicSelect";
import SaveButton from "../../components/button/Save";
import { useAuth } from "../../context/AuthContext";
import {
  create,
  get,
  getById,
  deleteById,
} from "../../services/purchaseRequestService";

dayjs.locale("pt-br");

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

export default function RequisicoesDeCompras() {
  const { user } = useAuth();

  /* purchase requests */
  const [pRequests, setPRequests] = useState([]);
  const [selectedPRequest, setSelectedPRequest] = useState(null);
  const [isSearchingAnimation, setIsSearchingAnimation] = useState(false);

  async function find() {
    try {
      setIsSearchingAnimation(true);
      const data = await get();
      setPRequests(data);
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

  /* searching products */
  const [products, setProducts] = useState([]);
  const [isSearchingProductsAnimation, setIsSearchingProductsAnimation] =
    useState(false);

  async function findProducts() {
    try {
      setIsSearchingProductsAnimation(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      handleOpenSnackbar({
        severity: "error",
        message: error.message,
      });
    } finally {
      setIsSearchingProductsAnimation(false);
    }
  }

  useEffect(() => {
    findProducts();
  }, []);

  /* searching quotation by id */
  const [isSearchingByIdAnimation, setIsSearchingByIdAnimation] =
    useState(false);

  async function findById(id) {
    try {
      setIsSearchingByIdAnimation(true);
      const data = await getById(id);
      setSelectedPRequest(data);
    } catch (error) {
      handleOpenSnackbar({
        severity: "error",
        message: error.message,
      });
    } finally {
      setIsSearchingByIdAnimation(false);
    }
  }

  /* utils */
  const formatDate = (date, withTime = false) => {
    if (!date) {
      return "not applicable";
    }

    const fmtDate = withTime ? "lll" : "ll";

    return dayjs(date).format(fmtDate);
  };

  const brlValue = (value) => {
    if (!value) {
      return "not applicable";
    }

    const fmtValue = parseFloat(value);

    if (isNaN(fmtValue)) {
      return "Invalid value.";
    }

    return fmtValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const mapStatus = (status) => {
    switch (status) {
      case "open":
        return "Aberta";
      case "in_quote":
        return "Em cotação";
      case "quoted":
        return "Cotada";
      default:
        return "not applicable";
    }
  };

  /* deleting action */
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingAnimation, setIsDeletingAnimation] = useState(false);

  const showDelete = (pRequest) => {
    setSelectedPRequest(pRequest);
    setIsDeleting(true);
  };

  const hideDelete = () => {
    setIsDeleting(false);
    setSelectedPRequest(null);
  };

  const handleDelete = async () => {
    if (!selectedPRequest) return;

    try {
      setIsDeletingAnimation(true);
      await deleteById(selectedPRequest.id);
      await find();
      handleOpenSnackbar({
        severity: "success",
        message: "Exclusão bem-sucedida: o conteúdo foi removido.",
      });
    } catch (error) {
      handleOpenSnackbar({
        severity: "error",
        message: error.message,
      });
    } finally {
      setIsDeletingAnimation(false);
      hideDelete();
    }
  };

  /* init form data */
  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
    validity: null,
    observation: "",
  });

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  const handleDateChange = (event) => {
    setFormData({ ...formData, validity: event });
  };

  /* init form errors */
  const [formErrors, setFormErrors] = useState({
    productId: "",
    quantity: "",
    validity: "",
  });

  const validateForm = () => {
    const errors = {
      // object to store errors
    };

    if (!formData.productId) errors.productId = "Produto é obrigatório.";
    if (!formData.quantity) errors.quantity = "Quantidade é obrigatório.";
    if (!formData.validity) errors.validity = "Validade é obrigatória.";

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  /* setup form */
  const [formMode, setFormMode] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    handleCreate();
  };

  const hideForm = () => {
    setFormMode(null);
    setFormData({
      productId: "",
      quantity: "",
      validity: null,
      observation: "",
    });
    setFormErrors({
      productId: "",
      quantity: "",
      validity: "",
    });
    setSelectedPRequest(null);
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
      handleOpenSnackbar({
        severity: "error",
        message: error.message,
      });
    } finally {
      setIsCreatingAnimation(false);
      hideForm();
    }
  };

  /* see details */
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const showDetails = async (pRequest) => {
    setSelectedPRequest(pRequest);
    findById(pRequest.id);
    setIsDetailsDialogOpen(true);
  };

  const hideDetails = () => {
    setIsDetailsDialogOpen(false);
    setSelectedPRequest(null);
  };

  /* quotations dialog */
  const [isQuotationsDialogOpen, setIsQuotationsDialogOpen] = useState(false);

  const showQuotations = (pRequest) => {
    setSelectedPRequest(pRequest);
    setIsQuotationsDialogOpen(true);
  };

  const hideQuotations = () => {
    setIsQuotationsDialogOpen(false);
    setSelectedPRequest(null);
  };

  /* deleting quotation action */
  const [isDeletingQuotationAnimation, setIsDeletingQuotationAnimation] =
    useState([]);

  const handleDeleteQuotation = async (id) => {
    try {
      setIsDeletingQuotationAnimation((prev) => [...prev, id]);
      await deleteQuotationById(id);
      await findById(selectedPRequest.id);
      await find(); // note: I use it to update the status of the purchase request in the table
      handleOpenSnackbar({
        severity: "success",
        message: "Exclusão bem-sucedida: a cotação foi removida.",
      });
    } catch (error) {
      handleOpenSnackbar({
        severity: "error",
        message: error.message,
      });
    } finally {
      setIsDeletingQuotationAnimation((prev) =>
        prev.filter((quotationId) => quotationId !== id)
      );
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

  /* filters */
  const [filteredPRequests, setFilteredPRequests] = useState([]);
  const [productFilter, setProductFilter] = useState("");

  const handleFilterClick = () => {
    const filterPRequests = pRequests.filter((pRequest) =>
      productFilter ? pRequest.productId === productFilter : true
    );

    setFilteredPRequests(filterPRequests);
  };

  useEffect(() => {
    setFilteredPRequests(pRequests);
  }, [pRequests]);

  /* table pagination */
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - filteredPRequests.length)
      : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /* prepare data for CSV */
  const headers = [
    { label: "Campo", key: "field" },
    { label: "Valor", key: "value" },
  ];

  const prepareDataForCSV = (pRequest) => {
    if (!pRequest) return [];

    const requestDetails = [
      { field: "Produto", value: pRequest.product?.name || "not applicable" },
      { field: "Quantidade", value: pRequest.quantity },
      { field: "Validade", value: formatDate(pRequest.validity) },
      {
        field: "Data da Solicitação",
        value: formatDate(pRequest.createdAt, true),
      },
      {
        field: "Observação",
        value: pRequest.observation || "Não há observações.",
      },
      {
        field: "Solicitada por",
        value: selectedPRequest?.user
          ? `${selectedPRequest.user.firstName} ${selectedPRequest.user.lastName}`
          : "not applicable",
      },
      {
        field: "Status",
        value: mapStatus(pRequest.status),
      },
    ];

    const quotesDetails =
      pRequest.quotes?.map((quotation, index) => ({
        field: `Cotação ${index + 1}`,
        value: `${quotation.supplier?.name || "not applicable"} - R$ ${brlValue(
          quotation.price
        )} - ${quotation.observation || "Não há observações."}`,
      })) || [];

    return [...requestDetails, ...quotesDetails];
  };

  return (
    <AdministrativePanel>
      <Stack direction="column" spacing={4}>
        <Box component="div" sx={{ width: "100%" }}>
          <BasicButton onClick={() => setFormMode("create")} />
        </Box>
        <Card sx={{ paddingX: { xs: 2, md: 0 } }}>
          <CardHeader title="Filtros" />
          <CardContent>
            <Box
              component="form"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
              autoComplete="off"
            >
              <BasicSelect
                label="Produto"
                value={productFilter}
                onChange={(event) => setProductFilter(event.target.value)}
              >
                {isSearchingProductsAnimation && (
                  <MenuItem disabled>Loading...</MenuItem>
                )}
                {!isSearchingProductsAnimation && [
                  <MenuItem key="all" value="">
                    All
                  </MenuItem>,
                  products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name}
                    </MenuItem>
                  )),
                ]}
              </BasicSelect>
              <BasicButton onClick={handleFilterClick}>Submeter</BasicButton>
            </Box>
          </CardContent>
        </Card>
        {isSearchingAnimation && <CircularIndeterminate />}
        {!isSearchingAnimation && (
          <Fragment>
            {pRequests.length > 0 && (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Ações</StyledTableCell>
                      <StyledTableCell align="left">Produto</StyledTableCell>
                      <StyledTableCell align="left">Quantidade</StyledTableCell>
                      <StyledTableCell align="left">Validade</StyledTableCell>
                      <StyledTableCell align="left">Observação</StyledTableCell>
                      <StyledTableCell align="left">Status</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(rowsPerPage > 0
                      ? filteredPRequests.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                      : filteredPRequests
                    ).map((pRequest) => (
                      <StyledTableRow key={pRequest.id}>
                        <StyledTableCell component="th" scope="row">
                          <Stack direction="row" spacing={1}>
                            <IconButton
                              title="Detalhes"
                              aria-label="Detalhes"
                              onClick={() => showDetails(pRequest)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                            {user.isAdmin && (
                              <IconButton
                                title="Cotações"
                                aria-label="Cotações"
                                onClick={() => showQuotations(pRequest)}
                                disabled={pRequest.status === "quoted"}
                              >
                                <PostAddIcon />
                              </IconButton>
                            )}
                            <IconButton
                              title="Apagar"
                              aria-label="Apagar"
                              onClick={() => showDelete(pRequest)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Stack>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {pRequest.product?.name || "not applicable"}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {pRequest.quantity}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {formatDate(pRequest.validity)}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {pRequest.observation
                            ? "Para visualizar, clique em detalhes."
                            : "Não há observações."}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          <Chip
                            label={mapStatus(pRequest.status)}
                            color={
                              (pRequest.status === "open" && "warning") ||
                              (pRequest.status === "in_quote" && "default") ||
                              (pRequest.status === "quoted" && "success") ||
                              "default"
                            }
                          />
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
                        count={pRequests.length}
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
            {pRequests.length === 0 && (
              <Typography
                variant="body1"
                sx={{
                  textAlign: "center",
                  textTransform: "lowercase",
                }}
              >
                não há requisições de compras a serem exibidas.
              </Typography>
            )}
          </Fragment>
        )}
      </Stack>
      <Dialog
        open={isDetailsDialogOpen}
        onClose={hideDetails}
        scroll="paper"
        fullWidth
      >
        <DialogTitle>Detalhes da requisição</DialogTitle>
        <DialogContent>
          {isSearchingByIdAnimation && <CircularIndeterminate />}
          {!isSearchingByIdAnimation && (
            <Stack direction="column" spacing={1}>
              <Box component="div">
                <Typography variant="caption" gutterBottom>
                  Produto
                </Typography>
                <Typography variant="subtitle2">
                  {selectedPRequest?.product?.name || "not applicable"}
                </Typography>
              </Box>
              <Box component="div">
                <Typography variant="caption" gutterBottom>
                  Quantidade
                </Typography>
                <Typography variant="subtitle2">
                  {selectedPRequest?.quantity}
                </Typography>
              </Box>
              <Box component="div">
                <Typography variant="caption" gutterBottom>
                  Validade
                </Typography>
                <Typography variant="subtitle2">
                  {formatDate(selectedPRequest?.validity)}
                </Typography>
              </Box>
              <Box component="div">
                <Typography variant="caption" gutterBottom>
                  Data da Solicitação
                </Typography>
                <Typography variant="subtitle2">
                  {formatDate(selectedPRequest?.createdAt, true)}
                </Typography>
              </Box>
              <Box component="div">
                <Typography variant="caption" gutterBottom>
                  Observação
                </Typography>
                <Typography variant="subtitle2">
                  {selectedPRequest?.observation || "Não há observações."}
                </Typography>
              </Box>
              <Box component="div">
                <Typography variant="caption" gutterBottom>
                  Solicitada por
                </Typography>
                <Typography variant="subtitle2">
                  {selectedPRequest?.user
                    ? `${selectedPRequest.user.firstName} ${selectedPRequest.user.lastName}`
                    : "not applicable"}
                </Typography>
              </Box>
              <Box component="div">
                <Typography variant="caption" gutterBottom>
                  Status
                </Typography>
                <Typography variant="subtitle2">
                  {mapStatus(selectedPRequest?.status)}
                </Typography>
              </Box>
              <Typography variant="h6" gutterBottom>
                Cotações
              </Typography>
              {selectedPRequest?.quotes?.length > 0 && (
                <Table aria-label="quotes table">
                  <TableHead>
                    <TableRow>
                      {user.isAdmin && <TableCell>Ações</TableCell>}
                      <TableCell>Fornecedor</TableCell>
                      <TableCell>Valor</TableCell>
                      <TableCell>Observação</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedPRequest.quotes.map((quotation) => (
                      <TableRow key={quotation.id}>
                        {user.isAdmin && (
                          <TableCell>
                            <IconButton
                              title="Apagar"
                              aria-label="Apagar"
                              onClick={() =>
                                handleDeleteQuotation(quotation.id)
                              }
                              disabled={isDeletingQuotationAnimation.includes(
                                quotation.id
                              )}
                            >
                              {isDeletingQuotationAnimation.includes(
                                quotation.id
                              ) && (
                                <CircularIndeterminate
                                  size={24}
                                  color="inherit"
                                />
                              )}
                              {!isDeletingQuotationAnimation.includes(
                                quotation.id
                              ) && <DeleteIcon />}
                            </IconButton>
                          </TableCell>
                        )}
                        <TableCell>
                          {quotation.supplier?.name || "not applicable"}
                        </TableCell>
                        <TableCell>{brlValue(quotation.price)}</TableCell>
                        <TableCell>
                          {quotation.observation || "Não há observações."}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              {selectedPRequest?.quotes?.length === 0 && (
                <DialogContentText>
                  Não há cotações cadastradas para esta requisição.
                </DialogContentText>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <CancelButton onClick={hideDetails} close />
          <CSVLink
            headers={headers}
            data={prepareDataForCSV(selectedPRequest)}
            filename={`detalhes_requisicao_${selectedPRequest?.id}.csv`}
          >
            <BasicButton startIcon={<DownloadIcon />}>Exportar CSV</BasicButton>
          </CSVLink>
        </DialogActions>
      </Dialog>
      <DeleteDialog
        open={isDeleting}
        onCancel={hideDelete}
        onConfirm={handleDelete}
        isDeletingAnimation={isDeletingAnimation}
      />
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
          <DialogTitle>Novo item</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </DialogContentText>
            <BasicSelect
              required
              name="productId"
              label="Produto"
              value={formData.productId}
              onChange={handleFieldChange}
              error={!!formErrors.productId}
              helperText={formErrors.productId}
            >
              {isSearchingProductsAnimation && (
                <MenuItem disabled>Loading...</MenuItem>
              )}

              {!isSearchingProductsAnimation &&
                products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name}
                  </MenuItem>
                ))}
            </BasicSelect>
            <BasicTextField
              required
              id="quantity"
              name="quantity"
              label="Quantidade"
              type="tel"
              value={formData.quantity}
              onChange={handleFieldChange}
              error={!!formErrors.quantity}
              helperText={formErrors.quantity}
            />
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale="pt-br"
            >
              <DatePicker
                label="Validade"
                value={formData.validity}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    required: true,
                    margin: "dense",
                    fullWidth: true,
                    variant: "standard",
                    error: !!formErrors.validity,
                    helperText: formErrors.validity,
                  },
                }}
              />
            </LocalizationProvider>
            <BasicTextField
              id="observation"
              name="observation"
              label="Observação"
              multiline
              rows={4}
              value={formData.observation}
              onChange={handleFieldChange}
            />
          </DialogContent>
          <DialogActions>
            <CancelButton onClick={hideForm} />
            <SaveButton
              isCreatingAnimation={isCreatingAnimation}
              formMode={formMode}
            />
          </DialogActions>
        </Box>
      </Dialog>
      <QuotationDialog
        open={isQuotationsDialogOpen}
        onClose={hideQuotations}
        id={selectedPRequest?.id}
        onQuotationCreated={find}
      />
      <FeedbackSnackbar
        open={openSnackbar}
        severity={severitySnackbar}
        message={messageSnackbar}
        onClose={() => setOpenSnackbar(false)}
      />
    </AdministrativePanel>
  );
}

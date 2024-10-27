import { Fragment, useState, useEffect } from "react";

import DialogContentText from "@mui/material/DialogContentText";
import TablePagination from "@mui/material/TablePagination";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import { get as getPCategories } from "../../services/productCategoryService";
import CircularIndeterminate from "../../components/CircularIndeterminate";
import AdministrativePanel from "../../layouts/AdministrativePanel";
import FeedbackSnackbar from "../../components/FeedbackSnackbar";
import BasicTextField from "../../components/BasicTextField";
import CancelButton from "../../components/button/Cancel";
import DeleteDialog from "../../components/DeleteDialog";
import BasicButton from "../../components/button/Basic";
import BasicSelect from "../../components/BasicSelect";
import SaveButton from "../../components/button/Save";
import { useAuth } from "../../context/AuthContext";
import BasicCard from "../../components/BasicCard";
import FileInput from "../../components/FileInput";
import {
  create,
  get,
  updateById,
  deleteById,
  deleteImage,
} from "../../services/productService";

export default function Produtos() {
  const { user } = useAuth();

  /* products */
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSearchingAnimation, setIsSearchingAnimation] = useState(false);

  async function find() {
    try {
      setIsSearchingAnimation(true);
      const data = await get();
      setProducts(data);
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

  /* searching product categories */
  const [pCategories, setPCategories] = useState([]);
  const [isSearchingPCategoriesAnimation, setIsSearchingPCategoriesAnimation] =
    useState(false);

  async function findPCategories() {
    try {
      setIsSearchingPCategoriesAnimation(true);
      const data = await getPCategories();
      setPCategories(data);
    } catch (error) {
      handleOpenSnackbar({
        severity: "error",
        message: error.message,
      });
    } finally {
      setIsSearchingPCategoriesAnimation(false);
    }
  }

  useEffect(() => {
    findPCategories();
  }, []);

  /* pagination */
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /* deleting action */
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingAnimation, setIsDeletingAnimation] = useState(false);

  const showDelete = (product) => {
    setSelectedProduct(product);
    setIsDeleting(true);
  };

  const hideDelete = () => {
    setIsDeleting(false);
    setSelectedProduct(null);
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;

    try {
      setIsDeletingAnimation(true);
      await deleteById(selectedProduct.id);
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
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    productCategoryId: "",
  });

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  const handleFileChange = (newFile) => {
    setFile(newFile);
  };

  /* init form errors */
  const [formErrors, setFormErrors] = useState({
    name: "",
    productCategoryId: "",
  });

  const validateForm = () => {
    const errors = {
      // object to store errors
    };

    if (!formData.name) errors.name = "Nome é obrigatório.";
    if (!formData.productCategoryId)
      errors.productCategoryId = "Categoria de Produto é obrigatória.";

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  /* setup form */
  const [formMode, setFormMode] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const dto = new FormData();
    dto.append("name", formData.name);
    dto.append("description", formData.description);
    dto.append("productCategoryId", formData.productCategoryId);
    if (file) {
      dto.append("file", file);
    }

    formMode === "create" ? handleCreate(dto) : handleUpdate(dto);
  };

  const hideForm = () => {
    setFormMode(null);
    setFormData({
      name: "",
      description: "",
      productCategoryId: "",
    });
    setFile(null);
    setFormErrors({
      name: "",
      productCategoryId: "",
    });
    setSelectedProduct(null);
  };

  /* creating action */
  const [isCreatingAnimation, setIsCreatingAnimation] = useState(false);

  const handleCreate = async (dto) => {
    try {
      setIsCreatingAnimation(true);
      await create(dto);
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

  /* updating action */
  const [isUpdatingAnimation, setIsUpdatingAnimation] = useState(false);

  const showUpdate = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      productCategoryId: product.productCategoryId || "",
    });
    setFormMode("update");
  };

  const handleUpdate = async (dto) => {
    if (!selectedProduct) return;

    try {
      setIsUpdatingAnimation(true);
      await updateById(selectedProduct.id, dto);
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

  /* delete image */
  const [isDeletingImage, setIsDeletingImage] = useState(false);

  const handleDeleteImage = async () => {
    if (!selectedProduct) return;

    try {
      setIsDeletingImage(true);
      await deleteImage(selectedProduct.id);
      await find();
      handleOpenSnackbar({
        severity: "success",
        message: "Exclusão bem-sucedida: a imagem foi removida.",
      });
    } catch (error) {
      handleOpenSnackbar({
        severity: "error",
        message: error.message,
      });
    } finally {
      setIsDeletingImage(false);
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

  return (
    <AdministrativePanel>
      <Stack direction="column" spacing={4}>
        {user.isAdmin && (
          <Box component="div" sx={{ width: "100%" }}>
            <BasicButton onClick={() => setFormMode("create")} />
          </Box>
        )}
        {isSearchingAnimation && <CircularIndeterminate />}
        {!isSearchingAnimation && (
          <Fragment>
            {products.length > 0 && (
              <Stack direction="column" spacing={3}>
                {(rowsPerPage > 0
                  ? products.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : products
                ).map((product) => (
                  <BasicCard
                    key={product.id}
                    image={product.imageUrl}
                    title={product.name}
                    caption={product.productCategory?.name || "not applicable"}
                    supporting={product.description}
                    actions={
                      user.isAdmin && (
                        <Stack direction="row" spacing={1}>
                          <Button
                            onClick={() => showUpdate(product)}
                            sx={{ textTransform: "capitalize" }}
                          >
                            Editar
                          </Button>
                          <Button
                            color="error"
                            onClick={() => showDelete(product)}
                            sx={{ textTransform: "capitalize" }}
                          >
                            Apagar
                          </Button>
                        </Stack>
                      )
                    }
                  />
                ))}
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  component="div"
                  count={products.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Stack>
            )}
            {products.length === 0 && (
              <Typography
                variant="body1"
                sx={{
                  textAlign: "center",
                  textTransform: "lowercase",
                }}
              >
                não há produtos cadastrados.
              </Typography>
            )}
          </Fragment>
        )}
      </Stack>
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
              id="name"
              name="name"
              label="Nome"
              value={formData.name}
              onChange={handleFieldChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
            />
            <Typography variant="h6" gutterBottom sx={{ my: 1 }}>
              Mídia
            </Typography>
            <Box
              component="div"
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1,
              }}
            >
              <FileInput
                placeholder={
                  formMode === "update" && selectedProduct?.imageUrl
                    ? "Escolha uma nova imagem (substitui a atual) ou exclua-a"
                    : "Selecione uma imagem"
                }
                value={file}
                onChange={handleFileChange}
              />
              {selectedProduct?.imageUrl && (
                <IconButton
                  size="small"
                  title="Remover imagem"
                  aria-label="Remover imagem"
                  onClick={handleDeleteImage}
                  disabled={isDeletingImage}
                >
                  {!isDeletingImage && <CloseIcon />}
                  {isDeletingImage && (
                    <CircularIndeterminate size={16} color="inherit" />
                  )}
                </IconButton>
              )}
            </Box>
            <Typography variant="caption" color="text.secondary" gutterBottom>
              O arquivo deve ser uma imagem no formato PNG, JPEG ou JPG, com no
              máximo 1MB.
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ my: 1 }}>
              Informações
            </Typography>
            <BasicTextField
              id="description"
              name="description"
              label="Descrição"
              value={formData.description}
              onChange={handleFieldChange}
            />
            <BasicSelect
              required
              name="productCategoryId"
              label="Categoria de Produto"
              value={formData.productCategoryId}
              onChange={handleFieldChange}
              error={!!formErrors.productCategoryId}
              helperText={formErrors.productCategoryId}
            >
              {isSearchingPCategoriesAnimation && (
                <MenuItem disabled>Loading...</MenuItem>
              )}
              {!isSearchingPCategoriesAnimation &&
                pCategories.map((pCategory) => (
                  <MenuItem key={pCategory.id} value={pCategory.id}>
                    {pCategory.name}
                  </MenuItem>
                ))}
            </BasicSelect>
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

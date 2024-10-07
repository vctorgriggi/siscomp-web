import { Fragment, useState, useEffect } from "react";

import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";

import { get as getSuppliers } from "../../../services/supplierService";
import FeedbackSnackbar from "../../../components/FeedbackSnackbar";
import BasicTextField from "../../../components/BasicTextField";
import CancelButton from "../../../components/button/Cancel";
import { create } from "../../../services/quotationService";
import BasicSelect from "../../../components/BasicSelect";
import SaveButton from "../../../components/button/Save";

export default function QuotationDialog({
  open,
  onClose,
  id,
  onQuotationCreated,
}) {
  /* searching suppliers */
  const [suppliers, setSuppliers] = useState([]);
  const [isSearchingSuppliersAnimation, setIsSearchingSuppliersAnimation] =
    useState(false);

  async function findSuppliers() {
    try {
      setIsSearchingSuppliersAnimation(true);
      const data = await getSuppliers();
      setSuppliers(data);
    } catch (error) {
      handleOpenSnackbar({
        severity: "error",
        message: error.message,
      });
    } finally {
      setIsSearchingSuppliersAnimation(false);
    }
  }

  useEffect(() => {
    findSuppliers();
  }, []);

  /* init form data */
  const [formData, setFormData] = useState({
    supplierId: "",
    price: "",
    observation: "",
  });

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  /* init form errors */
  const [formErrors, setFormErrors] = useState({
    supplierId: "",
    price: "",
  });

  const validateForm = () => {
    const errors = {
      // object to store errors
    };

    if (!formData.supplierId) errors.supplierId = "Fornecedor é obrigatório.";
    if (!formData.price) errors.price = "Valor é obrigatório.";

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  /* setup form */
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    handleCreate();
  };

  const hideForm = () => {
    onClose();
    setFormData({
      supplierId: "",
      price: "",
      observation: "",
    });
    setFormErrors({
      supplierId: "",
      price: "",
    });
  };

  /* creating action */
  const [isCreatingAnimation, setIsCreatingAnimation] = useState(false);

  const handleCreate = async () => {
    try {
      setIsCreatingAnimation(true);
      await create({
        purchaseRequestId: id,
        ...formData,
      });
      handleOpenSnackbar({
        severity: "success",
        message: "Nova adição: a cotação foi criada com sucesso.",
      });
      onQuotationCreated();
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
    <Fragment>
      <Dialog open={open} onClose={hideForm} scroll="paper" fullWidth>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          autoComplete="off"
        >
          <DialogTitle>Adicionar cotação</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </DialogContentText>
            <BasicSelect
              required
              name="supplierId"
              label="Fornecedor"
              value={formData.supplierId}
              onChange={handleFieldChange}
              error={!!formErrors.supplierId}
              helperText={formErrors.supplierId}
            >
              {isSearchingSuppliersAnimation && (
                <MenuItem disabled>Loading...</MenuItem>
              )}

              {!isSearchingSuppliersAnimation &&
                suppliers.map((supplier) => (
                  <MenuItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </MenuItem>
                ))}
            </BasicSelect>
            <BasicTextField
              required
              id="price"
              name="price"
              label="Valor"
              type="tel"
              value={formData.price}
              onChange={handleFieldChange}
              error={!!formErrors.price}
              helperText={formErrors.price}
            />
            <Typography variant="caption" color="text.secondary" gutterBottom>
              Caso necessário, utilize o ponto (.) para separar as casas
              decimais ao informar valores.
            </Typography>
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
            <SaveButton isCreatingAnimation={isCreatingAnimation} />
          </DialogActions>
        </Box>
      </Dialog>
      <FeedbackSnackbar
        open={openSnackbar}
        severity={severitySnackbar}
        message={messageSnackbar}
        onClose={() => setOpenSnackbar(false)}
      />
    </Fragment>
  );
}

import DialogContentText from "@mui/material/DialogContentText";
import CircularIndeterminate from "./CircularIndeterminate";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";

import CancelButton from "./button/Cancel";

export default function DeleteDialog(props) {
  return (
    <Dialog open={props.open} onClose={props.onCancel} fullWidth>
      <DialogTitle id="alert-dialog-title">Você tem certeza?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Você realmente deseja excluir este dado? Esse processo não pode ser
          desfeito.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <CancelButton onClick={props.onCancel} />
        <Button
          variant="contained"
          color="error"
          onClick={props.onConfirm}
          disabled={props.isDeletingAnimation}
          sx={{
            minWidth: "150px",
            textTransform: "capitalize",
          }}
        >
          {props.isDeletingAnimation && (
            <CircularIndeterminate size={24} color="inherit" />
          )}
          {!props.isDeletingAnimation && "Sim, excluir"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

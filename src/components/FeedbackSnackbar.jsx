import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function FeedbackSnackbar(props) {
  return (
    <Snackbar
      open={props.open}
      autoHideDuration={6000}
      onClose={props.onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
    >
      <Alert
        onClose={props.onClose}
        severity={props.severity}
        sx={{ width: "100%" }}
      >
        {props.message} {/* note: maybe I'll change this to children */}
      </Alert>
    </Snackbar>
  );
}

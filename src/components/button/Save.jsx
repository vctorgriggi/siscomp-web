import Button from "@mui/material/Button";

import CircularIndeterminate from "../CircularIndeterminate";

export default function Save(props) {
  return (
    <Button
      variant="contained"
      type="submit"
      onClick={props.onClick}
      disabled={props.isCreatingAnimation || props.isUpdatingAnimation}
      sx={{
        minWidth: "150px",
        textTransform: "capitalize",
      }}
    >
      {(props.isCreatingAnimation || props.isUpdatingAnimation) && (
        <CircularIndeterminate size={24} color="inherit" />
      )}
      {!props.isCreatingAnimation &&
        !props.isUpdatingAnimation &&
        (props.formMode === "update" ? "Salvar mudanças" : "Adicionar à lista")}
    </Button>
  );
}

import Button from "@mui/material/Button";

export default function Cancel(props) {
  return (
    <Button
      variant="outlined"
      onClick={props.onClick}
      sx={{ textTransform: "capitalize" }}
    >
      {props.close ? "Fechar" : "Cancelar"}
    </Button>
  );
}

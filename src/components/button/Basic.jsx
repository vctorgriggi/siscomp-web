import Button from "@mui/material/Button";

export default function Basic(props) {
  return (
    <Button
      fullWidth={props.fullWidth}
      variant="contained"
      type={props.type}
      startIcon={props.startIcon}
      onClick={props.onClick}
      disabled={props.disabled}
      sx={{
        textTransform: "capitalize",
        ...props.sx,
      }}
    >
      {props.children || "Criar novo item"}
    </Button>
  );
}

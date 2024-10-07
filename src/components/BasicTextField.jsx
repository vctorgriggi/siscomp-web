import TextField from "@mui/material/TextField";

export default function BasicTextField(props) {
  return (
    <TextField
      required={props.required}
      id={props.id}
      label={props.label}
      name={props.name}
      fullWidth
      margin="dense"
      variant="standard"
      multiline={props.multiline}
      rows={props.rows}
      type={props.type || "text"}
      value={props.value}
      onChange={props.onChange}
      autoFocus={props.autoFocus}
      autoComplete={props.autoComplete || "off"}
      error={props.error}
      helperText={props.helperText}
    />
  );
}

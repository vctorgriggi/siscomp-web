import AttachFileIcon from "@mui/icons-material/AttachFile";
import InputAdornment from "@mui/material/InputAdornment";
import { MuiFileInput } from "mui-file-input";

export default function FileInput(props) {
  return (
    <MuiFileInput
      fullWidth
      margin="dense"
      variant="standard"
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}
      disabled={props.disabled}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <AttachFileIcon fontSize="small" />
          </InputAdornment>
        ),
      }}
    />
  );
}

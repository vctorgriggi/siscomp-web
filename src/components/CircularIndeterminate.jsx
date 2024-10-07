import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function CircularIndeterminate(props) {
  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        justifyContent: "center",
        ...props.sx,
      }}
    >
      <CircularProgress size={props.size} color={props.color} />
    </Box>
  );
}

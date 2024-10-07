import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

export default function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"© "}
      {new Date().getFullYear()}
      {" Siscomp, desenvolvido com ❤️ por "}
      <Link
        color="inherit"
        href="https://br.linkedin.com/in/victorgriggi"
        target="_blank"
        rel="noopener noreferrer"
      >
        Victor Griggi
      </Link>
      {"."}
    </Typography>
  );
}

import {IconButton, Snackbar} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ErrorSnackBar = ({msg, setMsg}) => {
  return (
    <Snackbar
      open={!!msg}
      autoHideDuration={3000}
      message={`Error: ${msg}`}
      action={
        <IconButton
          aria-label="close"
          color="inherit"
          sx={{ p: 0.5 }}
          onClick={() => setMsg("")}
        >
          <CloseIcon />
        </IconButton>
      }
    />
  )
}

export default ErrorSnackBar
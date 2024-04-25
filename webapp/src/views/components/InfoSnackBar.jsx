import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Snackbar } from "@mui/material";

const ErrorSnackBar = ({ msg, setMsg }) => {
    return (
        <Snackbar
            open={!!msg}
            autoHideDuration={2000}
            message={`Info: ${msg}`}
            action={
                <IconButton
                    aria-label="close"
                    color="inherit"
                    sx={{ p: 0.5 }}
                    onClick={() => setMsg('')}
                >
                    <CloseIcon />
                </IconButton>
            }
            onClose={() => setMsg('')}
        />
    )
}

export default ErrorSnackBar
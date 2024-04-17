import { Container } from "@mui/material";
import ProtectedComponent from "./components/ProtectedComponent";


export default function Social() {
    return (
        <ProtectedComponent>
            <Container
                component="main"
                sx={{
                    marginTop: 4,
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr"
                }}
            >
                <h1>SOCIAL</h1>

            </Container>
        </ProtectedComponent>
    )
}
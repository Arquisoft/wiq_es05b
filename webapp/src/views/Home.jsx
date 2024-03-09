import Container from "@mui/material/Container";
import { Button } from "@mui/material";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from '../media/logoL.svg';

function Home() {

    return (
        <Fragment>

            <Container style={{
                position: "absolute",
                height: "fit-content",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                justifySelf: "center",
                transform: "translate(-50%, -50%)",
                left: "50%",
                top: "50%"
            }}
            >
                <Container className="svg-container" style={{ textAlign: "center", margin: "1rem" }}>
                    <Logo style={{ width: '75%', height: '75%' }} />
                </Container>

                <Container>
                    <Button
                        variant="contained"
                        style={{ margin: "1rem", width: "10em", height: "4em" }}
                        component={Link}
                        to="/login"
                    >
                        Play
                    </Button>
                </Container>

                <Container>
                    <Button
                        variant="contained"
                        style={{ margin: "1rem", width: "20em", height: "4em" }}
                        color="darkGreen"
                        component={Link}
                        to="/menu"
                    >
                        Play without an account
                    </Button>
                </Container>


            </Container>
        </Fragment>
    )
}

export default Home;
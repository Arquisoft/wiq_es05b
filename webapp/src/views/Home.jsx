import { Button, Container } from "@mui/material";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../media/logoM.svg";

function Home() {
  return (
    <>
      <Container
        style={{
          position: "absolute",
          height: "fit-content",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          justifySelf: "center",
          transform: "translate(-50%, -50%)",
          left: "50%",
          top: "50%",
        }}
      >
        <Container
          className="svg-container"
          style={{ textAlign: "center", margin: "0rem" }}
        >
          <Logo style={{ width: "40%" }} />
        </Container>

        <Container>
          <Button
            variant="contained"
            style={{ margin: "1rem", width: "10em", height: "4em" }}
            component={Link}
            to="/menu"
          >
            Play
          </Button>
        </Container>
      </Container>
    </>
  );
}

export default Home;

import {Button, Container, Paper, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import axios from 'axios';
import { Fragment, useEffect, useState } from "react";
import ProtectedComponent from "./components/ProtectedComponent";

const buttonConfig = {
    width: "9rem",
    height: "5rem",
}

const buttonGroup = {display: "flex", justifyContent: "space-evenly", margin: "1rem 0"}

const MyButton = ({text, link}) => {
    return (
        <Button variant="contained" sx={buttonConfig} component={Link} to={link} >{text}</Button>
    )
}

export default function GameMenu () {

    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
    const [categories, setCategories] = useState([])

    const getCategories = async () => {
        try {
          const response = await axios.get(`${apiEndpoint}/categories`);
          setCategories(response.data);
        } catch (error) {
          setCategories(['Service down Whoops! :('])
        }
      };

    useEffect(() => {
        getCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Fragment>
            <ProtectedComponent />
            <Container component="main" maxWidth="md" sx={{ marginTop: 4, display: "flex", flexDirection: {xs:"row", md:"column"} }}>
                <Paper elevation={3} sx={{margin: "2rem 0", padding: "1rem", textAlign: "center"}}>
                    <Typography variant="h3" component="p" sx={{marginBottom: "2rem"}}>
                        Menu
                    </Typography>
                    {/* <Container>
                        <Typography variant="h5" component="p">
                            Options
                        </Typography>
                        <Container sx={buttonGroup}>
                            <MyButton text="Time" />
                            <MyButton text="Custom" />
                        </Container>
                    </Container> */}
                    <Container>
                        <Typography variant="h5" component="p">Choose a category to play</Typography>
                        <Container sx={buttonGroup}>
                            {categories.map((category) => (
                                <MyButton text={category} link={"/game/" + category} />
                            ))}
                        </Container>
                    </Container>
                </Paper>
            </Container>
        </Fragment>
    )
}
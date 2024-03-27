import {Button, Container, Paper, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import axios from 'axios';
import { useEffect, useState } from "react";
import ProtectedComponent from "./components/ProtectedComponent";

const buttonConfig = {
    width: "9rem",
    height: "5rem",
}

const buttonGroup = {
    display: "flex",
    flexFlow: "row wrap",
    justifyContent: "space-evenly",
    margin: "1rem 0",
    gap: "1rem"
}

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const MyButton = ({text, link}) => <Button variant="contained" sx={buttonConfig} component={Link} to={link} >{text}</Button>

const Buttons = ({categories}) => {
    if (!categories || categories.length === 0)
        return (
            <Typography variant="h6" component="p" sx={{margin: "1rem"}}>
                The service seems to be down, please try again later.
            </Typography>
        )
    return (
        <Container>
            <Typography variant="h5" component="p">Choose a category to play</Typography>
            <Container sx={buttonGroup}>
                {categories.map((category, i) => (
                    <MyButton key={i} text={category} link={"/game/" + category} />
                ))}
            </Container>
        </Container>
    )
}

const getCategories = async () => {
    let categories = undefined
    try {
        let response = await axios.get(`${apiEndpoint}/categories`)
        categories = response.data
    } catch (error) {}
    return categories
};

const categories = await getCategories()

export default function GameMenu () {
    
    return (
        <>
            <ProtectedComponent />
            <Container component="main" maxWidth="md" sx={{ marginTop: 4, display: "flex", flexDirection: {xs:"row", md:"column"} }}>
                <Paper elevation={3} sx={{margin: "2rem 0", padding: "1rem", textAlign: "center"}}>
                    <Typography variant="h3" component="p" sx={{marginBottom: "2rem"}}>
                        Menu
                    </Typography>
                    <Buttons categories={categories} />
                </Paper>
            </Container>
        </>
    )
}
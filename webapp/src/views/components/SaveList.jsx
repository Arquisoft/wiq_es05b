import {Container, List, ListItem, ListItemText, Pagination} from "@mui/material";

const Save = ({save}) => {
  return (
    <ListItem button secondaryAction={<ListItemText primary="10" secondary="Points" />}>
      <ListItemText primary={save.category} secondary={new Date().getFullYear()}/>
    </ListItem>
  )
}

const SaveList = () => {
  return (
    <Container sx={{display:"flex", flexFlow: "column", alignItems: "stretch"}}>
      <List>
        {
          Array.from({length: 10}).map((_, i) => <Save key={`save${i}`} save={{category: `Categoria ${i}`}}/>)
        }
      </List>
      <Pagination count={10} color="primary" showFirstButton showLastButton sx={{alignSelf: "center"}}/>
    </Container>
  )
}

export default SaveList;
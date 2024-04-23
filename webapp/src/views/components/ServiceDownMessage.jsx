import { Container, Typography } from "@mui/material";
import {LocaleContext} from "../context/LocaleContext";
import {useContext} from "react";

const ServiceDownMessage = ({ grave, code, reason }) => {
  const { t } = useContext(LocaleContext)
  return (
    <Container sx={{display: "flex", flexFlow: "column", textAlign: "center"}}>
      <img src={grave} alt="Grave" style={{width:"40%", alignSelf: "center"}} />
      <Typography variant="h6" component="p" sx={{ margin: "1rem" }}>
        {t("error_service_down_page_msg")}
      </Typography>
      {(reason && <Typography variant="subtitle1" component="p">
        {code || t("error_reason")}: {reason}
      </Typography>)}
    </Container>
  );
};

export default ServiceDownMessage;

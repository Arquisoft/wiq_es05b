import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';

// TODO - Move to <Custom Form>
const SuggestionText = ({text, linkText, link}) => {

    return (
        <Typography variant="body2" sx={{ marginTop: 2 }}>
          {text} <Link to={link}>{linkText}</Link>
        </Typography>
    )
}

export default SuggestionText;
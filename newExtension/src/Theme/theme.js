import { createTheme } from "@mui/material";

const PRIMARY='#03DAC6'
const SECONDARY='#7e57c2'
const theme=createTheme({
    palette:{
        primary:{
            main:PRIMARY
        },
        secondary:{
            main:SECONDARY
        }
    },
    typography:{
        fontF:'Roboto'
    }
})
export default theme
import { makeStyles } from "@mui/styles";

export default makeStyles((theme) => ({
  mainContainer: {
    maxHeight: 460,
    overflow: "auto",
    overflowY: "auto",
    margin: 0,
    padding: 0,
    listStyle: "none",
    height: "100%",
    "&::-webkit-scrollbar": {
      width: "0.2em",
    },
    "&::-webkit-scrollbar-track": {
      boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
      webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0,0,0,.1)",
    },
  },
  item: {
    marginBottom: "0.5rem !important",
  },
  subContainer: {
    minWidth: "50%",
    [theme.breakpoints.down("sm")]: {
      minWidth: "100%",
    },
  },
}));

import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { Grid } from "@mui/material";
import Input from "../../common/Input/Input.jsx";
import DashboardStyles from "../DashboardStyles";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { ethers } from "ethers";
import { NODE_URL } from "../../services/helper/config.js";
import { useEffect } from "react";
import abi from "../../utils/erc20.abi.json";
import { useSnackbar } from "notistack";
import { addCustomToken } from "../../redux/projects/projectSlice.js";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ImportTokens = ({ open, handleClose }) => {
  const provider = new ethers.providers.JsonRpcProvider(NODE_URL);
  const styles = DashboardStyles();
  const dispatch = useDispatch();
  const { tokenContractAddress: tokenFromState,walletAddress } = useSelector(
    (state) => state?.project
  );
  const { enqueueSnackbar } = useSnackbar();
  const [tokenContractAddress, setTokenContractAddress] = useState("");
  const [tokenPayload, setTokenPayload] = useState({
    tokenDecimal: "",
    tokenSymbol: "",
    balance: "",
    address: tokenContractAddress,
  });

  const [contractFound, setContractFound] = useState(null);
  const [error, setError] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  let contract = null;

  const onChange = (e) => {
    setError(false);
    setShowMessage(false);
    switch (e.target.name) {
      case "tokenContractAddress":
        setTokenContractAddress(e.target.value);
        break;
      case "tokenSymbol":
        setTokenPayload({
          ...tokenPayload,
          tokenSymbol: e.target.value,
        });
        break;
      case "tokenDecimal":
        setTokenPayload({
          ...tokenPayload,
          tokenDecimal: e.target.value,
        });
        break;
      default:
        break;
    }
  };

  useEffect(async () => {
    if (tokenContractAddress?.length) {
      try {
        contract = new ethers.Contract(
          tokenContractAddress ? tokenContractAddress : "",
          abi,
          provider
        );
        setContractFound(contract);
        const decimals = await contract.decimals();
        const symbol = await contract.symbol();
        const balance = await contract.balanceOf(walletAddress);
        console.log(balance, "balanceeeee");
        setTokenPayload({
          tokenDecimal: decimals,
          tokenSymbol: symbol,
          balance: balance,
          address: contract.address,
        });
      } catch (error) {
        console.log("found error vicky!");
        setError(true);
      }
    } else {
      setError(true);
    }
  }, [tokenContractAddress]);

  const handleAddToken = () => {
    try {
      if (error) {
        return enqueueSnackbar("Not a valid contract address", {
          variant: "error",
        });
      } else {
        let tokenExists = tokenFromState?.filter(
          (token) => token.address === tokenContractAddress
        );
        console.log("hey bro", tokenExists);
        console.log("error", error);
        if (!tokenExists.length || (tokenExists === undefined && !error)) {
          console.log(tokenPayload, "tokenPayload");
          handleClose();
          dispatch(addCustomToken({ data: tokenPayload }));
          setContractFound(null);
          setTokenContractAddress("");
          setTokenPayload({
            tokenDecimal: "",
            tokenSymbol: "",
            balance: "",
          });
          enqueueSnackbar("Token added successfully", { variant: "success" });
        } else {
          enqueueSnackbar("Token already exists", { variant: "error" });
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    console.log(tokenFromState, "tokenFromState");
  }, [tokenFromState]);
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      PaperProps={{
        style: {
          backgroundColor: "#2c2d30",
        },
      }}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => {
              handleClose();
              contract = null;
              setTokenContractAddress("");
              setContractFound(null);
              setTokenPayload({
                tokenDecimal: "",
                tokenSymbol: "",
                balance: "",
              });
            }}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Grid container justifyContent="center">
        <Grid item style={{ minWidth: "20rem" }}>
          <Grid container direction="column">
            <Grid item style={{ marginTop: "1rem", marginBottom: "1rem" }}>
              <Typography variant="h5" color="gainsboro" align="center">
                Import Tokens
              </Typography>
            </Grid>
            <Grid item style={{ marginBottom: "1rem" }}>
              <Input
                name="tokenContractAddress"
                label=""
                placeholder="Token Contract Address"
                value={tokenContractAddress}
                onChange={onChange}
                type="text"
              />
            </Grid>
            <Grid item style={{ marginBottom: "1rem" }}>
              <Input
                name="tokenSymbol"
                label=""
                placeholder="Token Symbol"
                value={tokenPayload.tokenSymbol}
                onChange={onChange}
                type="text"
                disabled={true}
              />
            </Grid>
            <Grid item style={{ marginBottom: "1rem" }}>
              <Input
                name="tokenDecimal"
                label=""
                placeholder="Token Decimal"
                value={tokenPayload.tokenDecimal}
                onChange={onChange}
                type="text"
                disabled={true}
              />
            </Grid>
            <Grid item>
              <Typography align="center">
                <Button
                  variant="contained"
                  onClick={() => {
                    handleAddToken();
                  }}
                >
                  Add Token
                </Button>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
  );
};
export default ImportTokens;

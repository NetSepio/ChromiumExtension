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
import Loader from "../../common/Loader.js";



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SendTokenDialogue = ({ open, handleClose }) => {
  const { walletAddress: sendersAddress, privateKey } = useSelector(
    (state) => state?.project
  );
  const provider = new ethers.providers.JsonRpcProvider(NODE_URL);
  const signer = new ethers.Wallet(privateKey, provider);

  const styles = DashboardStyles();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();
  const [tokenPayload, setTokenPayload] = useState({
    walletAddress: "",
    amount: "",
  });

  const onChange = (e) => {
    switch (e.target.name) {
      case "walletAddress":
        setTokenPayload({
          ...tokenPayload,
          walletAddress: e.target.value,
        });
        break;
      case "amount":
        setTokenPayload({
          ...tokenPayload,
          amount: e.target.value,
        });
        break;
      default:
        break;
    }
  };

  const handleClick = async () => {
    if (
      tokenPayload.walletAddress?.length === 0 ||
      tokenPayload.amount.length === 0
    ) {
      setLoading(false);
      return null;
    }
    setLoading(true);
    const transactionParameters = {
      from: sendersAddress,
      to: tokenPayload.walletAddress,
      data: "0x",
      value: ethers.utils.parseEther(tokenPayload.amount),
      // gasLimit: ethers.utils.hexlify(10000),
      // gasPrice: ethers.utils.hexlify(parseInt(await provider.getGasPrice())),
    };
    await signer
      .sendTransaction(transactionParameters)
      .then((transaction) => {
        if (transaction) {
          // setWalletAddress("");
          // setAmount("");
          handleClose();
          setTokenPayload({
            walletAddress: "",
            amount: "",
          });
          setLoading(false);
          enqueueSnackbar("Transaction successfull", {
            variant: "success",
          });
        }
      })
      .catch((err) => {
        setLoading(false);
        enqueueSnackbar("Transaction failed", {
          variant: "error",
        });
        return;
      });
  };

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
      {loading && <Loader/>}
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="close"
            onClick={handleClose}
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
                Send Tokens
              </Typography>
            </Grid>
            <Grid item style={{ marginBottom: "1rem" }}>
              <Input
                name="walletAddress"
                label=""
                placeholder="Wallet Address"
                value={tokenPayload.walletAddress}
                onChange={onChange}
                type="text"
              />
            </Grid>
            <Grid item style={{ marginBottom: "1rem" }}>
              <Input
                name="amount"
                label=""
                placeholder="Amount"
                value={tokenPayload.amount}
                onChange={onChange}
                type="text"
              />
            </Grid>
            <Grid item>
              <Typography align="center">
                <Button
                  variant="contained"
                  onClick={() => {
                    handleClick();
                  }}
                >
                  Send Token
                </Button>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
  );
};
export default SendTokenDialogue;

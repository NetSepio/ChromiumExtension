import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { Grid, CircularProgress } from "@mui/material";
import Input from "../../../common/Input/Input.jsx";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { ethers } from "ethers";
import { NODE_URL } from "../../../services/helper/config.js";
import abi from "../../../utils/erc20.abi.json";
import { useSnackbar } from "notistack";
import { parseUnits } from "ethers/lib/utils.js";
import { editCustomToken } from "../../../redux/projects/projectSlice.js";
import LoadingButton from "@mui/lab/LoadingButton";
import Styles from "../styles";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AssetsSend = ({ open, handleClose, addr }) => {
  const styles = Styles();
  const { privateKey, walletAddress } = useSelector((state) => state?.project);
  const { enqueueSnackbar } = useSnackbar();
  const provider = new ethers.providers.JsonRpcProvider(NODE_URL);
  const signer = new ethers.Wallet(privateKey, provider);
  let contract = new ethers.Contract(addr ? addr : "", abi, signer);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

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
    let validAddress = ethers.utils.isAddress(tokenPayload.walletAddress);
    if (!validAddress) {
      return enqueueSnackbar("Please enter a valid address", {
        variant: "error",
      });
    }
    if (tokenPayload.amount.length === 0) {
      return enqueueSnackbar("Please enter a valid amount", {
        variant: "error",
      });
    }
    try {
      setLoading(true);
      enqueueSnackbar("Transaction in progress", { variant: "info" });
      // console.log(contract, "cont");
      // How many tokens?
      let numberOfTokens = ethers.utils.parseUnits(tokenPayload.amount, 18);
      // Send tokens
      let approved = await contract.approve(
        tokenPayload.walletAddress,
        numberOfTokens
      );
      if (numberOfTokens && approved) {
        let nonce = await signer.getTransactionCount();
        let tx = await contract.transfer(
          tokenPayload.walletAddress,
          parseUnits(tokenPayload.amount),
          {
            nonce: nonce,
            gasLimit: 77709,
            maxFeePerGas: 32641054095,
            maxPriorityFeePerGas: 32641054085,
          }
        );
        if (tx) {
          try {
            let wait = await tx.wait();
            if (wait) {
              setLoading(false);
              enqueueSnackbar("Transaction success", { variant: "success" });
              setTokenPayload({
                walletAddress: "",
                amount: "",
              });
              const decimals = await contract.decimals();
              const symbol = await contract.symbol();
              const balance = await contract.balanceOf(walletAddress);
              dispatch(
                editCustomToken({
                  data: {
                    tokenDecimal: decimals,
                    tokenSymbol: symbol,
                    balance: balance,
                    address: contract.address,
                  },
                })
              );
            }
          } catch (error) {
            setLoading(false);
            // console.log(error);
          }
        }
      }
    } catch (error) {
      setLoading(false);
      enqueueSnackbar("Something went wrong", { variant: "error" });
    }
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
      {/* {loading && <Loader />} */}
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
                Send Token
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
                type="number"
              />
            </Grid>
            <Grid item>
              <Grid container justifyContent="center">
                <Typography>
                  {!loading ? (
                    <Button
                      variant="contained"
                      onClick={() => {
                        handleClick();
                      }}
                    >
                      Send Token
                    </Button>
                  ) : (
                    <LoadingButton
                      loading={loading}
                      variant="contained"
                      color="primary"
                      disabled={false}
                      loadingIndicator={
                        <CircularProgress color="primary" size={20} />
                      }
                      style={{
                        minHeight: 36,
                        minWidth: 120,
                      }}
                    />
                  )}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
  );
};
export default AssetsSend;

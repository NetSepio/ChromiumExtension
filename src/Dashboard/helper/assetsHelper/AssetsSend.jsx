import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { Grid } from "@mui/material";
import Input from "../../../common/Input/Input.jsx";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { ethers } from "ethers";
import { NODE_URL } from "../../../services/helper/config.js";
import abi from "../../../utils/erc20.abi.json";
import { useSnackbar } from "notistack";
import Loader from "../../../common/Loader.js";
import { useEffect } from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AssetsSend = ({ open, handleClose, addr }) => {
  const { privateKey, walletAddress } = useSelector((state) => state?.project);
  const provider = new ethers.providers.JsonRpcProvider(NODE_URL);
  const signer = new ethers.Wallet(privateKey, provider);
  let contract = new ethers.Contract(addr ? addr : "", abi, signer);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  //   const { enqueueSnackbar } = useSnackbar();
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
    console.log(contract, "cont");
    // How many tokens?
    let numberOfTokens = ethers.utils.parseUnits(tokenPayload.amount, 18);
    console.log(`numberOfTokens: ${numberOfTokens}`);
    // Send tokens
    let options = {
      gasLimit: 1500000,
      gasPrice: ethers.utils.parseUnits("1.5", "gwei"),
    };

    if (numberOfTokens) {
      // contract
      //   .transfer(tokenPayload.walletAddress, numberOfTokens)
      //   .then((transferResult) => {
      //     console.dir(transferResult);
      //     alert("sent token");
      //   });
      contract
        .transferFrom(
          walletAddress,
          tokenPayload.walletAddress,
          numberOfTokens,
          options
        )
        .then(function (tx) {
          console.log(tx);
        });
    }


  };

  useEffect(() => {}, [tokenPayload]);

  const send_token = async (
    contract_address,
    send_token_amount,
    to_address,
    send_account
  ) => {
    provider.getGasPrice().then((currentGasPrice) => {
      let gas_price = ethers.utils.hexlify(parseInt(currentGasPrice));
      console.log(`gas_price: ${gas_price}`);

      if (contract_address) {
        // How many tokens?
        let numberOfTokens = ethers.utils.parseUnits(send_token_amount, 18);
        console.log(`numberOfTokens: ${numberOfTokens}`);

        // Send tokens
        contract.transfer(to_address, numberOfTokens).then((transferResult) => {
          console.dir(transferResult);
          alert("sent token");
        });
      } // ether send
      else {
        const tx = {
          from: send_account,
          to: to_address,
          value: ethers.utils.parseEther(send_token_amount),
          nonce: window.ethersProvider.getTransactionCount(
            send_account,
            "latest"
          ),
          gasLimit: ethers.utils.hexlify(gas_limit), // 100000
          gasPrice: gas_price,
        };
        console.dir(tx);
        try {
          signer.sendTransaction(tx).then((transaction) => {
            console.dir(transaction);
            alert("Send finished!");
          });
        } catch (error) {
          alert("failed to send!!");
        }
      }
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
      {loading && <Loader />}
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
                Send
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
export default AssetsSend;

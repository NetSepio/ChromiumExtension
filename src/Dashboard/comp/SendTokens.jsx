import React, { useState } from "react";
import {
  Grid,
  Typography,
  Button,
  Divider,
  IconButton,
  useTheme,
  Tooltip,
} from "@mui/material";
import Input from "../../common/Input/Input.jsx";
import { useSnackbar } from "notistack";
import SendTokenStyles from "../styles/SendTokenStyles";
import { NODE_URL } from "../../services/helper/config.js";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import Loader from "../../common/Loader";
import abi from "../../utils/erc20.abi.json";
import CustomTabs from "../helper/CustomTabs.jsx";
import ImportTokens from "../helper/ImportTokens.jsx";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import SwapHorizontalCircleOutlinedIcon from "@mui/icons-material/SwapHorizontalCircleOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { shortenAddress } from "../../utils/commonUtils.js";
import SendTokenDialogue from "../helper/SendTokenDialogue.jsx";
import { CopyToClipboard } from "react-copy-to-clipboard";

const SendTokens = () => {
  const classes = SendTokenStyles();
  const theme = useTheme();
  // tabs
  const [value, setValue] = React.useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  //
  //import Tokens
  const [open, setOpen] = useState(false);
  const [openSendTokenDialogue, setOpenSendTokenDialogue] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseTokenDialogue = () => {
    setOpenSendTokenDialogue(false);
  };
  //

  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [usersBalance, setUsersBalance] = useState("");
  const [amount, setAmount] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const { walletAddress: sendersAddress, privateKey } = useSelector(
    (state) => state?.project
  );
  const provider = new ethers.providers.JsonRpcProvider(NODE_URL);
  provider.getBalance(sendersAddress).then((balance) => {
    // convert a currency unit from wei to ether
    const balanceInEth = ethers.utils.formatEther(balance);
    // console.log(`balance: ${balanceInEth} ETH`);
    setUsersBalance(balanceInEth);
  });
  const signer = new ethers.Wallet(privateKey, provider);
  // let contract = new ethers.Contract(
  //   "0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1",
  //   abi,
  //   provider
  // );
  // console.log(contract, "contract here");

  const handleClick = async () => {
    if (sendersAddress?.length === 0 || amount.length === 0) {
      setLoading(false);
      return null;
    }
    setLoading(true);
    const transactionParameters = {
      from: sendersAddress,
      to: walletAddress,
      data: "0x",
      value: ethers.utils.parseEther(amount),
      // gasLimit: ethers.utils.hexlify(10000),
      // gasPrice: ethers.utils.hexlify(parseInt(await provider.getGasPrice())),
    };
    await signer
      .sendTransaction(transactionParameters)
      .then((transaction) => {
        console.log(transaction, "transaction");
        if (transaction) {
          setWalletAddress("");
          setAmount("");
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

  // const handleTokenImport = async () => {
  //   const val = await contract.decimals();
  //   const symbol = await contract.symbol();
  //   const balance = await contract.balanceOf(contract?.address);
  //   console.log(val, "decimals");
  //   console.log(symbol, "symbol");
  //   console.log(balance, "balance");
  // };

  return (
    <Grid
      container
      direction="column"
      alignItems="flex-start"
      className={classes.mainContainer}
    >
      {loading && <Loader />}
      <Grid container justifyContent="center">
        <Grid item className={classes.subContainer}>
          <Grid item container direction="column" alignItems="center">
            <Grid item sx={{ mb: 1 }}>
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center" }}
              >
                {shortenAddress(sendersAddress)}
                <CopyToClipboard
                  text={sendersAddress}
                  onCopy={() => setIsCopied(true)}
                >
                  <ContentCopyOutlinedIcon
                    color="primary"
                    sx={{ cursor: "pointer", ml: 1 }}
                    fontSize="small"
                  />
                </CopyToClipboard>
              </Typography>
              {isCopied ? (
                <span
                  style={{
                    color: theme.palette.primary.main,
                    position: "absolute",
                    right: 30,
                    top: 54,
                  }}
                >
                  Copied
                </span>
              ) : null}
            </Grid>
            <Grid item sx={{ mb: 1 }}>
              <img
                src="/images/matic-token.png"
                alt="MATIC"
                style={{
                  height: 40,
                  width: 40,
                }}
              />
            </Grid>
            <Grid item sx={{ mb: 3 }}>
              <Typography variant="h4">
                {usersBalance.slice(0, 6)} MATIC
              </Typography>
            </Grid>
            <Grid item container justifyContent="center">
              {/* 1 */}
              <Tooltip title="Coming soon" placement="top">
                <Grid item>
                  <Grid container direction="column">
                    <Grid item>
                      <IconButton
                        color="primary"
                        component="span"
                        style={{
                          backgroundColor: theme.palette.primary.main,
                          color: "#fff",
                        }}
                        disabled
                      >
                        <FileDownloadOutlinedIcon />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <Typography variant="body1" align="center" sx={{ mt: 1 }}>
                        Buy
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Tooltip>
              {/* 2 */}
              <Grid item sx={{ ml: 4 }}>
                <Grid container direction="column">
                  <Grid item>
                    <IconButton
                      color="primary"
                      component="span"
                      style={{
                        backgroundColor: theme.palette.primary.main,
                        color: "#fff",
                      }}
                      onClick={() => setOpenSendTokenDialogue(true)}
                    >
                      <SendOutlinedIcon />
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      Send
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              {/* 3 */}
              <Tooltip title="Coming soon" placement="top">
                <Grid item sx={{ ml: 4 }}>
                  <Grid container direction="column">
                    <Grid item>
                      <IconButton
                        color="primary"
                        component="span"
                        style={{
                          backgroundColor: theme.palette.primary.main,
                          color: "#fff",
                        }}
                        disabled
                      >
                        <SwapHorizontalCircleOutlinedIcon />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        Swap
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Tooltip>
            </Grid>
          </Grid>
          {/* <Grid
            item
            container
            justifyContent="space-between"
            className={classes.item}
            xs={12}
          >
            <Grid item>
              <Typography>Send MATIC</Typography>
            </Grid>
            <Grid item>{usersBalance} MATIC</Grid>
          </Grid>
          <Grid item className={classes.item} xs={12}>
            <Input
              name="url"
              label=""
              placeholder="Wallet Address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
            />
          </Grid>
          <Grid item className={classes.item} xs={12}>
            <Input
              name="url"
              label=""
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography align="center">
              <Button variant="outlined" onClick={handleClick}>
                Send
              </Button>
            </Typography>
          </Grid> */}
          <Grid item container sx={{ mt: 2 }}>
            <Grid item container>
              <CustomTabs value={value} handleChange={handleChange} />
            </Grid>
          </Grid>
          <Grid item xs={12} sx={{ mt: 6 }}>
            <Typography align="center">Dont see your tokens ?</Typography>
            <Grid container justifyContent="center">
              <Typography align="center" sx={{ mt: 2 }}>
                <Button variant="outlined" onClick={() => setOpen(true)}>
                  Import Tokens
                </Button>
              </Typography>
            </Grid>
          </Grid>
          <ImportTokens open={open} handleClose={handleClose} />
          <SendTokenDialogue
            open={openSendTokenDialogue}
            handleClose={handleCloseTokenDialogue}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SendTokens;

// ->take abi from etherscan

// (contractAddress , abi, provider)

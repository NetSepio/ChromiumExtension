import React, { useState } from "react";
import { Grid, Paper } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import DashboardStyles from "../DashboardStyles";
import { ethers } from "ethers";
import DeleteIcon from "@mui/icons-material/Delete";
import abi from "../../utils/erc20.abi.json";
import Loader from "../../common/Loader";
import { useEffect } from "react";
import { removeToken } from "../../redux/projects/projectSlice";
import SendIcon from "@mui/icons-material/Send";
import AssetsSend from "./assetsHelper/AssetsSend.jsx";
import { editCustomToken } from "../../redux/projects/projectSlice";
import { NODE_URL } from "../../services/helper/config";

const Assets = () => {
  const styles = DashboardStyles();
  const dispatch = useDispatch();

  const { privateKey, walletAddress } = useSelector((state) => state?.project);
  const provider = new ethers.providers.JsonRpcProvider(NODE_URL);
  const signer = new ethers.Wallet(privateKey, provider);

  const [loading, setLoading] = useState(false);
  let [activeAddress, setActiveAddress] = useState("");
  const { tokenContractAddress } = useSelector((state) => state?.project);
  const [tokenObj, setTokenObj] = useState(tokenContractAddress);
  // const provider = new ethers.providers.JsonRpcProvider(NODE_URL);
  //
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  //

  useEffect(() => {
    if (tokenContractAddress.length) {
      setTokenObj(tokenContractAddress);
    }
  }, [tokenContractAddress]);

  const handleClick = (recievedToken) => {
    let val = tokenObj.filter(
      (token) => token.address !== recievedToken.address
    );
    dispatch(removeToken({ data: val.length ? val : [] }));
    setTokenObj(val);
  };

  const updateData = async (addr) => {
    console.log(addr,"addraddr")
      let contract = new ethers.Contract(addr ? addr : "", abi, signer);
      const decimals = await contract.decimals();
      const symbol = await contract.symbol();
      const balance = await contract.balanceOf(walletAddress);
      console.log(balance, symbol, decimals, "kdhwkdhwdkhwdkhd");
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

  useEffect(() => {
    if(tokenContractAddress.length){
      tokenContractAddress.map((token) => updateData(token.address));
    }
  }, []);
  return (
    <Grid container direction="column">
      {tokenObj?.map((token, i) => {
        return (
          <Grid
            item
            className={styles.accordionContainer}
            style={{ marginBottom: "0.8rem" }}
            component={Paper}
            elevation={10}
            key={i}
          >
            {loading && <Loader />}
            <Grid container>
              <Grid item container direction="column" xs={9}>
                <Grid item>
                  {token?.balance} {token?.tokenSymbol}
                </Grid>
              </Grid>
              <Grid
                item
                xs={2}
                // onClick={() => handleClick(token)}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  setActiveAddress(token?.address);
                  setOpen(true);
                }}
              >
                <SendIcon color="primary" />
              </Grid>
              <Grid
                item
                xs={1}
                onClick={() => handleClick(token)}
                sx={{ cursor: "pointer" }}
              >
                {/* <ChevronRightOutlinedIcon /> */}
                <DeleteIcon color="primary" />
              </Grid>
            </Grid>
          </Grid>
        );
      })}
      <AssetsSend open={open} handleClose={handleClose} addr={activeAddress} />
    </Grid>
  );
};

export default Assets;

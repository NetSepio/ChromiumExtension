import React, { useState } from "react";
import { Grid, Typography, Paper } from "@mui/material";
import { useSelector } from "react-redux";
import DashboardStyles from "../DashboardStyles";
import { ethers } from "ethers";
import { NODE_URL } from "../../services/helper/config";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import abi from "../../utils/erc20.abi.json";
import Loader from "../../common/Loader";
import { useEffect } from "react";
import { useMemo } from "react";

const Assets = () => {
  const styles = DashboardStyles();
  const [loading, setLoading] = useState(false);
  const { tokenContractAddress } = useSelector((state) => state?.project);
  const provider = new ethers.providers.JsonRpcProvider(NODE_URL);

  return (
    <Grid container direction="column">
      {tokenContractAddress?.map((token) => (
        <Grid
          item
          className={styles.accordionContainer}
          style={{ marginBottom: "0.8rem" }}
          component={Paper}
          elevation={10}
        >
          {loading && <Loader />}
          <Grid container>
            <Grid item container direction="column" xs={11}>
              <Grid item>{parseInt(token?.balance?.hex)} MATIC</Grid>
            </Grid>
            <Grid item xs={1}>
              <ChevronRightOutlinedIcon />
            </Grid>
          </Grid>
        </Grid>
        // <div>Hello</div>
      ))}
    </Grid>
  );
};

export default Assets;

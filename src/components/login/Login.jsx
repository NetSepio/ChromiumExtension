/* eslint-disable */
import {
  Grid,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import LoginStyles from "./LoginStyles";
import Input from "../input/Input.jsx";
import crypto from "crypto-js";
import { useSelector } from "react-redux";
import {
  addMnemonic,
  saveHashedMnemonic,
  savePrivateKey,
  saveToken,
  saveWalletAddress,
} from "../../redux/projects/projectSlice";
import { useDispatch } from "react-redux";
import { ethers } from "ethers";
import Confirm from "../../Dashboard/comp/profile/profileHelper/Confirm.jsx";
import { ProfileService } from "../../services/profileService";
import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router";
import { NODE_URL } from "../../services/helper/config";

const _ProfileService = new ProfileService();
const Login = () => {
  const styles = LoginStyles();
  const history = useHistory();
  const { walletAddress, flow, privateKey } = useSelector(
    (state) => state.project
  );

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);
  const [flag, setFlag] = useState("cancel");
  const [confirmData, setConfirmData] = useState({});
  const [loader, setLoader] = useState(false);

  const myMnemonic = useSelector((state) => state.project.mnemonic);
  const activeStep = useSelector((state) => state.project.activeStep);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checked, setChecked] = React.useState(true);

  const onChange = (e) => {
    switch (e.target.name) {
      case "password":
        setPassword(e.target.value);
        break;
      case "confirmPassword":
        setConfirmPassword(e.target.value);
        break;
      default:
        break;
    }
  };

  const handleChangeChecked = (event) => {
    setChecked(event.target.checked);
  };

  const handleContinue = async (e) => {
    e.stopPropagation();
    try {
      const hashed = crypto.AES.encrypt(myMnemonic, password)?.toString();
      const walletAddress = ethers.Wallet.fromMnemonic(myMnemonic);
      dispatch(saveWalletAddress({ data: walletAddress?.address }));
      dispatch(savePrivateKey({ data: walletAddress?.privateKey }));
      dispatch(addMnemonic({ data: "" }));
      dispatch(saveHashedMnemonic({ data: hashed }));
      const { data } = await _ProfileService.fetchFlowByID(
        walletAddress?.address
      );
      setConfirmData(data?.payload);
      setOpen(true);
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Something went wrong", {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    const grantAccess = async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider(NODE_URL);
        const signer = new ethers.Wallet(privateKey, provider);
        let signatureVal = await signer.signMessage(
          `${confirmData?.eula}${confirmData?.flowId}`
        );
        if (signatureVal) {
          const { data } = await _ProfileService.createToken({
            flowId: confirmData?.flowId,
            signature: signatureVal,
          });
          if (data?.status === 200) {
            dispatch(saveToken(data?.payload));
            dispatch(addMnemonic({ data: "" }));
            enqueueSnackbar("User logged in successfully", {
              variant: "success",
            });
            history.push("/dashboard");
            setLoader(false);
            setFlag("cancel");
            setConfirmData({});
          }
        }
      } catch (error) {
        console.log(error);
        setLoader(false);
        enqueueSnackbar("Something went wrong", {
          variant: "error",
        });
      }
    };
    if (flag === "move") {
      grantAccess();
    } else {
      setLoader(false);
    }
  }, [flag]);

  return (
    <Grid container direction="column">
      <Grid item style={{ marginBottom: "0.45rem" }}>
        <Typography variant="h5" align="center" style={{ color: "#fff" }}>
          Create a password
        </Typography>
      </Grid>
      <Grid item className={styles.item}>
        <Typography
          variant="body1"
          align="center"
          style={{ opacity: 0.5, color: "#fff" }}
        >
          You will use this to unlock your wallet
        </Typography>
      </Grid>
      <Grid item className={styles.item}>
        <Input
          label="Password"
          name="password"
          value={password}
          onChange={onChange}
          type="password"
        />
      </Grid>
      <Grid item className={styles.item}>
        <Input
          label="Confirm Password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={onChange}
          type="password"
        />
      </Grid>
      <Grid item className={styles.item}>
        <FormControlLabel
          label={
            <p style={{ color: "#999999" }}>
              I agree to the
              <label style={{ color: "#8a81f8", marginLeft: 8 }}>
                Terms of Service
              </label>
            </p>
          }
          control={
            <Checkbox checked={checked} onChange={handleChangeChecked} />
          }
        />
      </Grid>

      <Grid item className={styles.item} xs={12}>
        <Button
          variant="contained"
          color="primary"
          style={{ width: "100%", textTransform: "capitalize" }}
          onClick={handleContinue}
          disabled={
            password.length < 6 || confirmPassword.length < 6 || !checked
          }
        >
          Continue
        </Button>
      </Grid>
      <Confirm
        open={open}
        setOpen={setOpen}
        flag={flag}
        setFlag={setFlag}
        confirmData={confirmData}
        setLoader={setLoader}
      />
    </Grid>
  );
};

export default Login;

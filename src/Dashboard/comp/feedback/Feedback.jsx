import React from "react";
import { Button, Grid, Typography } from "@mui/material";
import Rating from "@mui/material/Rating";
import { useState } from "react";
import { ProfileService } from "../../../services/profileService";
import Loader from "../../../common/Loader";
import { useSnackbar } from "notistack";

const _ProfileService = new ProfileService();
const Feedback = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [value, setValue] = React.useState(2);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFeedback = async () => {
    try {
      setLoading(true);
      const feed = await _ProfileService.sendFeedback({
        feedback: feedback,
        rating: value,
      });
      if (feed) {
        setLoading(false);
        setFeedback("");
        setValue(2);
        const { message } = feed;
        enqueueSnackbar(message ? message : "Feedback added", {
          variant: "success",
        });
      }
    } catch (error) {
      setLoading(false);
      enqueueSnackbar("Something went wrong", { variant: "error" });
    }
  };
  return (
    <Grid container>
      {loading && <Loader />}
      <Grid
        item
        container
        alignItems="center"
        justifyContent="space-between"
        style={{ marginBottom: "1rem" }}
      >
        <label>How satisfied were you ?</label>
        <Rating
          name="simple-controlled"
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        />
      </Grid>
      <Grid item container>
        <Grid item xs={12}>
          Write to us
        </Grid>
        <Grid item xs={12}>
          <textarea
            style={{
              width: "90%",
              backgroundColor: "#181818",
              color: "#fff",
              borderRadius: 8,
              resize: "none",
              marginTop: 10,
              padding: 10,
            }}
            rows={10}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography align="center">
          <Button variant="contained" onClick={handleFeedback}>
            Submit
          </Button>
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Feedback;

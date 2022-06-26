import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Assets from "./Assets.jsx";
import Activity from "./Activity.jsx";

const CustomTabs = ({ value, handleChange }) => {
  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value} >
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example" variant="fullWidth">
            <Tab label="Assets" value="1" />
            <Tab label="Activity" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Assets />
        </TabPanel>
        <TabPanel value="2">
          <Activity />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default CustomTabs;

//   const [value, setValue] = React.useState("1");

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

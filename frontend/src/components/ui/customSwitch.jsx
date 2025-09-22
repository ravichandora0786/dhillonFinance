/**
 * custom Switch toogle
 */
import { useState } from "react";
import { Switch } from "@mui/material";

const CustomSwitch = ({ name, checked, onChange = () => {}, disabled }) => {
  return (
    <Switch
      name={name}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      label={checked ? "Active" : "Inactive"}
      sx={{
        "& .MuiSwitch-switchBase.Mui-checked": {
          color: "var(--color-primary)",
        },
        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
          backgroundColor: "var(--color-primary)",
        },
      }}
    />
  );
};

export default CustomSwitch;

import React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

function Loader(props) {
  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={props.openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default Loader;

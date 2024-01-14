"use client";
import React, { useState } from "react";
import Sidemenu from "./Sidemenu";
import "./layout.scss";
import { ThemeProvider,createTheme } from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';



const Layout = (props) => {
  const [theme,setTheme] = useState('dark');

  const changeMode = () => {
    if(theme === 'dark') {
      setTheme('light')
    }else {
      setTheme('dark')
    }
  }

  const darkTheme = createTheme({
    palette: {
      mode: theme,
    },
  });
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Sidemenu theme={theme} setTheme={changeMode} className="main">{props.children}</Sidemenu>
    </ThemeProvider>
  );
};

export default Layout;

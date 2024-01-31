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

  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#2196f3', // Replace with your custom primary color for light theme
      },
      secondary: {
        main: '#ff4081', // Replace with your custom secondary color for light theme
      },
      background: {
        default: '#ffffff', // Replace with your custom background color for light theme
        paper: '#f8f8f8', // Replace with your custom paper color for light theme
      },
      text: {
        primary: '#000000', // Replace with your custom text color for light theme
        secondary: '#757575', // Replace with your custom secondary text color for light theme
      },
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: theme,
      primary: {
        main: '#3f51b5', // Replace with your custom primary color
      },
      secondary: {
        main: '#f50057', // Replace with your custom secondary color
      },
      background: {
        default: '#121212', // Replace with your custom background color
        paper: '#1e1e1e', // Replace with your custom paper color
      },
      text: {
        primary: '#ffffff', // Replace with your custom text color
        secondary: '#a0a0a0', // Replace with your custom secondary text color
      },
    },
  });

  const selectedTheme = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={selectedTheme}>
      <CssBaseline />
      <Sidemenu theme={theme} setTheme={changeMode} className="main">{props.children}</Sidemenu>
    </ThemeProvider>
  );
};

export default Layout;

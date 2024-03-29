"use client";
import { useState } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Link from "next/link";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import MovingIcon from "@mui/icons-material/Moving";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { Button, List } from "@mui/material";

const drawerWidth = 240;

function Sidemenu(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const SideData = [
    { Title: "Dashboard", url: "/dashboard" },
    { Title: "Gainers", url: "/gainers" },
    { Title: "Exchanges", url: "/exchanges" },
    { Title: "Drafts", url: "/drafts" },
  ];

  const IconsArr = [<SpaceDashboardIcon key={'a'} />,<MovingIcon key={'b'}/>,<AccountBalanceIcon key={'c'} />,<ReceiptLongIcon key={'d'}/>];

 

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {SideData.map((text, index) => (
          <ListItem key={index} sx={{padding: 0}} >
            <Link href={text.url}  style={{width: '100%',margin: 0, paddingTop: '8px',paddingLeft:"4px", paddingRight:"4px"}}>
              <ListItemButton >
                 <ListItemIcon >{IconsArr[index]}</ListItemIcon>
                <ListItemText primary={text.Title} sx={props.theme === 'dark' && {color: 'white',textDecoration: "none"}} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
      <Divider />
      {/* <List>
        {["Settings", "Trade"].map((text, index) => (
          <ListItem key={text} >
            <ListItemButton>
              <ListItemIcon>{IconsArr2[index]}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
    </div>
  );

  // Remove this const when copying and pasting into your project.
  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="absolute"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          maxHeight: "64px",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Crypto Portfolio
          </Typography>
          <Button variant="contained" onClick={props.setTheme} sx={{marginLeft:"2em"}}>Theme</Button>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {props.children}
      </Box>
    </Box>
  );
}

Sidemenu.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default Sidemenu;

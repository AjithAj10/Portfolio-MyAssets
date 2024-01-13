'use client'
import React from 'react'
import Sidemenu from "./Sidemenu";
import "./layout.scss";

const Layout = (props) => {
  return (
    <Sidemenu className='main'>
        {props.children}
    </Sidemenu>
  )
}

export default Layout

import React from 'react'
import { SmoothScrollbar, GlobalCanvas } from "@14islands/r3f-scroll-rig"

const GlobalScene = () => {
    return (
        <>
            <SmoothScrollbar />
            <GlobalCanvas flat ></GlobalCanvas>
        </>
    )
}

export default GlobalScene
import React,{createContext,useState,useEffect} from 'react'
import io from "socket.io-client";


export const SocketContext = createContext()



function SocketContextApi(props) {
    const socket = io("http://192.168.43.223:3333");
   
   
    const socketVal = {socket}
        // socket.on("app-msg", msg => {
        //     // setAppMsg(msg)
        //     // console.log('this is my msg',msg)
        //     chatMessages.unshift(msg)
        //     // console.log(chatMessages+' arr from context')
        //     // console.log(chatMessages.length)
        // })
    return (
        <SocketContext.Provider value={socketVal} >
            {props.children}
        </SocketContext.Provider>
    )
}

export default SocketContextApi

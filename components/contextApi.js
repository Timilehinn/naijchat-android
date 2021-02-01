import React,{createContext,useState,useEffect} from 'react'
import io from "socket.io-client";


export const MessageContext = createContext()



function ContextApi(props) {
    // const socket = io("http://192.168.43.223:3333");
    const [ session, setSession ] = useState(false)
    const [ userDetails, setUserDetails ] = useState([{timi:'tii'}])
    const allValues = {session,setSession, userDetails, setUserDetails}
        // socket.on("app-msg", msg => {
        //     // setAppMsg(msg)
        //     // console.log('this is my msg',msg)
        //     chatMessages.unshift(msg)
        //     // console.log(chatMessages+' arr from context')
        //     // console.log(chatMessages.length)
        // })
    return (
        <MessageContext.Provider value={allValues} >
            {props.children}
        </MessageContext.Provider>
    )
}

export default ContextApi

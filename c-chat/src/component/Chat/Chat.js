import React, { useEffect, useState, useRef } from 'react'
import { user } from "../Join/Join"
import Message from "../Message/Message"
import "./Chat.css"
import socketIo from "socket.io-client"
import sendLogo from "../../images/send.png"
import ScrollToBottom from "react-scroll-to-bottom"
import closeIcon from "../../images/closeIcon.png"
import { useNavigate } from 'react-router'

let socket

const ENDPOINT = "http://localhost:4500/"

const Chat = () => {

    const navigate = useNavigate()

    if(!user) {
        navigate('/')
    }

    const [id, setid] = useState("")
    const [messages, setMessages] = useState([])

    const boxMessage = useRef('')

    const send = () => {
        if(boxMessage.current.value) {
            socket.emit('message', { message: boxMessage.current.value, id })
            boxMessage.current.value = ""
        }
    }

    useEffect(() => {
        socket = socketIo(ENDPOINT, { transports: ['websocket'] })

        socket.on('connect', () => {
            setid(socket.id)
        })

        socket.emit('joined', { user })

        socket.on('welcome', (data) => {
            setMessages(messages => [...messages, data])
        })

        socket.on('userJoined', (data) => {
            setMessages(messages => [...messages, data])
        })

        socket.on('leave', (data) => {
            setMessages(messages => [...messages, data])
        })

        socket.on('sendMessage', (data) => {
            setMessages(messages => [...messages, data])
        })

        return () => {
            socket.emit('disconnect')
            socket.off()
        }
    }, [])

    return (
        <div className="chatPage">
            <div className="chatContainer">
                <div className="header">
                    <h2>C-CHAT</h2>
                    <a href="/"><img src={closeIcon} alt="Close" /></a>
                </div>
                <ScrollToBottom className="chatBox">
                    {messages.map((item, i) => <Message key={i} user={item.id === id ? '' : item.user} message={item.message}/>)}
                </ScrollToBottom>
                <div className="inputBox">
                    <input onKeyPress={(e) => e.key === 'Enter' ? send() : null } type="text" id="chatInput" ref={boxMessage}/>
                    <button onClick={send} className="sendBtn">
                        <img src={sendLogo} alt="Send" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Chat
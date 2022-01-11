import React, { useRef, useState } from 'react'
import './Join.css'
import logo from '../../images/logo.png'
import { Link } from 'react-router-dom'

let user = ''

const Join = () => {

    const [name, setName] = useState()

    const username = useRef(null)
    const sendUser = () => {
        user = username.current.value
        username.current.value = ''
    }

    return (
        <div className='joinPage'>
            <div className="joinContainer">
                <img src={logo} alt="logo" />
                <h1>C-Chat</h1>
                <input onChange={(e) => setName(e.target.value)} placeholder="Enter your name" type="text" id="joinInput"  ref={username}/>
                <Link onClick={(e) => !name ? e.preventDefault() : null } to="/chat">
                    <button onClick={sendUser} className="joinBtn">Log In</button>
                </Link>   
            </div>
        </div>
    )
}

export default Join
export { user }


import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import SocketContext from '../../context/socket'
import axios from 'axios'

export default function Login(props) {

    const nameRef = useRef(null)
    const [success, setSuccess] = useState(false)
    const history = useHistory();

    const { setToken } = useContext(SocketContext)

    useEffect(() => {
        if (success) {
            history.push('/rooms')
        }
    }, [success])


    function handleSubmit(e) {
        e.preventDefault()
        axios.post('http://localhost:3001/auth', {
            name: nameRef.current.value
        }).then(response => {
            const token = response.data.token
            window.localStorage.setItem('token', token)
            window.localStorage.setItem('name', nameRef.current.value)
            setToken(token)
            setSuccess(true)
        }).catch((err) => console.log(err))
    }


    return (
        <div className="container-2 w-container">
            <form className="lobby" method="post" onSubmit={handleSubmit}>
                <h1 className="heading">Seja bem-vindo</h1>
                <div>Informe seu nome para começar:</div>
                <input className="div-block-3" name="name" style={{ width: '100%' }} ref={nameRef} />
                <br />
                <input type="submit" className="w-button" value="Entrar" />
            </form>
        </div>
    )
}
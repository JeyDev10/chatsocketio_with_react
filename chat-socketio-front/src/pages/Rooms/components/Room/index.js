import { useContext, useEffect, useRef, useState } from "react"
import SocketContext from '../../../../context/socket'
export default function Room(props) {
    const room = window.localStorage.getItem('room')
    const { rooms } = props
    const { socket } = useContext(SocketContext)
    const name = window.localStorage.getItem('name')
    const [showCleanChat, setShowCleanChat] = useState(false)
    const msgRef = useRef(null)
    const [msgs, setMsgs] = useState([])

    const [roomName, setRoomName] = useState('')



    useEffect(() => {
        const hasRoom = rooms.find((r) => r._id == room)
        if (hasRoom)
            setRoomName(hasRoom.name)
    }, [rooms, room])

    useEffect(() => {
        if (name.toLowerCase().includes('adm')) {
            setShowCleanChat(true)
        }
    }, [name])

    useEffect(async () => {
        if (socket.io != undefined) {
            await socket.emit('join', room)
        }
    }, [socket, room])

    useEffect(() => {
        if (socket.io != undefined) {
            socket.on('msgsList', msgs => {
                if (msgs.room == window.localStorage.getItem('room')) {
                    let msgList = msgs.messages.filter((item) => item.room == room)
                    setMsgs(msgList)
                }

            })
        }
    }, [socket, room])


    const handleKey = (event) => {
        if (event.keyCode === 13) {
            // enviar a mensagem no <enter>
            socket.emit('sendMsg', {
                msg: msgRef.current.value,
                room: room
            })
            msgRef.current.value = ''
        }
    }

    const handleCleanRoom = (event) => {
        socket.emit('cleanRoom', room)
    }

    return (
        <div className="room">
            <h2 className="name-room">{roomName}</h2>
            <div className="messages">
                {msgs.length > 0 && msgs.map(msg => {
                    return (<div className={`message ${msg.author == name ? 'userMessage' : ''}`} key={msg._id}>
                        <span className="author">{msg.author}</span>
                        <br />
                        <span className="msg-body">{msg.message}</span>
                    </div>)
                })
                }
            </div>
            <div className="new-message-form w-form">
                <form className="form">
                    <textarea id="field" name="field" maxLength="5000" placeholder="Digite sua mensagem e pressione &lt;Enter&gt;" autoFocus={true} onKeyUp={handleKey} ref={msgRef} className="msg w-input"></textarea>
                    {showCleanChat &&
                        <button type="button" className="send-audio w-button" onClick={handleCleanRoom}>Limpar chat</button>
                    }
                </form>
            </div>
        </div>
    )
}
import React, { useEffect, useMemo, useState, useContext } from 'react'
import { Route, Link } from 'react-router-dom'
import Room from './components/Room'
import SelectRoom from './components/SelectRoom'
import SocketContext from '../../context/socket'

function Rooms(props) {

    const [rooms, setRooms] = useState([])
    const [soc, setSoc] = useState('')

    const { socket } = useContext(SocketContext)

    useEffect(async () => {

        // const token = window.localStorage.getItem('token')
        // const socket = await io(SOCKET_URL, {
        //     query: {
        //         token: token
        //     }
        // })
        if (socket.io != undefined) {
            setSoc(socket)
            socket.on('newRoom', room => {
                setRooms([...rooms, room])
            })
            // recebe a lista inicial de rooms
            socket.on('roomList', rooms => {
                setRooms(rooms)
            })

        }
    }, [socket])

    // socket.on('newMsg', msg => {
    //     // if (selectedRoom === msg.room) {
    //     //     addMsg(msg)
    //     // } else {
    //     //     console.log(msg)
    //     //     // atualizar contador de msgs nao lidas
    //     //     const id = msg.room
    //     //     console.log($('#' + id + ' .notifications span'))
    //     //     let count = parseInt($('#' + id + ' .notifications span').text())
    //     //     count++
    //     //     $('#' + id + ' .notifications span').text(count)
    //     // }
    // })

    // socket.on('newAudio', msg => {
    //     // if (selectedRoom === msg.room) {
    //     //     addMsg(msg)
    //     // } else {
    //     //     // atualizar contador de msgs nao lidas
    //     // }
    // })

    // socket.on('msgsList', msgs => {
    //     // $('.messages').html('')
    //     // msgs.map(addMsg)
    // })
    return (
        <>

            <div className="container w-container">
                <div className="rooms">
                    <h1 className="title-rooms">Salas Disponíveis</h1>
                    {rooms.length > 0 && <ul className="room-list w-list-unstyled">
                        {rooms.map(room => {
                            return (
                                <li className="room-item" key={room._id}>
                                    <Link to={`/rooms/${room._id}`}>
                                        {room.name}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>}
                    <div className="add-room" onClick={() => soc.emit('addRoom', 'Sala 2')} style={{ cursor: 'pointer' }} > +</div>
                </div>
                <Route path='/rooms' exact component={SelectRoom} />
                <Route path='/rooms/:room' render={(props) => <Room {...props} socket={soc} />} />


            </div>




        </>

    )
}
export default Rooms
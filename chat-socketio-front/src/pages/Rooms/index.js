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

    return (
        <>
            <div className="container w-container">
                <div className="rooms">
                    <h1 className="title-rooms">Salas Disponíveis</h1>

                    {rooms.length > 0 && <ul className="room-list w-list-unstyled">
                        {rooms.map(room => {
                            return (
                                <li className="room-item" key={room._id}>
                                    <Link to={`/rooms/${room._id}`} onClick={() => window.localStorage.setItem('room', room._id)}>
                                        {room.name}
                                    </Link>
                                </li>
                            )
                        })}
                        <li className="room-item" >
                            <Link to={'/'}>
                                Voltar
                            </Link>
                        </li>
                    </ul>}
                    <div className="add-room" onClick={() => soc.emit('addRoom', 'Sala 2')} style={{ cursor: 'pointer' }} > +</div>
                </div>
                <Route path='/rooms' exact component={SelectRoom} />
                <Route path='/rooms/:room' render={(props) => <Room {...props} socket={soc} rooms={rooms} />} />
            </div>
        </>

    )
}
export default Rooms
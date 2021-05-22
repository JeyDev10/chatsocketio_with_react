import React from 'react'

import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'

import Login from '../pages/Login'
import Rooms from '../pages/Rooms'




export default function Routes(props) {
    return (

        <Router>
            <Switch>
                <Route exact path={'/'} component={Login} />
                <Route path={'/rooms'} component={Rooms} />
            </Switch>
        </Router>





    )
}
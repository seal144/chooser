import React from 'react';
import { Routes, Route } from "react-router-dom";

import Home from '../pages/Home';
import CreateRoom from '../pages/CreateRoom';
import JoinRoom from '../pages/JoinRoom';
import Room from '../pages/Room';
import { HOME, CREATEROOM, JOINROOM, ROOM } from '../helpers/paths';

const Body = () => {
    return ( 
        <Routes>
          <Route path={ HOME } element={<Home/>}/>
          <Route path={ CREATEROOM } element={<CreateRoom/>}/>
          <Route path={ JOINROOM } element={<JoinRoom/>}/>
          <Route path={ ROOM } element={<Room/>}/>
        </Routes>
     );
}
 
export default Body;
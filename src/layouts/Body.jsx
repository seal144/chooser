import React from 'react';
import { Routes, Route } from "react-router-dom";

import Home from '../pages/Home';
import CreateRoom from '../pages/CreateRoom';
import JoinRoom from '../pages/JoinRoom';
import Room from '../pages/Room';
import About from '../pages/About';
import { HOME, ABOUT, CREATEROOM, JOINROOM, ROOM, ROOMADMIN } from '../helpers/paths';

const Body = () => {
    return (
      <div className='content-wrapper'>
        <Routes>
          <Route path={ HOME } element={<Home/>}/>
          <Route path={ ABOUT } element={<About/>}/>
          <Route path={ CREATEROOM } element={<CreateRoom/>}/>
          <Route path={ JOINROOM } element={<JoinRoom/>}/>
          <Route path={ ROOMADMIN } element={<Room/>}/>
          <Route path={ ROOM } element={<Room/>}/>
        </Routes>
      </div>
     );
}
 
export default Body;
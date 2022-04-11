import React from 'react';
import { Routes, Route, useParams, Navigate } from "react-router-dom";

import { HOME, ABOUT, CREATEROOM, JOINROOM, ROOM } from '../helpers/paths';

const Head = () => {
    return (
        <Routes>
          <Route path={ HOME } element={<h2 className="header">CHOOSER</h2>}/>
          <Route path={ ABOUT } element={<h2 className="header">O APLIKACJI</h2>}/>
          <Route path={ CREATEROOM } element={<h2 className="header">STWÓRZ NOWY POKÓJ</h2>}/>
          <Route path={ JOINROOM } element={<h2 className="header">DOŁĄCZ DO POKOJU</h2>}/>
          <Route path={ ROOM } element={<HeaderRoom/>}/>
          <Route path="*" element={<Navigate to="/" replace={true} />}/>
        </Routes>
    )
}

const HeaderRoom = () => {
  let {roomName} = useParams();
  roomName = roomName.toUpperCase();

  return (
    <h2 className="header">
      POKÓJ: {roomName}
    </h2>
  )
}

export default Head;
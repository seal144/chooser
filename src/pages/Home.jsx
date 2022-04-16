import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import MainMenuButton from '../components/MainMenuButton';

import {CREATEROOM, JOINROOM, ABOUT} from '../helpers/paths'

const Home = () => {
    const navContent = [
        {
            id:1,
            text:'STWÓRZ POKÓJ',
            path: CREATEROOM,
        },
        {
            id:2,
            text:'DOŁĄCZ DO POKOJU',
            path: JOINROOM,
        },
        {
            id:3,
            text:'O APLIKACJI',
            path: ABOUT,
        },
    ]

    const Menu = navContent.map(item => (
        <MainMenuButton key={ item.id } path={ item.path } text = {item.text}/>
    ))

    return ( 
        <div className = "home-menu">
            {Menu}
        </div>
     );
}
 
export default Home;
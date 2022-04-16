import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

import './ManinMenuButton.scss'

const MainMenuButton = (props) => {
    return ( 
        <Button type='primary' block className = "main-menu-button">
            <Link to={props.path}><h3>{props.text}</h3></Link>
        </Button>
     );
}
 
export default MainMenuButton;
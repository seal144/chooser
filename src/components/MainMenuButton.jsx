import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

const MainMenuButton = (props) => {
    return ( 
        <Button type='primary' block>
            <Link to={props.path}><h3>{props.text}</h3></Link>
        </Button>
     );
}
 
export default MainMenuButton;
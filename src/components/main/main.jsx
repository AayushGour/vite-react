import React from 'react';
import "./main.scss";
import { Outlet } from 'react-router-dom';
import Loader from '../utility/loader';

const MainComponent = (props) => {
    return (
        <div className="main-container overflow-auto">
            <Outlet />
        </div>
    )
}

export default MainComponent;
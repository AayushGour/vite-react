import React from 'react';
import LeftSidebar from './left-sidebar';
import "./layout.scss";
import HeaderComponent from './header';
import MainComponent from './main';

const LayoutComponent = (props) => {
    return (
        <div className='root-container h-100 w-100'>
            <HeaderComponent />
            <div className="d-flex flex-row align-items-start w-100 h-100">
                <LeftSidebar />
                <MainComponent />
            </div>
        </div>
    )
}

export default LayoutComponent;
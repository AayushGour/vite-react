import React from 'react';
import "./secondary-header.scss";
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SecondaryHeader = (props) => {
    const { title, extraDetails, goBack } = props;
    const navigate = useNavigate();
    return (
        <div className="w-100 secondary-header-container mb-4">
            <div className="d-flex flex-row align-items-center gap-2">
                {goBack ? <Button title="Go Back" onClick={() => navigate(-1)} className='back-btn' variant='ghost'><svg xmlns="http://www.w3.org/2000/svg" width="1.6rem" height="1.6rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg></Button> : <></>}
                <h3 className='header-title mb-0'>{title}</h3>
            </div>
            <div className="extra-details-container">{extraDetails}</div>
        </div>
    )
}

export default SecondaryHeader;
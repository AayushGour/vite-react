import React from 'react';
import "./steps-component.scss";

const StepsComponent = (props) => {
    const { className, steps, currentStep } = props;

    return (
        <div className={`steps-container ${className ?? ""}`}>
            {steps?.map((item, index) => {
                return <>
                    <div className={`step-wrapper ${currentStep === item?.index ? "active" : currentStep > item?.index ? "completed" : ""}`} key={index}>
                        <span className='step-number'>{currentStep > item?.index ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> : item?.index}</span>
                        <span className="step-title">{item?.title}</span>
                    </div>
                    {index !== steps?.length - 1 ?
                        <div className="filler-line"></div>
                        : <></>}
                </>
            })}
        </div>
    )
}

export default StepsComponent;
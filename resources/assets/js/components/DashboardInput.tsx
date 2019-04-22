import React from 'react';

export const DashboardInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
    let {readOnly, ...rest} = props;
    if (window.Panel.Server.readonly) {
        readOnly = true;
    }
    return <input readOnly={readOnly} {...rest}/>
};

export const DashboardSelect = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => {
    let {disabled, ...rest} = props;
    if (window.Panel.Server.readonly) {
        disabled = true;
    }
    return <select disabled={disabled} {...rest}/>
};
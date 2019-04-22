import React from 'react';
import Switch, {SwitchProps} from "./Switch";

export const DashboardInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
    let {disabled, ...rest} = props;
    if (window.Panel.Server.readonly) {
        disabled = true;
    }
    return <input disabled={disabled} {...rest}/>
};

export const DashboardSelect = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => {
    let {disabled, ...rest} = props;
    if (window.Panel.Server.readonly) {
        disabled = true;
    }
    return <select disabled={disabled} {...rest}/>
};

export const DashboardSwitch = (props: SwitchProps) => {
    let {disabled, ...rest} = props;
    if (window.Panel.Server.readonly) {
        disabled = true;
    }
    return <Switch disabled={disabled} {...rest}/>
};
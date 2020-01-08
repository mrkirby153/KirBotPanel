import React, {forwardRef} from 'react';
import Switch, {SwitchProps} from "./Switch";

const DashboardInput = (props, ref) => {
    let {disabled, ...rest} = props;
    if (window.Panel.Server.readonly) {
        disabled = true;
    }
    return <input disabled={disabled} ref={ref} {...rest}/>
};

const dashInputWithRef = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(DashboardInput);

const DashboardSelect = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => {
    let {disabled, ...rest} = props;
    if (window.Panel.Server.readonly) {
        disabled = true;
    }
    return <select disabled={disabled} {...rest}/>
};

const DashboardSwitch = (props: SwitchProps) => {
    let {disabled, ...rest} = props;
    if (window.Panel.Server.readonly) {
        disabled = true;
    }
    return <Switch disabled={disabled} {...rest}/>
};

export {dashInputWithRef as DashboardInput, DashboardSelect, DashboardSwitch}
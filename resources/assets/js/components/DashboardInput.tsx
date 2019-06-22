import React, {forwardRef} from 'react';
import Switch, {SwitchProps} from "./Switch";

type Ref = HTMLInputElement

export const DashboardInput = forwardRef<Ref, React.InputHTMLAttributes<Ref>>((props, ref) => {
    let {disabled, ...rest} = props;
    if (window.Panel.Server.readonly) {
        disabled = true;
    }
    return <input disabled={disabled} ref={ref} {...rest}/>
});

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
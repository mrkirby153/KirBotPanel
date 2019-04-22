import React, {Component} from 'react';


// Extend the default HTMLAttributes for the input
export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string,
    id: string,
    switchSize?: "small" | "normal" | "large"
}

export default class Switch extends Component<SwitchProps, {}> {

    public static defaultProps = {
        switchSize: "normal"
    };

    constructor(props) {
        super(props);
    }

    render() {
        let {label, id, switchSize, ...rest} = this.props;
        let className = 'switch ';
        switch (switchSize) {
            case 'small':
                className += 'switch-sm';
                break;
            case 'large':
                className += 'switch-lg';
                break;
            default:
                // Ignore
                break;
        }
        return (
            <div className={className}>
                <input type="checkbox" className="switch" id={id} {...rest}/>
                <label htmlFor={id}>{label}</label>
            </div>
        );
    }

}
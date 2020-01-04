import React, {forwardRef, ReactElement, useState} from 'react';

interface ConfirmButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    timeout?: number | undefined | null,
    confirmText?: ReactElement | string | undefined | null,
    onConfirm: Function
}

let ConfirmButton = (props, ref) => {
    const [confirm, isConfirming] = useState(false);

    const [timer, setTimer] = useState<number>(-1);

    const {confirmText, timeout, ...rest} = props;

    const onClick = (event) => {
        if (confirm) {
            if (timer != -1)
                window.clearTimeout(timer);
            isConfirming(false);
            props.onConfirm(event);
        } else {
            isConfirming(true);
            const id = window.setTimeout(() => {
                isConfirming(false);
                setTimer(-1);
            }, timeout || 5000);
            setTimer(id);
        }
    };

    return <button ref={ref} {...rest} onClick={onClick}>{confirm ? confirmText || 'Confirm?' : props.children}</button>
};
export default forwardRef<HTMLButtonElement, ConfirmButtonProps>(ConfirmButton);

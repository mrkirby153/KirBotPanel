import * as React from 'react';
import {ReactElement, useEffect, useRef, useState} from 'react';

export interface ModalProps {
    title: string,
    open: boolean,
    onOpen?: Function,
    onClose?: Function,
    controlled?: boolean,
    closeButton?: boolean,

    footer?(): ReactElement | null
}

enum ModalState {
    CLOSED, OPENING, OPEN, CLOSING
}

const Modal: React.FC<ModalProps> = (props) => {
    const modalRef = useRef<any>(null);

    const [modalState, setModalState] = useState(ModalState.CLOSED);

    useEffect(() => {
        // Register modal state events
        $(modalRef.current).on('show.bs.modal', () => {
            setModalState(ModalState.OPENING);
        });
        $(modalRef.current).on('shown.bs.modal', () => {
            setModalState(ModalState.OPEN);
            if (!props.controlled) {
                if (props.onOpen) {
                    props.onOpen();
                }
            }
        });
        $(modalRef.current).on('hide.bs.modal', () => {
            setModalState(ModalState.CLOSING);
        });
        $(modalRef.current).on('hidden.bs.modal', () => {
            setModalState(ModalState.CLOSED);
            if (!props.controlled) {
                if (props.onClose) {
                    props.onClose();
                }
            }
        });
    }, []);

    useEffect(() => {
        return () => {
            // componentDidUnmount
            $(modalRef.current).modal('dispose');

            // We have to do some cleanup ourselves if we get unmounted while we're open
            let backdrops = document.body.getElementsByClassName('modal-backdrop');
            if (backdrops.length > 0) {
                for (let i = 0; i < backdrops.length; i++) {
                    document.body.removeChild(backdrops[i]);
                }
            }
            document.body.classList.remove('modal-open')
        }
    }, []);

    useEffect(() => {
        if (modalState != ModalState.OPEN && modalState != ModalState.CLOSED) {
            throw Error('Attempting to ' + props.open ? 'open' : 'close' + ' a transitioning modal');
        }
        if (props.open) {
            if (modalState == ModalState.CLOSED) {
                setModalState(ModalState.OPENING);
                // If a modal is controlled, it must be opened and closed manually
                if (props.controlled) {
                    $(modalRef.current).modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                } else {
                    $(modalRef.current).modal('show');
                }
            }
        } else {
            if (modalState == ModalState.OPEN) {
                setModalState(ModalState.CLOSING);
                $(modalRef.current).modal('hide');
            }
        }
    }, [props.open]);

    return (
        <div className="modal fade" tabIndex={-1} role="dialog" ref={modalRef}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{props.title}</h5>
                        {props.closeButton &&
                        <button type="button" className="close" aria-label="close"
                                data-dismiss={props.controlled ? null : 'modal'} onClick={() => {
                            if (props.onClose && props.controlled) {
                                props.onClose()
                            }
                        }}>
                            <span aria-hidden={true}>&times;</span>
                        </button>}
                    </div>
                    <div className="modal-body">
                        {props.children}
                    </div>
                    {props.footer && <div className="modal-footer">
                        {props.footer()}
                    </div>}
                </div>
            </div>
        </div>
    );
};

export default Modal;
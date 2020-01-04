import {Component, FunctionComponent, ReactElement} from 'react';
import * as React from "react";
import {isObject} from "util";


interface ModalProps {
    title: string,
    onClose?: Function,
    open: boolean
}

interface ModalState {
    shown: boolean
}

export default class Modal extends Component<ModalProps, ModalState> {

    private modalRef: React.RefObject<any>;

    constructor(props: any) {
        super(props);
        this.state = {
            shown: false
        };
        this.modalRef = React.createRef();
    }

    componentDidUpdate(prevProps: Readonly<ModalProps>, prevState: Readonly<ModalState>): void {
        if(prevProps.open != this.props.open) {
            if(this.props.open) {
                this.showModal();
            } else {
                this.hideModal();
            }
        }
    }

    componentWillUnmount(): void {
        this.destroy();
    }

    destroy() {
        if(this.state.shown) {
            document.body.removeChild(document.getElementsByClassName('modal-backdrop')[0]);
            document.body.classList.remove('modal-open');
        }
    }

    showModal() {
        if (!this.state.shown) {
            $(this.modalRef.current).modal('show');
            this.setState({
                shown: true
            })
        }
    }

    hideModal() {
        if (this.state.shown) {
            $(this.modalRef.current).modal('hide');
            this.setState({
                shown: false
            })
        }
    }

    componentDidMount(): void {
        $(this.modalRef.current).on('hidden.bs.modal', e => {
            let fun = this.props.onClose;
            if (fun) {
                fun(e);
            }
            this.setState({
                shown: false
            })
        });
        if (this.props.open) {
            this.showModal();
        }
    }

    render() {
        return (
            <div className="modal fade" tabIndex={-1} role="dialog" ref={this.modalRef}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{this.props.title}</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="close">
                                <span aria-hidden={true}>&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
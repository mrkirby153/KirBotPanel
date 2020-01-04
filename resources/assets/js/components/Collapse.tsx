import React from 'react';

interface CollapseProps {
    visible: boolean
}

interface CollapseState {
    visible: boolean
}

export default class Collapse extends React.Component<CollapseProps, CollapseState> {

    private ref: React.RefObject<HTMLDivElement>;
    private shouldRemove: boolean;
    private registered: boolean;

    constructor(props) {
        super(props);
        this.ref = React.createRef();
        this.shouldRemove = false;
        this.registered = false;

        this.state = {
            visible: false
        };

        this.expand = this.expand.bind(this);
        this.collapse = this.collapse.bind(this);
        this.removeStyle = this.removeStyle.bind(this);
    }

    componentWillReceiveProps(nextProps: Readonly<CollapseProps>, nextContext: any): void {
        if (nextProps.visible) {
            this.shouldRemove = true;
            this.expand()
        } else {
            this.shouldRemove = false;
            this.collapse()
        }
    }


    removeStyle() {
        let el = this.ref.current;
        if (el && this.shouldRemove) {
            this.shouldRemove = false;
            el.style.height = '';
            el.classList.add('visible');
            el.removeEventListener('transitioned', this.removeStyle);
        }
    }

    expand() {
        if(this.state.visible) {
            return;
        }
        let element = this.ref.current;
        if (!element) {
            console.warn("Collapse ref was null?");
            return;
        }

        let height = element.scrollHeight;
        element.style.height = height + 'px';
        if (!this.registered) {
            this.registered = true;
            element.addEventListener('transitionend', this.removeStyle);
        }
        this.setState({
            visible: true
        })
    }

    collapse() {
        if(!this.state.visible) {
            return;
        }
        let element = this.ref.current;
        if (!element) {
            console.warn("Collapse ref was null?");
            return;
        }

        let height = element.scrollHeight;
        let prevTransition = element.style.transition;
        element.style.transition = '';

        requestAnimationFrame(() => {
            if (element != null) {
                element.style.height = height + 'px';
                element.style.transition = prevTransition;

                requestAnimationFrame(() => {
                    if (element != null) {
                        element.style.height = 0 + 'px';
                        element.classList.remove('visible');
                        this.setState({
                            visible: false
                        })
                    }
                })
            }
        })
    }

    componentDidMount(): void {
        if (!this.props.visible) {
            // Hide the component
            let el = this.ref.current;
            if (el) {
                el.style.height = 0 + 'px';
            }
        }
    }

    render() {
        return (
            <div className="collapsible" ref={this.ref}>
                {this.props.children}
            </div>
        );
    }

}
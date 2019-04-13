import React, {Component} from 'react';


interface ErrorBoundaryState {
    error: null | Error,
    errorInfo: null | React.ErrorInfo
}

export default class ErrorBoundary extends Component<{}, ErrorBoundaryState> {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorInfo: null
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        this.setState({
            error: error,
            errorInfo: errorInfo
        })
    }

    static reload() {
        location.reload();
    }

    render() {
        if (this.state.errorInfo) {
            return (
                <div className="row mt-2">
                    <div className="col-4 offset-4 text-center">
                        <h1><i className="fas fa-skull"/> Error! <i className="fas fa-skull"/></h1>
                        <p>
                            The panel has crashed. Please reload and try again
                        </p>
                        <button className="btn btn-info btn-lg" onClick={ErrorBoundary.reload}>Reload</button>
                    </div>
                </div>
            )
        }
        return this.props.children;
    }
}
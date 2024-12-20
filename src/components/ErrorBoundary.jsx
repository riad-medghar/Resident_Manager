
import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can log the error to an error reporting service here
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="text-center mt-8 text-red-500">
                    <h2>Something went wrong.</h2>
                    <p>{this.state.error && this.state.error.toString()}</p>
                </div>
            );
        }

        return this.props.children; 
    }
}

export default ErrorBoundary;
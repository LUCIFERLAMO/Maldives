import React from 'react';

class GlobalErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error("Application Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-red-50 p-8 flex items-center justify-center">
                    <div className="max-w-4xl w-full">
                        <h1 className="text-3xl font-bold text-red-600 mb-4">⚠️ Application Error</h1>
                        <p className="text-lg text-red-700 mb-6">Something went wrong.</p>

                        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 text-left">
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Error Details:</h2>
                            <pre className="bg-slate-900 text-red-400 p-4 rounded-lg overflow-auto text-sm">
                                {this.state.error && this.state.error.toString()}
                            </pre>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6 text-left">
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Component Stack:</h2>
                            <pre className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-auto text-sm max-h-64">
                                {this.state.errorInfo && this.state.errorInfo.componentStack}
                            </pre>
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 px-6 py-3 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700"
                        >
                            Reload Page
                        </button>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="mt-6 ml-4 px-6 py-3 bg-slate-600 text-white rounded-lg font-bold hover:bg-slate-700"
                        >
                            Go Home
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default GlobalErrorBoundary;

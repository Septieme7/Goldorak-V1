// components/LoadingSpinner.jsx
import './LoadingSpinner.css';

function LoadingSpinner({ size = 'medium', text = 'Chargement...', fullScreen = false }) {
    const sizeClasses = {
        small: 'loading-small',
        medium: 'loading-medium',
        large: 'loading-large'
    };

    const spinnerClass = `loading-spinner ${sizeClasses[size] || sizeClasses.medium}`;

    if (fullScreen) {
        return (
            <div className="loading-fullscreen">
                <div className={spinnerClass}></div>
                {text && <p className="loading-text">{text}</p>}
            </div>
        );
    }

    return (
        <div className="loading-container">
            <div className={spinnerClass}></div>
            {text && <p className="loading-text">{text}</p>}
        </div>
    );
}

export default LoadingSpinner;
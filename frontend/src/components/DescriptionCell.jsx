// frontend/src/components/DescriptionCell.jsx
import React, { useState, useEffect, useRef } from 'react';
import './Components.css';

let closeAllTooltips = null;

function DescriptionCell({ description, maxLength = 60 }) {
    const [showTooltip, setShowTooltip] = useState(false);
    const isOpen = useRef(false);

    if (!description || description.trim() === '') {
        return <span style={{ color: '#888' }}>-</span>;
    }

    // Troncature pour l'affichage dans la cellule
    const truncated = description.length > maxLength
        ? `${description.substring(0, maxLength)}...`
        : description;

    // Toujours activer le tooltip, quelle que soit la longueur
    const needsTooltip = true;

    const handleClose = () => {
        setShowTooltip(false);
        isOpen.current = false;
        if (closeAllTooltips === handleClose) {
            closeAllTooltips = null;
        }
    };

    const handleOpen = () => {
        if (closeAllTooltips) {
            closeAllTooltips();
        }
        setShowTooltip(true);
        isOpen.current = true;
        closeAllTooltips = handleClose;
    };

    const handleClick = (e) => {
        e.stopPropagation();
        if (isOpen.current) {
            handleClose();
        } else {
            handleOpen();
        }
    };

    useEffect(() => {
        const handleOutsideEvent = () => {
            if (isOpen.current) handleClose();
        };

        const handleClickOutside = (e) => {
            if (isOpen.current &&
                !e.target.closest('.description-tooltip') &&
                !e.target.closest('.description-cell')) {
                handleClose();
            }
        };

        window.addEventListener('scroll', handleOutsideEvent, true);
        window.addEventListener('resize', handleOutsideEvent);
        document.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleOutsideEvent, true);
            window.removeEventListener('resize', handleOutsideEvent);
            document.removeEventListener('click', handleClickOutside);
            if (closeAllTooltips === handleClose) {
                closeAllTooltips = null;
            }
        };
    }, []);

    return (
        <div style={{ display: 'inline-block', position: 'relative' }}>
            <div
                className="description-cell"
                onClick={handleClick}
                style={{ cursor: 'pointer' }}
                title="Cliquer pour voir le texte complet"
            >
                {truncated}
            </div>
            {showTooltip && (
                <>
                    <div className="description-overlay" onClick={handleClose} />
                    <div className="description-tooltip" onClick={(e) => e.stopPropagation()}>
                        <span className="description-close" onClick={handleClose}>
                            ✕
                        </span>
                        <div className="description-tooltip-title">Description complète</div>
                        <div className="description-tooltip-content">{description}</div>
                    </div>
                </>
            )}
        </div>
    );
}

export default DescriptionCell;
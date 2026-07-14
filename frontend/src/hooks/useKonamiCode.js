import { useState, useEffect } from 'react';

const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

export const useKonamiCode = (onActivate) => {
    const [index, setIndex] = useState(0);
    const [active, setActive] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key;
            const expectedKey = KONAMI_CODE[index];
            if (key.toLowerCase() === expectedKey || key === expectedKey) {
                const newIndex = index + 1;
                if (newIndex === KONAMI_CODE.length) {
                    setActive(true);
                    if (onActivate) onActivate();
                    setIndex(0);
                } else {
                    setIndex(newIndex);
                }
            } else {
                setIndex(0);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [index, onActivate]);

    return active;
};
'use client';

import { useEffect, useRef, useState } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);
    const handlerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Clear the previous timeout if it exists
        if (handlerRef.current) {
            clearTimeout(handlerRef.current);
        }

        // Set a new timeout to update the debounced value
        handlerRef.current = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup function to clear the timeout
        return () => {
            if (handlerRef.current) {
                clearTimeout(handlerRef.current);
            }
        };
    }, [value, delay]);

    return debouncedValue;
}

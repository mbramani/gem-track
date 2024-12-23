import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(
    date: Date | string | number,
    opts: Intl.DateTimeFormatOptions = {}
) {
    return new Intl.DateTimeFormat('en-US', {
        month: opts.month ?? 'short',
        day: opts.day ?? 'numeric',
        year: opts.year ?? 'numeric',
        hour: opts.hour ?? '2-digit',
        minute: opts.minute ?? '2-digit',
        second: opts.second ?? '2-digit',
        ...opts,
    }).format(new Date(date));
}

export function toSentenceCase(str: string) {
    return str
        .replace(/_/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .toLowerCase()
        .replace(/^\w/, (c) => c.toUpperCase())
        .replace(/\s+/g, ' ')
        .trim();
}

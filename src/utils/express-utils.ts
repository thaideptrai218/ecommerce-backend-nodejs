export function getHeaderAsString(
    req: Request,
    headerName: string
): string | undefined {
    const headerValue = req.headers[headerName.toLowerCase()]; // Headers are case-insensitive, but accessed by lowercase keys

    if (typeof headerValue === "string") {
        return headerValue;
    } else if (Array.isArray(headerValue)) {
        // If it's an array, you might choose to join them, or take the first element
        return headerValue[0]; // Example: taking the first value
    }
    return undefined; // If undefined or any other unexpected type
}

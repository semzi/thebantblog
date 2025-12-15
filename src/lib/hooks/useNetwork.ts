export function useNetwork() {
    if (typeof navigator === "undefined") {
        return { isSlow: false };
    }

    const connection =
        (navigator as any).connection ||
        (navigator as any).mozConnection ||
        (navigator as any).webkitConnection;

    const isSlow =
        connection?.effectiveType === "2g" ||
        connection?.effectiveType === "slow-2g" ||
        connection?.effectiveType === "3g";

    return { isSlow };
}
interface NetworkConnectionLike {
    effectiveType?: string;
}

interface LegacyNetworkNavigator extends Navigator {
    connection?: NetworkConnectionLike;
    mozConnection?: NetworkConnectionLike;
    webkitConnection?: NetworkConnectionLike;
}

export function useNetwork() {
    if (typeof navigator === "undefined") {
        return { isSlow: false };
    }

    const nav = navigator as LegacyNetworkNavigator;

    const connection =
        nav.connection ||
        nav.mozConnection ||
        nav.webkitConnection;

    const isSlow =
        connection?.effectiveType === "2g" ||
        connection?.effectiveType === "slow-2g" ||
        connection?.effectiveType === "3g";

    return { isSlow };
}
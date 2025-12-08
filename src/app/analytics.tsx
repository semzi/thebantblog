"use client";

import Script from "next/script";

export default function Analytics() {
    return (
        <>
            <Script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=G-FDG1G2S8FK`}
            />

            <Script id="google-analytics">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-FDG1G2S8FK');
                `}
            </Script>
        </>
    );
}
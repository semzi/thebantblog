"use client";

import {
    CSSProperties,
    ImgHTMLAttributes,
    useState,
} from "react";
import { useInView } from "@/lib/hooks/useInView";
import { useNetwork } from "@/lib/hooks/useNetwork";

type Props = {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    blurSrc?: string;
    objectFit?: CSSProperties["objectFit"];
    priority?: boolean;
    showSkeleton?: boolean;
} & Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt">;

export default function Image({
    src,
    alt,
    width,
    height,
    blurSrc,
    objectFit = "cover",
    priority = false,
    showSkeleton = true,
    ...props
}: Props) {
    const { ref, isVisible } = useInView<HTMLDivElement>();
    const { isSlow } = useNetwork();
    const [loaded, setLoaded] = useState(false);

    const shouldLoad = priority || isVisible;

    const containerStyle: CSSProperties = {
        position: "relative",
        overflow: "hidden",
        width: width ?? "100%",
        height: height ?? "100%",
        backgroundColor: "#e5e7eb",
    };

    if (width && height) {
        containerStyle.aspectRatio = `${width}/${height}`;
    } else {
        containerStyle.aspectRatio = "16 / 9";
    }

    return (
        <div
            ref={ref}
            style={containerStyle}
            className={props.className}
        >
            {showSkeleton && !loaded && (
                <div
                    aria-hidden
                    style={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 37%, #e5e7eb 63%)",
                        backgroundSize: "400% 100%",
                        animation: "skeleton 1.4s ease infinite",
                    }}
                />
            )}

            {blurSrc && !loaded && (
                <img
                    src={blurSrc}
                    alt=""
                    aria-hidden
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit,
                        filter: "blur(16px)",
                        transform: "scale(1.1)",
                    }}
                />
            )}

            {shouldLoad && (
                <img
                    src={src}
                    alt={alt}
                    decoding="async"
                    loading={priority ? "eager" : "lazy"}
                    fetchPriority={priority ? "high" : isSlow ? "low" : "auto"}
                    onLoad={() => setLoaded(true)}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit,
                        opacity: loaded ? 1 : 0,
                        transition: "opacity 0.4s ease",
                    }}
                    {...props}
                />
            )}

            <style jsx>{`
                @keyframes skeleton {
                    0% {
                        background-position: 200% 0;
                    }
                    100% {
                        background-position: -200% 0;
                    }
                }
            `}</style>
        </div>
    );
}
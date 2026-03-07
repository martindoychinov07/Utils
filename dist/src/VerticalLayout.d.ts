import type { ReactNode } from "react";
interface AppLayoutProps {
    title?: ReactNode;
    menu?: {
        key: string;
        label: ReactNode;
        link?: string;
        onClick?: () => boolean;
    }[][];
    footer?: ReactNode;
    children: ReactNode;
}
export declare function VerticalLayout(props: AppLayoutProps): any;
export {};

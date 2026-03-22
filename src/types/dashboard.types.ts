export type NavItem = {
    title: string;
    href: string;
    icon: string;
};

export type NavSection = {
    title?: string;
    items: NavItem[];
};

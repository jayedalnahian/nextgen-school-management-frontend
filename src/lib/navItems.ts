import { NavSection } from "@/types/dashboard.types";
import { getDefaultDashboardRoute, UserRole } from "./authUtils";


export const getCommonNavItems = (role : UserRole) : NavSection[] => {
    const defaultDashboard = getDefaultDashboardRoute(role);
    return [
        {
            items : [
                {
                    title : "Home",
                    href : "/",
                    icon : "Home"
                },
                {
                    title : "Dashboard",
                    href : defaultDashboard,
                    icon : "LayoutDashboard"

                },
                {
                    title: "My Profile",
                    href: `/my-profile`,
                    icon: "User",
                },
            ]
        },
        {
            title : "Settings",
            items : [
                {
                    title : "Change Password",
                     href: `/change-password`,
                    icon : "Settings"
                }
            ]
        }
    ]
}


export const teacherNavItems : NavSection[] = [
    {
        title: "Academic Management",
        items : [
            {
                title : "Attendance",
                href : "/teacher/attendance",
                icon : "CalendarCheck"
            },
            {
                title: "Mark Entry",
                href: "/teacher/marks-entry",
                icon: "FileSignature",
            },
            {
                title: "My Classes",
                href: "/teacher/my-classes",
                icon: "School",
            },
        ]
    }
]

export const adminNavItems: NavSection[] = [
    {
        title: "User Management",
        items: [
            {
                title: "Admins",
                href: "/admin/admins",
                icon: "Shield",
            },
            {
                title: "Teachers",
                href: "/admin/teachers",
                icon: "UserCog",
            },
            {
                title: "Parents",
                href: "/admin/parents",
                icon: "Users",
            },
            {
                title: "Students",
                href: "/admin/students",
                icon: "GraduationCap",
            },
        ],
    },
    {
        title: "School Management",
        items: [
            {
                title: "Classes",
                href: "/admin/classes",
                icon: "DoorOpen",
            },
            {
                title: "Sections",
                href: "/admin/sections",
                icon: "LayoutGrid",
            },
            {
                title: "Subjects",
                href: "/admin/subjects",
                icon: "BookOpen",
            },
            {
                title: "Attendance",
                href: "/admin/attendance",
                icon: "ClipboardCheck",
            },
            {
                title: "Payments",
                href: "/admin/payments",
                icon: "CreditCard",
            },
        ],
    },
];

export const parentNavItems: NavSection[] = [
    {
        title: "Child Information",
        items: [
            {
                title: "My Children",
                href: "/parent/children",
                icon: "Baby",
            },
            {
                title: "Attendance Report",
                href: "/parent/attendance",
                icon: "FileText",
            },
            {
                title: "Marks / Results",
                href: "/parent/marks",
                icon: "Award",
            },
            {
                title: "Payments",
                href: "/parent/payments",
                icon: "Wallet",
            },
        ],
    },
];

export const getNavItemsByRole = (role : UserRole) : NavSection[] => {
    try {
        const commonNavItems = getCommonNavItems(role) || [];

        switch (role) {
            case "SUPER_ADMIN":
            case "ADMIN":
                return [...commonNavItems, ...(adminNavItems || [])];

            case "TEACHER":
                return [...commonNavItems, ...(teacherNavItems || [])];

            case "PARENT":
                return [...commonNavItems, ...(parentNavItems || [])];

            default:
                return commonNavItems;
        }
    } catch (error) {
        console.error("Error in getNavItemsByRole:", error);
        return [];
    }
}
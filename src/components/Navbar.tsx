const navItems = [
    { label: "HOME", href: "/" },
    { label: "ABOUT", href: "/#about" },
    { label: "THE LIGHT OF YOGA STUDIO", href: "/#studio" },
    { label: "PRICING", href: "/#pricing" },
    { label: "VIDEOS", href: "/#videos" },
    { label: "BLOG", href: "/#blog" },
    { label: "CONTACTS", href: "/contact" },
];

interface NavbarProps {
    /** If true, renders on a dark/image background (transparent). Default: solid dark bg for inner pages */
    transparent?: boolean;
}

const Navbar = ({ transparent = false }: NavbarProps) => {
    return (
        <div
            className={`absolute top-0 left-0 right-0 z-20 ${transparent ? "" : "bg-yoga-dark/90 backdrop-blur-sm"
                }`}
        >
            {/* Nav links */}
            <nav className="flex justify-center py-4">
                <ul className="flex items-center gap-2 md:gap-6">
                    {navItems.map((item, index) => (
                        <li key={item.label} className="flex items-center">
                            <a
                                href={item.href}
                                className="yoga-nav-link hidden md:inline text-[10px] md:text-xs"
                            >
                                {item.label}
                            </a>
                            {index < navItems.length - 1 && (
                                <span className="hidden md:inline text-white mx-2 opacity-60">•</span>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default Navbar;

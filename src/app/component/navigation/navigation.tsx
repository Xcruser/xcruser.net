import React from "react";

export interface NavigationProps {
  /**
   * The brand name shown in the navigation
   */
  brandName: string;
  /**
   * The navigation items to display
   */
  items: Array<{
    label: string;
    href: string;
  }>;
  /**
   * The background color of the navigation
   */
  bgColor?: 'dark' | 'light' | 'transparent';
  /**
   * Whether to show the mobile menu button
   */
  showMobileMenu?: boolean;
}

const bgColorClasses = {
  dark: 'bg-gray-800 text-gray-100',
  light: 'bg-white text-gray-800 border-b',
  transparent: 'bg-transparent text-gray-100',
};

export default function Navigation({ 
  brandName = "Xcruser.net",
  items = [
    { label: "Home", href: "#" },
    { label: "Documentation", href: "#" },
    { label: "Tutorials", href: "#" },
    { label: "Contact", href: "#" },
  ],
  bgColor = 'dark',
  showMobileMenu = true,
}: NavigationProps) {
  return (
    <nav className={`${bgColorClasses[bgColor]} shadow-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="#" className="text-2xl font-bold text-sky-400">
              {brandName}
            </a>
          </div>
          <div className="hidden md:flex space-x-4">
            {items.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="text-gray-300 hover:text-sky-400 px-3 py-2 rounded-md text-sm font-medium"
              >
                {item.label}
              </a>
            ))}
          </div>
          {showMobileMenu && (
            <div className="md:hidden">
              <button
                type="button"
                className="bg-gray-700 p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-600"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {showMobileMenu && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {items.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="text-gray-300 hover:text-sky-400 block px-3 py-2 rounded-md text-base font-medium"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

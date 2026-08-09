import Image from "next/image";
import Link from "next/link";

import playBookyHorizontalLogo from "@/assets/logos/Horizontal Logo.svg";

export type SiteHeaderVariant = "landing" | "inner";

export type SiteHeaderProps = {
  currentPath?: string;
  variant?: SiteHeaderVariant;
};

const navigationItems = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#workshops", label: "Workshops" },
  { href: "#price", label: "Price" },
  { href: "/resources", label: "Resources", menu: true }
];

function ChevronDownIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 20 20"
    >
      <path
        d="m5.5 7.5 4.5 4.5 4.5-4.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function SiteHeader({
  currentPath,
  variant = "landing"
}: SiteHeaderProps) {
  const menuId = `site-header-${variant}-menu`;

  return (
    <header
      className={[
        "site-header",
        variant === "landing"
          ? "site-header--landing"
          : "site-header--inner"
      ].join(" ")}
      data-variant={variant}
    >
      <div className="site-header__container">
        <div className="site-header__content">
          <Link
            aria-label="PlayBooky home"
            className="site-header__logo-link"
            href="/"
          >
            <Image
              alt=""
              aria-hidden="true"
              className="site-header__logo-image"
              height={35}
              priority
              src={playBookyHorizontalLogo}
              width={142}
            />
          </Link>

          <nav
            aria-label="Primary navigation"
            className="site-header__navigation"
          >
            {navigationItems.map((item) => (
              <Link
                aria-current={currentPath === item.href ? "page" : undefined}
                className="site-header__navigation-link"
                href={item.href}
                key={item.href}
              >
                <span>{item.label}</span>
                {item.menu ? <ChevronDownIcon /> : null}
              </Link>
            ))}
          </nav>
        </div>

        <div className="site-header__actions">
          <Link
            className="site-header__login"
            href="/login"
          >
            <span className="site-header__login-label">
              Login
            </span>
          </Link>
        </div>

        <button
          aria-controls={menuId}
          aria-expanded="false"
          aria-label="Open navigation menu"
          className="site-header__menu-button"
          type="button"
        >
          <MenuIcon />
        </button>

        <div hidden id={menuId} />
      </div>
    </header>
  );
}

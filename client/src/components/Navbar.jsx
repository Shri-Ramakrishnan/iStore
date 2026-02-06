import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const navLinkClass = ({ isActive }) =>
  `text-sm ${isActive ? "text-black" : "text-neutral-500 hover:text-black"}`;

function LogoMark() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="w-8 h-8 sm:w-9 sm:h-9 text-neutral-900"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="32" cy="32" r="24" fill="currentColor" opacity="0.08" />
      <path
        d="M20 36c0-7.2 5.8-13 13-13h2c7.2 0 13 5.8 13 13v2c0 7.2-5.8 13-13 13h-2c-7.2 0-13-5.8-13-13v-2z"
        fill="currentColor"
      />
      <path
        d="M32 18c4.2 0 7.6-3.1 8.1-7.1.1-.7-.4-1.2-1.1-1.2-4.8.2-8.7 4-9.1 8.8-.1.7.4 1.2 1.1 1.2z"
        fill="currentColor"
      />
      <rect x="24" y="27" width="16" height="2" fill="#ffffff" opacity="0.35" />
    </svg>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();

  return (
    <header className="border-b border-neutral-200 bg-white/80 backdrop-blur sticky top-0 z-50">
      <div className="container-page h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <LogoMark />
          <span>iStore</span>
        </Link>
        <nav className="flex items-center gap-6">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/products?category=iphone" className={navLinkClass}>
            iPhones
          </NavLink>
          <NavLink to="/products?category=macbook" className={navLinkClass}>
            Mac
          </NavLink>
          <NavLink to="/products?category=ipad" className={navLinkClass}>
            iPad
          </NavLink>
          <NavLink to="/products?category=accessories" className={navLinkClass}>
            Accessories
          </NavLink>
          <NavLink to="/cart" className={navLinkClass}>
            Cart ({items.length})
          </NavLink>
          {user ? (
            <>
              <NavLink to="/profile" className={navLinkClass}>
                {user.name}
              </NavLink>
              {user.role === "admin" && (
                <NavLink to="/admin" className={navLinkClass}>
                  Admin
                </NavLink>
              )}
              <button
                onClick={logout}
                className="text-sm text-neutral-500 hover:text-black"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <NavLink to="/signup" className={navLinkClass}>
                Signup
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
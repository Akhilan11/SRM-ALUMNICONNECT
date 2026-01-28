import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { 
  Home,
  Bell,
  Users,
  Calendar,
  GraduationCap,
  Trophy,
  Settings,
  LogOut,
  User,
  ChevronDown,
  Menu,
  X,
  Shield,
  Star,
  Wallet,
  Bot,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Palette
} from "lucide-react";

export default function Navbar() {
  const { user, profile, role } = useAuth();
  const { currentTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const navContainerRef = useRef(null);
  const navRef = useRef(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Avatar fallback (first letter of name or email)
  const avatarLetter = profile?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "?";

  // Navigation links configuration based on role with icons
  const getNavLinks = () => {
    if (role === "admin") {
      return [
        { path: "/dashboard", label: "Dashboard", icon: Home },
        { path: "/directory", label: "Directory", icon: Users },
        { path: "/events", label: "Events", icon: Calendar },
        { path: "/mentorship", label: "Mentorship", icon: GraduationCap },
        { path: "/fundraising", label: "Fundraising", icon: Wallet },
        { path: "/achievement", label: "Achievements", icon: Trophy },
        { path: "/chatbot", label: "AI Assistant", icon: Bot },
        { path: "/chat", label: "Chat", icon: MessageCircle },
        { path: "/announcements", label: "Announcements", icon: Bell },
      ];
    } else if (role === "alumni" || role === "student") {
      return [
        { path: "/dashboard", label: "Dashboard", icon: Home },
        { path: "/events", label: "Events", icon: Calendar },
        { path: "/mentorship", label: "Mentorship", icon: GraduationCap },
        { path: "/fundraising", label: "Fundraising", icon: Wallet },
        { path: "/achievement", label: "Achievements", icon: Trophy },
        { path: "/chatbot", label: "AI Assistant", icon: Bot },
        { path: "/chat", label: "Chat", icon: MessageCircle },
        { path: "/announcements", label: "Announcements", icon: Bell },
      ];
    }
    return [];
  };

  const navLinks = getNavLinks();

  // Check scroll position for navigation arrows
  useEffect(() => {
    const checkScroll = () => {
      if (navContainerRef.current && navRef.current) {
        const container = navContainerRef.current;
        const nav = navRef.current;
        const scrollLeft = container.scrollLeft;
        const maxScroll = nav.scrollWidth - container.clientWidth;
        
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < maxScroll - 5);
      }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    
    return () => window.removeEventListener('resize', checkScroll);
  }, [navLinks]);

  const scrollNav = (direction) => {
    if (navContainerRef.current) {
      const scrollAmount = 200;
      navContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      {/* Navbar */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="navbar bg-base-100 shadow-lg sticky top-0 z-50"
      >
        <div className="navbar-start">
          {/* Mobile Menu Button */}
          <div className="dropdown lg:hidden">
            <label 
              tabIndex={0} 
              className="btn btn-ghost btn-circle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </label>
          </div>
          
          {/* Logo */}
          <Link to="/home" className="btn btn-ghost gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-content" />
            </div>
            <span className="text-xl font-bold hidden md:inline">AlumniConnect</span>
          </Link>
        </div>

        {/* Desktop Navigation - Center */}
        {user && (
          <div className="navbar-center hidden lg:flex">
            <div className="relative flex items-center">
              {/* Left Scroll Button */}
              {canScrollLeft && (
                <button
                  onClick={() => scrollNav('left')}
                  className="btn btn-circle btn-sm btn-primary absolute left-0 z-10 -translate-x-1/2"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}

              {/* Navigation Container */}
              <div 
                ref={navContainerRef}
                className="overflow-x-auto scrollbar-hide px-6 max-w-2xl"
                onScroll={() => {
                  if (navContainerRef.current) {
                    const scrollLeft = navContainerRef.current.scrollLeft;
                    const maxScroll = navContainerRef.current.scrollWidth - navContainerRef.current.clientWidth;
                    setCanScrollLeft(scrollLeft > 0);
                    setCanScrollRight(scrollLeft < maxScroll - 5);
                  }
                }}
              >
                <ul ref={navRef} className="menu menu-horizontal px-1 flex-nowrap gap-1">
                  {navLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.path}>
                        <NavLink
                          to={item.path}
                          className={({ isActive }) =>
                            `gap-2 whitespace-nowrap ${isActive ? "active bg-primary text-primary-content" : ""}`
                          }
                        >
                          <Icon className="w-4 h-4" />
                          {item.label}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Right Scroll Button */}
              {canScrollRight && (
                <button
                  onClick={() => scrollNav('right')}
                  className="btn btn-circle btn-sm btn-primary absolute right-0 z-10 translate-x-1/2"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Right Side - User Actions */}
        <div className="navbar-end gap-2">
          {!user ? (
            <Link to="/" className="btn btn-primary btn-sm">
              Login
            </Link>
          ) : (
            <>
              {/* Notification Button */}
              <button className="btn btn-ghost btn-circle hidden md:flex">
                <div className="indicator">
                  <Bell className="w-5 h-5" />
                </div>
              </button>

              {/* User Dropdown */}
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost gap-2" onClick={() => setMenuOpen(!menuOpen)}>
                  <div className="avatar placeholder">
                    <div className="bg-gradient-to-br from-primary to-secondary text-primary-content rounded-full w-8">
                      <span className="text-sm">{avatarLetter}</span>
                    </div>
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium truncate max-w-[100px]">{profile?.name || "User"}</p>
                    <p className="text-xs opacity-60">{role?.toUpperCase()}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
                </label>
                
                <AnimatePresence>
                  {menuOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      tabIndex={0}
                      className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-52 mt-2"
                    >
                      {/* User Info Header */}
                      <li className="menu-title">
                        <div className="flex items-center gap-3 py-2">
                          <div className="avatar placeholder">
                            <div className="bg-gradient-to-br from-primary to-secondary text-primary-content rounded-full w-10">
                              <span>{avatarLetter}</span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold truncate">{profile?.name || "User"}</p>
                            <p className="text-xs opacity-60 truncate">{profile?.email || user.email}</p>
                          </div>
                        </div>
                      </li>
                      <div className="divider my-0"></div>
                      
                      <li>
                        <Link to="/userprofile" onClick={() => setMenuOpen(false)}>
                          <User className="w-4 h-4" />
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link to="/setting" onClick={() => setMenuOpen(false)}>
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                      </li>
                      <li>
                        <Link to="/credits" onClick={() => setMenuOpen(false)}>
                          <Star className="w-4 h-4" />
                          Credits
                        </Link>
                      </li>
                      
                      <div className="divider my-0"></div>
                      
                      <li>
                        <button onClick={handleLogout} className="text-error">
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </li>
                      
                      {/* Theme indicator */}
                      <div className="px-4 py-2 text-xs opacity-60 flex items-center gap-2">
                        <Palette className="w-3 h-3" />
                        Theme: {currentTheme}
                      </div>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && user && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-base-200 border-b border-base-300"
          >
            <ul className="menu p-4">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `gap-3 ${isActive ? "active bg-primary text-primary-content" : ""}`
                      }
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </NavLink>
                  </li>
                );
              })}
              
              <div className="divider"></div>
              
              {/* Mobile User Info */}
              <li className="menu-title">Account</li>
              <li>
                <Link to="/userprofile" onClick={() => setMobileMenuOpen(false)}>
                  <User className="w-5 h-5" />
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/setting" onClick={() => setMobileMenuOpen(false)}>
                  <Settings className="w-5 h-5" />
                  Settings
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="text-error">
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hide scrollbar */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}

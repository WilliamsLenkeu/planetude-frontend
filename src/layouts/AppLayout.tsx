import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, Calendar, MessageCircle, BarChart2, Bell, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkle, Heart } from '../components/AestheticComponents';

const AppLayout: React.FC = () => {
    const navItems = [
        { to: '/dashboard', icon: Home, label: 'Tableau' },
        { to: '/planning', icon: Calendar, label: 'Planning' },
        { to: '/chat', icon: MessageCircle, label: 'PixelCoach' },
        { to: '/progress', icon: BarChart2, label: 'Progrès' },
        { to: '/reminders', icon: Bell, label: 'Rappels' },
        { to: '/profile', icon: User, label: 'Profil' },
    ];

    return (
        <div className="min-h-screen bg-bg selection:bg-primary-light selection:text-primary-dark flex flex-col md:flex-row">
            {/* Decorative floating elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <Sparkle className="absolute top-[10%] left-[5%]" />
                <Sparkle className="absolute top-[20%] right-[10%]" />
                <Sparkle className="absolute bottom-[30%] left-[15%]" />
                <Heart className="absolute top-[40%] right-[5%] opacity-10" size={60} />
                <Heart className="absolute bottom-[10%] right-[20%] opacity-10" size={40} />
            </div>

            {/* PC SIDEBAR */}
            <aside className="hidden md:flex flex-col w-64 glass-morphism sticky top-0 h-screen border-r border-primary-light/30 z-50 p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-12">
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="text-3xl"
                    >
                        🎀
                    </motion.div>
                    <h1 className="text-3xl text-primary font-satisfy">PlanÉtude</h1>
                </div>

                <nav className="flex-1 space-y-3">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 font-decorative font-bold ${isActive ? 'bg-primary text-white shadow-lg scale-105' : 'text-gray-400 hover:bg-primary-light/20 hover:text-primary'
                                }`
                            }
                        >
                            <item.icon size={22} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-auto">
                    <div className="bg-white/50 p-4 rounded-3xl border-2 border-dashed border-primary-light flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-white">✨</div>
                        <p className="text-[10px] font-extrabold text-primary-dark uppercase">Version 2.0 <br />Pixel Edition</p>
                    </div>
                </div>
            </aside>

            {/* MOBILE HEADER */}
            <header className="md:hidden glass-morphism sticky top-0 z-50 px-6 py-4 flex justify-between items-center shadow-lg border-b border-primary-light/30">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">🎀</span>
                    <h1 className="text-3xl text-primary font-satisfy">PlanÉtude</h1>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary shadow-sm flex items-center justify-center text-white">
                    ✨
                </div>
            </header>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 p-4 md:p-10 relative z-10 overflow-x-hidden">
                <div className="max-w-4xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={window.location.pathname}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* MOBILE BOTTOM NAV */}
            <motion.nav
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-6"
            >
                <div className="glass-morphism rounded-full flex justify-around items-center py-3 px-6 shadow-[0_-5px_25px_rgba(255,119,169,0.1)] border border-white/50">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex flex-col items-center p-2 rounded-2xl transition-all duration-300 ${isActive ? 'text-primary scale-110' : 'text-gray-400'
                                }`
                            }
                        >
                            <item.icon size={22} />
                        </NavLink>
                    ))}
                </div>
            </motion.nav>
        </div>
    );
};

export default AppLayout;

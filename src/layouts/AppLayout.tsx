import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, Calendar, MessageCircle, BarChart2, Bell, User } from 'lucide-react';

const AppLayout: React.FC = () => {
    const navItems = [
        { to: '/dashboard', icon: Home, label: 'Home' },
        { to: '/planning', icon: Calendar, label: 'Plan' },
        { to: '/chat', icon: MessageCircle, label: 'Chat' },
        { to: '/progress', icon: BarChart2, label: 'Stats' },
        { to: '/reminders', icon: Bell, label: 'Alerts' },
        { to: '/profile', icon: User, label: 'Moi' },
    ];

    return (
        <div className="min-h-screen pb-20">
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 px-6 py-4 border-b border-primary-100 flex justify-between items-center">
                <h1 className="text-2xl text-primary">PlanÉtude</h1>
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary font-bold">
                    P
                </div>
            </header>

            <main className="p-6">
                <Outlet />
            </main>

            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-primary-100 flex justify-around items-center py-2 px-4 shadow-lg md:max-w-md md:mx-auto md:rounded-t-kawaii-lg">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `flex flex-col items-center p-2 rounded-xl transition-colors ${isActive ? 'text-primary bg-primary-100' : 'text-gray-400'
                            }`
                        }
                    >
                        <item.icon size={24} />
                        <span className="text-[10px] mt-1 font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default AppLayout;

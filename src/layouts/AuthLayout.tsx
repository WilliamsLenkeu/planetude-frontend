import React from 'react';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-height-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl text-primary">PlanÉtude</h1>
                    <p className="text-gray-500">Ton compagnon d'étude trop mignon ! ✨</p>
                </div>
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;

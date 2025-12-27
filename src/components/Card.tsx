import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
    return (
        <div className={`kawaii-card ${className}`}>
            {title && <h3 className="text-xl mb-4 text-primary">{title}</h3>}
            {children}
        </div>
    );
};

export default Card;

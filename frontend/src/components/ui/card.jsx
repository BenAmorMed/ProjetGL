import React from 'react';

export const Card = ({ children, className = '' }) => {
    return (
        <div className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}>
            {children}
        </div>
    );
};

export const CardHeader = ({ children, className = '' }) => {
    return (
        <div className={`flex flex-col items-center text-center space-y-1.5 p-6 ${className}`}>
            {children}
        </div>
    );
};

export const CardTitle = ({ children, className = '' }) => {
    return (
        <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
            {children}
        </h3>
    );
};

export const CardDescription = ({ children, className = '' }) => {
    return (
        <p className={`text-sm text-gray-600 ${className}`}>
            {children}
        </p>
    );
};

export const CardContent = ({ children, className = '' }) => {
    return (
        <div className={`p-6 pt-0 ${className}`}>
            {children}
        </div>
    );
};

export default Card;

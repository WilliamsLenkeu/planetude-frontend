import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

const FormInput: React.FC<FormInputProps> = ({ label, error, ...props }) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-text mb-1 ml-2">
                {label}
            </label>
            <input
                className={`kawaii-input ${error ? 'border-red-400' : ''}`}
                {...props}
            />
            {error && <span className="text-xs text-red-500 ml-2 mt-1">{error}</span>}
        </div>
    );
};

export default FormInput;

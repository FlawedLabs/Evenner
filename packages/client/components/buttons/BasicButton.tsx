import React from 'react';

interface BasicButtonInterface {
    children: React.ReactNode;
    type: 'button' | 'submit' | 'reset';
    disabled?: boolean;
}

function BasicButton({
    children,
    type,
    disabled,
    className,
}: BasicButtonInterface & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <button
            disabled={disabled}
            type={type}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
            {children}
        </button>
    );
}

function BasicOutlinedButton({
    children,
    type,
    disabled,
    className,
}: BasicButtonInterface & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <button
            disabled={disabled}
            type="button"
            className={
                className
                    ? className
                    : `text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800`
            }
        >
            {children}
        </button>
    );
}

export { BasicButton, BasicOutlinedButton };

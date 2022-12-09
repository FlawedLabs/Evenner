import { BsDiscord, BsFacebook } from 'react-icons/bs';
import { FcGoogle } from 'react-icons/fc';

type SSOButtonProps = {
    provider: 'Discord' | 'Google' | 'Facebook' | string; // Making typescript happy
};

export default function SSOButton({
    provider,
    className,
    ...buttonProps
}: SSOButtonProps & React.HTMLAttributes<HTMLButtonElement>) {
    const getProviderIcon = () => {
        // Get Icon based on provider
        switch (provider) {
            case 'Discord':
                return (
                    <BsDiscord className="inline-flex text-2xl mr-3 text-[#5765f2]" />
                );
            case 'Google':
                return <FcGoogle className="inline-flex text-2xl mr-3" />;
            case 'Facebook':
                return (
                    <BsFacebook className="inline-flex text-2xl mr-3 text-[#1977f3]" />
                );
        }
    };

    return (
        <button
            {...buttonProps}
            className={`${className} text-gray-800 hover:bg-slate-100 dark:text-white border border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 focus:outline-none dark:focus:ring-blue-800`}
        >
            {getProviderIcon()} Sign in with {provider}
        </button>
    );
}

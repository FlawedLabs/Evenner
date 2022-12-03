import Link from 'next/link';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useContext, useState } from 'react';
import ThemeContext from '../context/ThemeContext';
import {
    BasicButton,
    BasicOutlinedButton,
} from '../components/buttons/BasicButton';
import { signOut, useSession } from 'next-auth/react';

interface BasicMenuProps {
    children: React.ReactNode;
}

export default function BasicLayout({ children }: BasicMenuProps) {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [isDropdownOpen, toggleDropdown] = useState(false);
    const { data: session, status } = useSession();

    return (
        <>
            <header>
                <nav className="bg-white border-gray-200 px-3 sm:px-4 py-3 rounded dark:bg-gray-900">
                    <div className="container flex flex-wrap items-center justify-between mx-auto">
                        <Link href="/" className="flex items-center">
                            <img
                                src="/evenner_logo.png"
                                className="h-6 mr-3 sm:h-9"
                                alt="Evenner logo"
                            />
                            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                                Evenner
                            </span>
                        </Link>

                        <div
                            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
                            id="mobile-menu-2"
                        >
                            <ul className="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                                <li>
                                    <a
                                        href="#"
                                        className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white"
                                        aria-current="page"
                                    >
                                        Home
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                                    >
                                        About
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                                    >
                                        Services
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                                    >
                                        Pricing
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                                    >
                                        Contact
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="flex items-center md:order-2">
                            <button
                                type="button"
                                className="flex mr-3 text-sm rounded-full focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-600"
                                id="user-menu-button"
                                aria-expanded="false"
                                data-dropdown-toggle="user-dropdown"
                                data-dropdown-placement="bottom"
                            >
                                {theme === 'light' ? (
                                    <MoonIcon
                                        onClick={() => toggleTheme()}
                                        className="w-6 h-6 text-gray-800"
                                    />
                                ) : (
                                    <SunIcon
                                        onClick={() => toggleTheme()}
                                        className="w-6 h-6 text-white"
                                    />
                                )}
                            </button>

                            {status === 'authenticated' ? (
                                <>
                                    <img
                                        id="avatarButton"
                                        data-dropdown-toggle="userDropdown"
                                        data-dropdown-placement="bottom-start"
                                        className="w-10 h-10 rounded-full cursor-pointer"
                                        src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80"
                                        alt="User dropdown"
                                        onClick={() =>
                                            toggleDropdown(!isDropdownOpen)
                                        }
                                    />

                                    <div
                                        id="userDropdown"
                                        style={{
                                            position: 'absolute',
                                            top: '10px',
                                            transform:
                                                'translate3d(-30px, 65px, 0px)',
                                            margin: '0px',
                                        }}
                                        className={`${
                                            isDropdownOpen ? 'block' : 'hidden'
                                        } z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600`}
                                    >
                                        <div className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                                            <div>{session?.user?.name}</div>
                                            <div className="font-medium truncate">
                                                {session?.user?.email}
                                            </div>
                                        </div>
                                        <ul
                                            className="py-1 text-sm text-gray-700 dark:text-gray-200"
                                            aria-labelledby="avatarButton"
                                        >
                                            <li>
                                                <a
                                                    href="#"
                                                    className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                >
                                                    Dashboard
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="#"
                                                    className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                >
                                                    Settings
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="#"
                                                    className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                >
                                                    Earnings
                                                </a>
                                            </li>
                                        </ul>
                                        <div className="py-1">
                                            <a
                                                href="#"
                                                onClick={() => signOut()}
                                                className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                            >
                                                Sign out
                                            </a>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link href="/register" className="mr-2">
                                        <BasicButton type="button">
                                            Sign up
                                        </BasicButton>
                                    </Link>

                                    <Link href="/signin">
                                        <BasicOutlinedButton
                                            type="button"
                                            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                                        >
                                            Sign in
                                        </BasicOutlinedButton>
                                    </Link>
                                </>
                            )}

                            <button
                                data-collapse-toggle="mobile-menu-2"
                                type="button"
                                className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                                aria-controls="mobile-menu-2"
                                aria-expanded="false"
                            >
                                <span className="sr-only">Open main menu</span>
                                <svg
                                    className="w-6 h-6"
                                    aria-hidden="true"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </nav>
            </header>
            <main>{children}</main>
        </>
    );
}

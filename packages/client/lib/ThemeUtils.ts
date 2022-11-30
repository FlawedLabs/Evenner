const getThemeFromLocalStorage = (): 'dark' | 'light' => {
    console.log(typeof window);
    const theme =
        typeof window !== 'undefined' ? localStorage.getItem('theme') : 'light';

    // Complex if to make Typescript happy
    if (theme === 'dark') {
        return theme;
    }
    return 'light';
};

export { getThemeFromLocalStorage };

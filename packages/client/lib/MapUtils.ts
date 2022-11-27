export const getMapThemeUrl = (theme: 'dark' | 'light') => {
    return theme === 'dark'
        ? `https://api.mapbox.com/styles/v1/kayoshi-dev/cl0pl248w00bk14qyov5fmih1/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
        : `https://api.mapbox.com/styles/v1/kayoshi-dev/ckzlajhj3001o14o8wcf9jcd8/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`;
};

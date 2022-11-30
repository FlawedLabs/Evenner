import type { NextPage } from 'next';
import myFunc from 'common';
import dynamic from 'next/dynamic';
import MapLoader from '../components/map/MapLoader';

const Map = dynamic(() => import('../components/map/Map'), {
    ssr: false,
    loading: MapLoader,
});

myFunc();

const Home: NextPage = () => {
    return (
        <>
            <div className="h-screen flex flex-col justify-center items-center">
                <h1 className="text-5xl font-bold pb-3 dark:text-white">
                    Evenner
                </h1>
                <div className="p-4 h-4/6 md:max-w-6xl w-full mb-6 bg-white dark:bg-[#242c37] rounded-lg transition-all ease-in-out duration-150 drop-shadow-md hover:drop-shadow-xl">
                    <Map fullscreen locate />
                </div>
            </div>
        </>
    );
};

export default Home;

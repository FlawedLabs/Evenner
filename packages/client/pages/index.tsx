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
        <div className="h-screen flex flex-col justify-center items-center">
            <h1 className="text-5xl font-bold pb-3">Evenner</h1>
            <div className="h-3/6 w-2/6">
                <Map fullscreen locate />
            </div>
        </div>
    );
};

export default Home;

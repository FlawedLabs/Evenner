import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import myFunc from 'common';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../components/map/Map'), { ssr: false });

myFunc();

const Home: NextPage = () => {
    return (
        <Map />
    );
};

export default Home;

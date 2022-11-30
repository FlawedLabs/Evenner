import 'leaflet/dist/leaflet.css';
import './map.scss';
import '/public/marker-icon.png';
import '/public/marker-shadow.png';
import { LatLngExpression } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { getMapThemeUrl } from '../../lib/MapUtils';
import { ArrowsPointingOutIcon, MapPinIcon } from '@heroicons/react/24/outline';
import {
    useState,
    useContext,
    createContext,
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
} from 'react';
import useModal from '../../hooks/useModal';
import Modal from '../modal/Modal';
import ThemeContext from '../../context/ThemeContext';

type MapProps = {
    fullscreen: boolean;
    locate: boolean;
};

// Did my best lmao
const MapContext = createContext<Dispatch<SetStateAction<LatLngExpression>>>(
    {} as Dispatch<SetStateAction<LatLngExpression>>
);

// Map component, height and width are 100% by default
export default function Map({ fullscreen = true, locate = true }: MapProps) {
    const [position, setPosition] = useState<LatLngExpression>([51.505, -0.09]);
    const { theme } = useContext(ThemeContext);
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            ref.current.setUrl(getMapThemeUrl(theme));
        }
    }, [theme]);

    return (
        <MapContainer
            className="h-full rounded-lg"
            center={position}
            zoom={6}
            scrollWheelZoom={true}
        >
            {/* Might just use a filter on the map instead of reloading the TileLayer, less call on the Mapbox API is win win */}
            <TileLayer
                attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
                url={getMapThemeUrl('light')}
                ref={ref}
            />
            <div className="leaflet-top leaflet-right">
                {fullscreen && <FullscreenButton />}

                {locate && (
                    <MapContext.Provider value={setPosition}>
                        <LocateMe />
                    </MapContext.Provider>
                )}
            </div>
            <Marker position={position}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    );
}

function FullscreenButton() {
    const { isOpen, toggle } = useModal();

    return (
        <>
            <div className="leaflet-control leaflet-bar" onClick={toggle}>
                <a
                    className="bg-white p-2 outline-none focus:outline-none"
                    href="#"
                    title="Display the map in fullscreen"
                    role="button"
                    aria-label="Display the map in fullscreen"
                    aria-disabled="false"
                >
                    <span aria-hidden="true">
                        <ArrowsPointingOutIcon />
                    </span>
                </a>
            </div>

            <Modal
                title={`Display map in fullscreen`}
                size="lg"
                hide={toggle}
                isShowing={isOpen}
            >
                <>
                    <div className="h-96">
                        <Map fullscreen={false} locate />
                    </div>

                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button
                            type="button"
                            className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Deactivate
                        </button>
                        <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </>
            </Modal>
        </>
    );
}

function LocateMe() {
    const setPosition = useContext(MapContext);
    const map = useMap();

    // Try to locate the user, update map position if successful or fail silently
    const findPosition = () => {
        navigator.geolocation.getCurrentPosition((userPosition) => {
            const { latitude, longitude } = userPosition.coords;

            setPosition([latitude, longitude]);

            // We fly to latitude, longitude, and not position because setPosition is async
            map.flyTo([latitude, longitude], 18);
        }, console.error);
    };

    return (
        <div className="leaflet-control leaflet-bar">
            <a
                onClick={findPosition}
                className="bg-white p-2 outline-none focus:outline-none"
                href="#"
                title="Locate me"
                role="button"
                aria-label="Locate me"
                aria-disabled="false"
            >
                <span aria-hidden="true">
                    <MapPinIcon />
                </span>
            </a>
        </div>
    );
}

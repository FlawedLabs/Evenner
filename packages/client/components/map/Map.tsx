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
} from 'react';

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

    return (
        <div className="p-4 h-full w-full bg-white rounded-lg transition-all ease-in-out duration-150 drop-shadow-md hover:drop-shadow-xl">
            <MapContainer
                className="h-full w-full rounded-lg"
                center={position}
                zoom={13}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
                    url={getMapThemeUrl('a')}
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
        </div>
    );
}

function FullscreenButton() {
    return (
        <div className="leaflet-control leaflet-bar">
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

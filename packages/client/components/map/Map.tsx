import "leaflet/dist/leaflet.css";
import "/public/marker-icon.png";
import "/public/marker-shadow.png";
import { LatLngExpression } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { getMapThemeUrl } from "../../lib/MapUtils";
import { ArrowsPointingOutIcon } from '@heroicons/react/24/outline'

const position: LatLngExpression = [51.505, -0.09];

export default function Map() {
    return (
        <MapContainer style={{ height: '100vh', width: '100wh' }}
            center={position} zoom={13} scrollWheelZoom={true}>
            <TileLayer
                attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
                url={getMapThemeUrl("dark")}
            />
            <FullscreenButton />
            <Marker position={position}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    )
}

function FullscreenButton() {
    return (
        <div className="absolute top-0 right-0 m-4 leaflet-top leaflet-right">
            <div className="leaflet-control leaflet-bar">
                <a className="bg-white rounded-full p-2 shadow hover:shadow-lg outline-none focus:outline-none" href="#" title="Display the map in fullscreen" role="button" aria-label="Display the map in fullscreen" aria-disabled="false">
                    <span aria-hidden="true">
                        <ArrowsPointingOutIcon />
                    </span>
                </a>
            </div>
        </div >
    );
}
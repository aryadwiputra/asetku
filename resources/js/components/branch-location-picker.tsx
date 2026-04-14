import L from 'leaflet';
import { useEffect, useId, useRef } from 'react';

import markerIcon2xUrl from 'leaflet/dist/images/marker-icon-2x.png';
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';

type Props = {
    latitude: number | null;
    longitude: number | null;
    onChange: (value: { latitude: number; longitude: number }) => void;
    readOnly?: boolean;
};

const DefaultCenter: [number, number] = [-6.2, 106.816666]; // Jakarta

export default function BranchLocationPicker({ latitude, longitude, onChange, readOnly = false }: Props) {
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const containerId = useId();

    useEffect(() => {
        // Fix marker icons for Vite bundling.
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: markerIcon2xUrl,
            iconUrl: markerIconUrl,
            shadowUrl: markerShadowUrl,
        });
    }, []);

    useEffect(() => {
        if (mapRef.current) {
            return;
        }

        const initialCenter: [number, number] =
            latitude !== null && longitude !== null ? [latitude, longitude] : DefaultCenter;

        const map = L.map(containerId, {
            center: initialCenter,
            zoom: latitude !== null && longitude !== null ? 13 : 5,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        if (!readOnly) {
            map.on('click', (event) => {
                const lat = Number(event.latlng.lat.toFixed(6));
                const lng = Number(event.latlng.lng.toFixed(6));

                onChange({ latitude: lat, longitude: lng });
            });
        }

        mapRef.current = map;

        return () => {
            map.off();
            map.remove();
            mapRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const map = mapRef.current;

        if (!map) {
            return;
        }

        if (latitude === null || longitude === null) {
            if (markerRef.current) {
                markerRef.current.remove();
                markerRef.current = null;
            }

            return;
        }

        const position: [number, number] = [latitude, longitude];

        if (!markerRef.current) {
            markerRef.current = L.marker(position, { draggable: !readOnly }).addTo(map);

            if (!readOnly) {
                markerRef.current.on('dragend', (event) => {
                    const marker = event.target as L.Marker;
                    const latlng = marker.getLatLng();

                    onChange({
                        latitude: Number(latlng.lat.toFixed(6)),
                        longitude: Number(latlng.lng.toFixed(6)),
                    });
                });
            }
        } else {
            markerRef.current.setLatLng(position);
        }

        map.setView(position, map.getZoom());
    }, [latitude, longitude, onChange]);

    return <div id={containerId} className="h-72 w-full rounded-lg border" />;
}

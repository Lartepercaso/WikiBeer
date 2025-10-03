import React, { useMemo } from 'react';
import { BreweryPost } from '../types';

interface MapComponentProps {
    userLocation: { lat: number; lng: number } | null;
    breweries: BreweryPost[];
}

const MapComponent: React.FC<MapComponentProps> = ({ userLocation, breweries }) => {
    
    const gpxData = useMemo(() => {
        const userWpt = userLocation 
            ? `<wpt lat="${userLocation.lat}" lon="${userLocation.lng}"><name>La tua posizione</name></wpt>`
            : '';
            
        const breweryWpts = breweries.map(b => 
            `<wpt lat="${b.lat}" lon="${b.lng}"><name>${b.name.replace(/&/g, '&amp;')}</name></wpt>`
        ).join('');

        return `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
<gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1" creator="WikiBeer & Brewery">
  <metadata><name>Birrerie</name></metadata>
  ${userWpt}
  ${breweryWpts}
</gpx>`;
    }, [userLocation, breweries]);
    
    // OpenStreetMap si adatterà automaticamente ai dati GPX, non serve più il bbox
    const mapSrc = `https://www.openstreetmap.org/export/embed.html?layer=mapnik&gpx_data=${encodeURIComponent(gpxData)}`;

    if (!userLocation) {
        return <div className="text-center p-8">Ottenimento della posizione...</div>;
    }

    return (
        <div className="container mx-auto p-4 animate-fade-in">
            <h2 className="text-2xl font-bold text-amber-900 mb-4 text-center">Mappa Birrerie</h2>
            <div className="w-full h-80 rounded-lg shadow-lg overflow-hidden border-4 border-amber-800">
                <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    src={mapSrc}
                    title="Mappa delle birrerie"
                    style={{ border: 0 }}
                ></iframe>
            </div>
             <p className="text-center text-sm text-gray-600 mt-2">
                La mappa mostra la tua posizione e le birrerie recensite.
            </p>
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in { animation: fade-in 0.5s ease-in-out; }
            `}</style>
        </div>
    );
};

export default MapComponent;
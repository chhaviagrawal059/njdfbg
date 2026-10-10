import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { MapPin, ExternalLink, Users, AlertCircle } from 'lucide-react';

// Custom SVG icon generator for map pins
const createCustomIcon = (urgency, isSafetyOverride) => {
  let color = '#2563eb'; // blue
  if (isSafetyOverride) color = '#dc2626'; // red
  else if (urgency === 'Immediate' || urgency === 'Critical') color = '#e11d48';
  else if (urgency === 'High') color = '#d97706'; // amber
  else if (urgency === 'Medium') color = '#0284c7'; // sky

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="28" height="42">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24c0-6.627-5.373-12-12-12z" fill="${color}" stroke="#ffffff" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="5" fill="#ffffff"/>
    </svg>
  `;

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: svg,
    iconSize: [28, 42],
    iconAnchor: [14, 42],
    popupAnchor: [0, -38]
  });
};

// District coordinates in Jharkhand for fallback if lat/lon not set
export const DISTRICT_COORDS = {
  "Ranchi": [23.3441, 85.3096],
  "Khunti": [22.9734, 85.2589],
  "Dhanbad": [23.7957, 86.4304],
  "East Singhbhum": [22.8046, 86.2029],
  "West Singhbhum": [22.5532, 85.8093],
  "Bokaro": [23.6693, 86.1511],
  "Deoghar": [24.4826, 86.7000],
  "Hazaribagh": [23.9961, 85.3644],
  "Simdega": [22.6145, 84.5122],
  "Latehar": [23.7438, 84.5015],
  "Palamu": [24.0384, 84.0729],
  "Ramgarh": [23.6324, 85.5144],
  "Giridih": [24.1856, 86.3079],
  "Dumka": [24.2676, 87.2486],
  "Gumla": [23.0425, 84.5422],
  "Lohardaga": [23.4357, 84.6781],
  "Garhwa": [24.1610, 83.8055],
  "Godda": [24.8267, 87.2144],
  "Jamtara": [23.9629, 86.8016],
  "Koderma": [24.4674, 85.5939],
  "Pakur": [24.6333, 87.8489],
  "Sahebganj": [25.2425, 87.6433],
  "Seraikela Kharsawan": [22.6997, 85.9324],
  "Chatra": [24.2100, 84.8719]
};

export const JharkhandMap = ({ challenges = [], selectedDistrict, onSelectChallenge, height = "520px" }) => {
  const jharkhandCenter = [23.6102, 85.2799];

  return (
    <div className="w-full relative rounded-xl overflow-hidden border border-slate-200 shadow-sm" style={{ height }}>
      <MapContainer
        center={selectedDistrict && DISTRICT_COORDS[selectedDistrict] ? DISTRICT_COORDS[selectedDistrict] : jharkhandCenter}
        zoom={selectedDistrict ? 9 : 8}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {challenges.map((ch) => {
          let lat = ch.latitude;
          let lon = ch.longitude;

          // If no precise GPS, fallback to district center with slight offset
          if (!lat || !lon) {
            const center = DISTRICT_COORDS[ch.district] || jharkhandCenter;
            lat = center[0] + (Math.random() - 0.5) * 0.05;
            lon = center[1] + (Math.random() - 0.5) * 0.05;
          }

          const icon = createCustomIcon(ch.urgency, ch.is_safety_override);

          return (
            <Marker key={ch.id} position={[lat, lon]} icon={icon}>
              <Popup className="custom-popup min-w-[280px]">
                <div className="p-1 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800">
                      {ch.category}
                    </span>
                    <StatusBadge status={ch.status} />
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 leading-snug">
                    {ch.title}
                  </h4>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {ch.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {ch.district} {ch.village ? `• ${ch.village}` : ''}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {ch.affected_population?.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <PriorityBadge
                      tier={ch.priority_tier}
                      score={ch.priority_score}
                      isSafetyOverride={ch.is_safety_override}
                    />

                    {onSelectChallenge && (
                      <button
                        onClick={() => onSelectChallenge(ch.id)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 ml-auto"
                      >
                        View Project <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur px-3 py-2 rounded-lg border border-slate-200 shadow-md text-xs space-y-1">
        <div className="font-semibold text-slate-800 mb-1">GIS Priority Legend</div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-600"></span>
          <span>Critical / Emergency Safety Override</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
          <span>High Urgency</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-600"></span>
          <span>Medium / Standard Civic Project</span>
        </div>
      </div>
    </div>
  );
};

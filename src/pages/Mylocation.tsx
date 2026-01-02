// import React, { useEffect, useState } from "react";
// import "./MyLocation.css";

// const MyLocation: React.FC = () => {
//   const [location, setLocation] = useState<{
//     lat: number;
//     lng: number;
//   } | null>(null);

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         setLocation({
//           lat: pos.coords.latitude,
//           lng: pos.coords.longitude,
//         });
//       },
//       () => {
//         alert("Location access denied.");
//       }
//     );
//   }, []);

//   return (
//     <div className="my-location-page">
//       <div className="my-location-card">
//         <h2>My Location</h2>

//         {location ? (
//           <>
//             <p>
//               <strong>Latitude:</strong> {location.lat}
//             </p>
//             <p>
//               <strong>Longitude:</strong> {location.lng}
//             </p>
//           </>
//         ) : (
//           <p className="loading-text">Fetching your location…</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyLocation;
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";

// Fix marker icon in bundlers
const DefaultIcon = L.icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

type Coords = { lat: number; lng: number };

interface Props {
  onAddressChange?: (address: string) => void;
}

const defaultCenter: Coords = {
  lat: 27.7172, // Kathmandu
  lng: 85.3240,
};

const CurrentLocationMap: React.FC<Props> = ({ onAddressChange }) => {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [address, setAddress] = useState<string>("Detecting your location...");

  useEffect(() => {
    if (!navigator.geolocation) {
      setAddress("Geolocation is not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const newCoords = { lat: latitude, lng: longitude };
        setCoords(newCoords);

        // Reverse geocode via Nominatim (OpenStreetMap)
        try {
          const url =
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2` +
            `&lat=${latitude}&lon=${longitude}`;
          const res = await fetch(url, {
            headers: {
              "Accept": "application/json",
              // Nominatim usage policy: identify your app or email
              "User-Agent": "poojabooking-student-project",
            },
          });
          const data = await res.json();
          const display =
            data.display_name ||
            `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

          setAddress(display);
          localStorage.setItem("detectedLocation", display);
          if (onAddressChange) onAddressChange(display);
        } catch (e) {
          console.error("Reverse geocoding failed", e);
          const fallback = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
          setAddress(fallback);
          localStorage.setItem("detectedLocation", fallback);
          if (onAddressChange) onAddressChange(fallback);
        }
      },
      (err) => {
        console.error(err);
        setAddress("Could not access your location. Please allow location.");
      }
    );
  }, [onAddressChange]);

  return (
    <div>
      <p style={{ marginBottom: "0.5rem" }}>{address}</p>
      <div style={{ width: "100%", height: "300px" }}>
        <MapContainer
          center={coords || defaultCenter}
          zoom={coords ? 16 : 13}
          scrollWheelZoom={true}
          style={{ width: "100%", height: "100%", borderRadius: "12px" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {coords && <Marker position={[coords.lat, coords.lng]} />}
        </MapContainer>
      </div>
    </div>
  );
};

export default CurrentLocationMap;

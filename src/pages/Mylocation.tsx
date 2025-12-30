import React, { useEffect, useState } from "react";
import "./MyLocation.css";

const MyLocation: React.FC = () => {
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        alert("Location access denied.");
      }
    );
  }, []);

  return (
    <div className="my-location-page">
      <div className="my-location-card">
        <h2>My Location</h2>

        {location ? (
          <>
            <p>
              <strong>Latitude:</strong> {location.lat}
            </p>
            <p>
              <strong>Longitude:</strong> {location.lng}
            </p>
          </>
        ) : (
          <p className="loading-text">Fetching your location…</p>
        )}
      </div>
    </div>
  );
};

export default MyLocation;

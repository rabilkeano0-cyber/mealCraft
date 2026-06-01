import React, { useState } from 'react';

interface Props {
  location: string | null;
  setLocation: React.Dispatch<React.SetStateAction<string | null>>;
}

const MapLocationPicker: React.FC<Props> = ({
  location,
  setLocation,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolokasi tidak didukung oleh browser Anda.');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationString =
          `${position.coords.latitude},${position.coords.longitude}`;

        setLocation(locationString);
        alert(`Lokasi dipilih: ${locationString}`);

        setIsLoading(false);
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError(
              'Akses lokasi ditolak. Izinkan lokasi di pengaturan browser untuk menggunakan fitur ini.'
            );
            break;

          case err.POSITION_UNAVAILABLE:
            setError(
              'Sinyal GPS tidak ditemukan. Pastikan layanan lokasi perangkat menyala.'
            );
            break;

          case err.TIMEOUT:
            setError('Waktu permintaan habis. Coba lagi.');
            break;

          default:
            setError('Terjadi kesalahan sistem.');
        }

        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        maxWidth: '600px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h3 style={{ margin: 0 }}>Pilih Lokasi Anda</h3>

        <button
          onClick={handleGetLocation}
          disabled={isLoading}
          style={{
            padding: '8px 16px',
            cursor: 'pointer',
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          {isLoading
            ? 'Mencari Titik...'
            : '📍 Gunakan Lokasi Saat Ini'}
        </button>
      </div>

      {error && (
        <div
          style={{
            color: '#D8000C',
            backgroundColor: '#FFD2D2',
            padding: '10px',
            borderRadius: '4px',
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          width: '100%',
          height: '400px',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid #ccc',
        }}
      >
        {location ? (
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=${location}&z=16&output=embed`}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#e9ecef',
            }}
          >
            Peta akan muncul di sini setelah lokasi didapatkan.
          </div>
        )}
      </div>
    </div>
  );
};

export default MapLocationPicker;
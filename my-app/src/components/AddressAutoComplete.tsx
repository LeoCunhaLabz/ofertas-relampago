import React, { useState, useRef, useEffect } from 'react';
import Script from 'next/script';

export const AddressAutocomplete = ({ onSelectAddress, value }: { onSelectAddress: (address: string) => void, value: string }) => {
  const [address, setAddress] = useState(value ?? '');
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (value) {
      setAddress(value);
      if (typeof window !== 'undefined' && window.google) {
        initAutocomplete();
      }
    }
  }, [value]);

  const initAutocomplete = () => {
    const inputElement = inputRef.current;
    const autocomplete = new window.google.maps.places.Autocomplete(inputElement, {
      types: ['geocode'], // Restrict search to addresses
      componentRestrictions: { country: 'br' } // Restrict search to Brazil
    });
    autocomplete.setFields(['formatted_address', 'geometry']); // Limit return fields
    autocompleteRef.current = autocomplete;

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        return;
      }
      const address = place.formatted_address;
      const lat = place.geometry.location?.lat();
      const lng = place.geometry.location?.lng();
      setAddress(address);
      onSelectAddress({ address, lat, lng });
    });
  };

  const handleBlur = () => {
    const autocomplete = autocompleteRef.current;
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (!place || !place.geometry) {
        // Se o usuário não selecionou nenhuma sugestão, forçamos a seleção da primeira sugestão
        const service = new window.google.maps.places.AutocompleteService();
        service.getPlacePredictions({ input: address, types: ['geocode'], componentRestrictions: { country: 'br' } }, (predictions) => {
          if (predictions && predictions.length > 0) {
            const firstPrediction = predictions[0];
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ placeId: firstPrediction.place_id }, (results, status) => {
              if (status === 'OK' && results[0]) {
                const selectedPlace = results[0];
                const selectedAddress = selectedPlace.formatted_address;
                const lat = selectedPlace.geometry.location.lat();
                const lng = selectedPlace.geometry.location.lng();
                setAddress(selectedAddress);
                onSelectAddress({ address: selectedAddress, lat, lng });
              }
            });
          }
        });
      } else {
        const address = place.formatted_address;
        const lat = place.geometry.location?.lat();
        const lng = place.geometry.location?.lng();
        setAddress(address);
        onSelectAddress({ address, lat, lng });
      }
    }
  }

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.select();
    }
  };

  return (
    <div className=' text-left flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-0 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900'>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyAYOtIM6-sMhF4t3qikmmKbIbz_dqEFTYI&libraries=places`}
        strategy="lazyOnload"
        onLoad={() => {
          if (typeof window !== 'undefined' && window.google) {
            initAutocomplete();
          }
        }}
      />
      <input
        ref={inputRef}
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder="Digite seu endereço"
        style={{ width: '100%', padding: '10px', border: 'none', outline: 'none'  }}
        autoComplete='off'
      />
    </div>
  );
};

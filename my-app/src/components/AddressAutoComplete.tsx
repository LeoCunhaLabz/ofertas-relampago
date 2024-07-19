import React, { useState, useRef, useEffect } from 'react';
import Script from 'next/script';

export const AddressAutocomplete = ({ onSelectAddress, value }) => {
  const [address, setAddress] = useState(value || '');
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
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['geocode'], // Restringe a busca a endereços
      componentRestrictions: { country: 'br' } // Restringe a busca ao Brasil
    });
    autocomplete.setFields(['formatted_address', 'geometry']); // Limita os campos de retorno
    autocompleteRef.current = autocomplete;

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        return;
      }
      const address = place.formatted_address;
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setAddress(address);
      onSelectAddress({ address, lat, lng });
    });
  };

  return (
    <div className=' text-left flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900'>
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
        placeholder="Digite seu endereço"
        style={{ width: '100%', padding: '10px' }}
      />
    </div>
  );
};

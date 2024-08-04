import React, { useState, useRef, useEffect } from 'react';
import Script from 'next/script';

export const AddressAutocomplete = ({ onSelectAddress, value }: { onSelectAddress: any, value: any }) => {
  const [address, setAddress] = useState(value || '');
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
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
    const inputElement = inputRef.current as unknown as HTMLInputElement;
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
    const inputElement = inputRef.current as unknown as HTMLInputElement;
    const address = inputElement.value;
    setAddress(address);
    onSelectAddress({ address });
  }

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
        onBlur = {handleBlur}
        placeholder="Digite seu endereço"
        style={{ width: '100%', padding: '10px' }}
        autoComplete='off'
      />
    </div>
  );
};

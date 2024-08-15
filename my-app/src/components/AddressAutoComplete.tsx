import React, { useState, useRef, useEffect } from 'react';
import Script from 'next/script';
import debounce from 'lodash.debounce';

export const AddressAutocomplete = ({ onSelectAddress, value }: { onSelectAddress: any, value: any }) => {
  const [address, setAddress] = useState(value || '');
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const previousAddressRef = useRef<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value) {
      setAddress(value);
      if (typeof window !== 'undefined' && window.google) {
        debouncedInitAutocomplete();
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

  const debouncedInitAutocomplete = debounce(initAutocomplete, 500); // debounce delay of 300ms

  const handleBlur = debounce(() => {
    const inputElement = inputRef.current as unknown as HTMLInputElement;
    const currentAddress = inputElement.value;
  
    // Check if address has changed before making API calls
    if (currentAddress !== previousAddressRef.current) {
      previousAddressRef.current = currentAddress;
  
      if (autocompleteRef.current) {
        const place = autocompleteRef.current.getPlace();
        if (!place || !place.geometry) {
          const service = new window.google.maps.places.AutocompleteService();
          service.getPlacePredictions({ input: currentAddress, types: ['geocode'], componentRestrictions: { country: 'br' } }, (predictions, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions && predictions.length > 0) {
              const firstPrediction = predictions[0];
              const placesService = new window.google.maps.places.PlacesService(document.createElement('div'));
              placesService.getDetails({ placeId: firstPrediction.place_id }, (placeDetails, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && placeDetails && placeDetails.geometry) {
                  const address = placeDetails.formatted_address;
                  const lat = placeDetails.geometry.location?.lat();
                  const lng = placeDetails.geometry.location?.lng();
                  setAddress(address);
                  onSelectAddress({ address, lat, lng });
                }
              });
            }
          });
        } else {
          setAddress(currentAddress);
          onSelectAddress({ address: currentAddress });
        }
      }
    }
  }, 300); // debounce delay of 300ms  

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.select();
    }
  };

  const handleChange = (value: string) => {
    setAddress(value);
  }

  return (
    <div className=' text-left flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-0 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900'>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyAYOtIM6-sMhF4t3qikmmKbIbz_dqEFTYI&libraries=places`}
        strategy="lazyOnload"
        onLoad={() => {
          if (typeof window !== 'undefined' && window.google) {
            debouncedInitAutocomplete();
          }
        }}
      />
      <input
        ref={inputRef}
        type="text"
        value={address}
        onChange={(e) => handleChange(e.target.value)}
        onBlur = {handleBlur}
        onFocus = {handleFocus}
        placeholder="Digite seu endereço"
        style={{ width: '100%', padding: '10px', border: 'none', outline: 'none'  }}
        autoComplete='off'
      />
    </div>
  );
};
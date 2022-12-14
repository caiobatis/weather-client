import React, { memo, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import services from 'services';
import { Geolocalization, LocationContextPayload } from './types';
import { LocationProvider } from '.';

function LocationContainer({ children }: PropsWithChildren): React.ReactElement {
  // eslint-disable-next-line
  const [coords, setCoords] = useState<GeolocationPosition['coords'] | null>(null);

  const [geolocalization, setGeolocalization] = useState<Geolocalization>();

  const getGeolocalization = async (lat: number, long: number) => {
    try {
      const response = await services.geolocalization.getGeolocalization(lat, long);

      return setGeolocalization(response?.results[0].components);
    } catch (error) {
      return error;
    }
  };

  const getLocation = async () => {
    try {
      // eslint-disable-next-line
      const { coords } = (await services.location.getLocation()) as GeolocationPosition;

      setCoords(coords);

      getGeolocalization(coords.latitude, coords.longitude);

      return;
    } catch (error) {
      toast.error('Acesso negado a Geolocalização, faça uma busca.');

      return error;
    }
  };

  useEffect(() => {
    void getLocation();
    // eslint-disable-next-line
  }, []);

  const payload = useMemo<LocationContextPayload>(
    () => ({
      geolocalization,
      coords,
    }),
    [geolocalization, coords],
  );

  return <LocationProvider value={payload}>{children}</LocationProvider>;
}

export default memo(LocationContainer);


import type {Marker} from '@googlemaps/markerclusterer';
import React, {useCallback} from 'react';
import {AdvancedMarker} from '@vis.gl/react-google-maps';
import { PostedJob } from './postedJobs';

export type TreeMarkerProps = {
  postedJobs: PostedJob;
  onClick: (postedJobs: PostedJob) => void;
  setMarkerRef: (marker: Marker | null, key: string) => void;
};

/**
 * Wrapper Component for an AdvancedMarker for a single tree.
 */
export const TreeMarker = (props: TreeMarkerProps) => {
  const {postedJobs, onClick, setMarkerRef} = props;

  console.log("postedJobs", postedJobs.locationLat, postedJobs.locationLng)

  const handleClick = useCallback(() => onClick(postedJobs), [onClick, postedJobs]);
  const ref = useCallback(
    (marker: google.maps.marker.AdvancedMarkerElement) =>
      setMarkerRef(marker, postedJobs.key),
    [setMarkerRef, postedJobs.key]
  );

  return (
    <AdvancedMarker  position={{
      lat: postedJobs.locationLat
        ? postedJobs.locationLat
        : 44.96797106363888,
      lng: postedJobs.locationLng
        ? postedJobs.locationLng
        : -93.26177106829272,
    }} ref={ref} onClick={handleClick}>
      <span className="marker-clustering-tree">🌳</span>
    </AdvancedMarker>
  );
};

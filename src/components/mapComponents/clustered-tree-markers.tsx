import {InfoWindow, useMap} from '@vis.gl/react-google-maps';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {type Marker, MarkerClusterer} from '@googlemaps/markerclusterer';
import {
    doc,
    getDoc,
    collectionGroup,
  
    query,
    collection,
    onSnapshot,
  } from "firebase/firestore";
  import { db } from "../../firebaseConfig";
import {TreeMarker} from './tree-marker.tsx';

import { PostedJob } from './postedJobs';

export type ClusteredTreeMarkersProps = {
  postedJobs: PostedJob[]
};



/**
 * The ClusteredTreeMarkers component is responsible for integrating the
 * markers with the markerclusterer.
 */
export const ClusteredTreeMarkers = ({postedJobs}: ClusteredTreeMarkersProps) => {
  const [markers, setMarkers] = useState<{[key: string]: Marker}>({});
  const [selectedTreeKey, setSelectedTreeKey] = useState<string | null>(null);
   
  

  const selectedTree = useMemo(
    () =>
        postedJobs && selectedTreeKey
        ? postedJobs.find(t => t.key === selectedTreeKey)!
        : null,
    [postedJobs, selectedTreeKey]
  );

  // create the markerClusterer once the map is available and update it when
  // the markers are changed
  const map = useMap();
  const clusterer = useMemo(() => {
    if (!map) return null;

    return new MarkerClusterer({map});
  }, [map]);

  useEffect(() => {
    if (!clusterer) return;

    clusterer.clearMarkers();
    clusterer.addMarkers(Object.values(markers));
  }, [clusterer, markers]);

  // this callback will effectively get passsed as ref to the markers to keep
  // tracks of markers currently on the map
  const setMarkerRef = useCallback((marker: Marker | null, key: string) => {
    setMarkers(markers => {
      if ((marker && markers[key]) || (!marker && !markers[key]))
        return markers;

      if (marker) {
        return {...markers, [key]: marker};
      } else {
        const {[key]: _, ...newMarkers} = markers;

        return newMarkers;
      }
    });
  }, []);

  const handleInfoWindowClose = useCallback(() => {
    setSelectedTreeKey(null);
  }, []);

  const handleMarkerClick = useCallback((postedJobs : PostedJob) => {
    setSelectedTreeKey(postedJobs.key);
  }, []);



  

  return (
    <>
      {postedJobs ? postedJobs.map(postedJobs => (
        <TreeMarker
          key={postedJobs.key}
          postedJobs={postedJobs}
          onClick={handleMarkerClick}
          setMarkerRef={setMarkerRef}
        />
      )): null}

      
    </>
  );
};

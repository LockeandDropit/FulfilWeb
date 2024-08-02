
import {Marker} from '@googlemaps/markerclusterer';
import React, {useCallback} from 'react';
import {AdvancedMarker} from '@vis.gl/react-google-maps';

// export type TreeMarkerProps = {
//   tree: Tree;
//   onClick: (tree: Tree) => void;
//   setMarkerRef: (marker: Marker | null, key: string) => void;
// };

/**
 * Wrapper Component for an AdvancedMarker for a single tree.
 */
export const SingleMarker = (props) => {
  const {tree, onClick, setMarkerRef} = props;

  const handleClick = useCallback(() => onClick(tree), [onClick, tree]);
  const ref = useCallback(
    (marker) =>
      setMarkerRef(marker, tree.key),
    [setMarkerRef, tree.key]
  );



//Q's: How will it handle thousands of data points?
// How can it scale constantly calling for thousands of pieces of information from FB everytime someone loads the page?
// randomly assigning  


// on retrieving the info from FB, I could chop the  data up into like 4 different groups, 
//achieve this by looping vier data once it's collected 
//onChange of zoom, I could check and see if the zoom level matches the level with the zoom group. 
// if it does, render the marker.

  return (
    <AdvancedMarker  position={{
        lat: tree.locationLat
          ? tree.locationLat
          : 44.96797106363888,
        lng: tree.locationLng
          ? tree.locationLng
          : -93.26177106829272,
      }} ref={ref} onClick={handleClick}>
      <button
                          type="button"
                          class=" -z-30 py-1 px-3 inline-flex items-center gap-x-2 text-xs font-semibold rounded-lg border border-transparent bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:pointer-events-none"
                        >
                          {tree.isVolunteer ? (
                            <p>Volunteer!</p>
                          ) : tree.isSalaried ? (
                            <p>
                              ${tree.lowerRate} yearly - ${tree.upperRate} yearly
                            </p>
                          ) : (tree.upperRate > tree.lowerRate ?  (<p>
                            ${tree.lowerRate}/hr + 
                          </p>) : ( <p>
                              ${tree.lowerRate}/hr
                            </p>)
                           
                          )}
                        </button>
    </AdvancedMarker>
  );
};

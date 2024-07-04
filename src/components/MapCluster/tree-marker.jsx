
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
export const TreeMarker = (props) => {
  const {tree, onClick, setMarkerRef} = props;

  const handleClick = useCallback(() => onClick(tree), [onClick, tree]);
  const ref = useCallback(
    (marker) =>
      setMarkerRef(marker, tree.key),
    [setMarkerRef, tree.key]
  );

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
                          class="py-1 px-3 inline-flex items-center gap-x-2 text-xs font-semibold rounded-lg border border-transparent bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:pointer-events-none"
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

import React, {useEffect, useState, useMemo} from 'react';
import {createRoot} from 'react-dom/client';

import {APIProvider, Map} from '@vis.gl/react-google-maps';

import { ControlPanel } from './control-panel.tsx';
import {getCategories, loadTreeDataset, Tree} from './trees.tsx';
import { ClusteredTreeMarkers } from './clustered-tree-markers.tsx';
import { getJobsData, PostedJob } from './postedJobs.tsx';


const API_KEY =
  globalThis.REACT_APP_GOOGLE_API_KEY ?? (process.env.REACT_APP_GOOGLE_API_KEY as string);

/**
 * The App component contains the APIProvider, Map and ControlPanel and handles
 * data-loading and filtering.
 */

// // All credit to react-google-maps. Clustering and TS code came from https://github.com/visgl/react-google-maps/tree/main/examples/marker-clustering/src. MIT license 
// MIT License

// Copyright (c) 2023 Vis.gl contributors

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


const App = () => {
  const [jobs, setJobs] = useState<PostedJob[]>();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // load data asynchronously




  // get category information for the filter-dropdown
  const categories = useMemo(() => getCategories(jobs), [jobs]);
  const filteredTrees = useMemo(() => {
    if (!jobs) return null;

    return jobs.filter(
      t => !selectedCategory || t.category === selectedCategory
    );
  }, [jobs, selectedCategory]);

  const defaultLat = 44.96797106363888;
  const defaultLong = -93.26177106829272;

  return (
    <APIProvider apiKey={API_KEY}>
      <Map
        mapId={'bf51a910020fa25a'}
        defaultCenter={{lat: defaultLat, lng: defaultLong}}
        defaultZoom={10}
        gestureHandling={'greedy'}
        disableDefaultUI>
        {/* {filteredTrees && <ClusteredTreeMarkers postedJobs={filteredTrees} />} */}
      </Map>

      {/* <ControlPanel
        categories={categories}
        onCategoryChange={setSelectedCategory}
      /> */}
    </APIProvider>
  );
};

export default App;


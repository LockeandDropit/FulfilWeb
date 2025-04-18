import React, { useState, useEffect, useRef } from 'react';

const Dropdown = () => {

//gpt wrote this whole this

  // State to handle the open/close state of the dropdown
  const [open, setOpen] = useState(false);
  // State to store the current selection
  const [status, setStatus] = useState('For Sale');

  // Create a ref for the dropdown container to handle outside clicks
  const dropdownRef = useRef(null);

  // Handler to toggle the dropdown open/closed
  const toggleDropdown = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  // Handler to update the selected status
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  // Handle click outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup the event listener on unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {/* Dropdown Trigger Button */}
      <button
        onClick={toggleDropdown}
        className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <span>{status}</span>
        {/* Arrow Icon */}
        <svg
          className="ml-2 h-5 w-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white border border-gray-200 z-10 transition transform origin-top-right"
        >
          <div className="p-2">
            {/* Radio Option: For Sale */}
            <label className="flex items-center px-3 py-1 rounded hover:bg-gray-50">
              <input
                type="radio"
                name="listingStatus"
                value="For Sale"
                checked={status === 'For Sale'}
                onChange={handleStatusChange}
                className="form-radio text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-gray-700">For Sale</span>
            </label>

            {/* Radio Option: For Rent */}
            <label className="flex items-center px-3 py-1 rounded hover:bg-gray-50">
              <input
                type="radio"
                name="listingStatus"
                value="For Rent"
                checked={status === 'For Rent'}
                onChange={handleStatusChange}
                className="form-radio text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-gray-700">For Rent</span>
            </label>

            {/* Radio Option: Sold */}
            <label className="flex items-center px-3 py-1 rounded hover:bg-gray-50">
              <input
                type="radio"
                name="listingStatus"
                value="Sold"
                checked={status === 'Sold'}
                onChange={handleStatusChange}
                className="form-radio text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-gray-700">Sold</span>
            </label>
          </div>

          <div className="px-3 py-2">
            <button
              onClick={() => setOpen(false)}
              className="w-full px-3 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;

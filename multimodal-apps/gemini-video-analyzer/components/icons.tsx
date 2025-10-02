import React from 'react';

// Using Heroicons (MIT License) - outline style
export const IconMap: Record<string, React.ReactNode> = {
  food: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 12a9.75 9.75 0 11-19.5 0 9.75 9.75 0 0119.5 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM21.75 12H18M6 12H2.25M12 2.25V6M12 18v3.75M15.75 15.75l-2.644-2.644M8.25 8.25L5.606 5.606M15.75 8.25l2.644-2.644M8.25 15.75l-2.644 2.644" />
    </svg>
  ),
  ingredient: ( // Alias for food or more specific
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75L18.75 12.75l-3-3L12.75 12l3 3.75zM12.75 9.75L9.75 12.75l-3-3L9.75 9l3 .75zM4.5 19.5l15-15" />
    </svg>
  ),
  exercise: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h3m-3 0V3M6 6H3m3 0v3M3 10.5v3m0 3h3m0-3h3m3 0h3m0 0v-3m0 3v3m-3 0h-3m3 0h3m-6 0v3m0-3H6m12-3V6m0 3H9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM15.75 18a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  ),
  muscle: ( 
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 8.25l-2.25 2.25 2.25 2.25M9.75 8.25l2.25 2.25-2.25 2.25M6.75 11.25h10.5M5.25 15h13.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
    </svg>
  ),
  tech: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
    </svg>
  ),
  computer: ( 
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
    </svg>
  ),
  phone: (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75A2.25 2.25 0 0015.75 1.5h-2.25m-3 0V3m3 0V3m0 0h.008v12H9.75M12 15h.008v.008H12V15zm-.002-3h.004v.004h-.004V12z" />
    </svg>
  ),
  software: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  ),
  object: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
  ),
  person: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  nature: ( // Landscape, could be used for environment
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
       <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-3.032-2.468-5.5-5.5-5.5S8.5 8.968 8.5 12c0 3.032 2.468 5.5 5.5 5.5S19.5 15.032 19.5 12z" />
    </svg>
  ),
  action: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 3L6 7.5M10.5 3l4.5 4.5M13.5 21l4.5-4.5m-4.5 4.5L9 16.5" />
    </svg>
  ),
  generic: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L22.75 5.25l-.813 2.846a4.5 4.5 0 00-3.09 3.09L16.25 12l2.846.813a4.5 4.5 0 003.09 3.09L22.75 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L18.25 12z" />
    </svg>
  ),
  dolphin: ( // Represents animals, using fingerprint as a generic unique entity
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33" />
    </svg>
  ),
  ocean: ( // Simple wave icon for ocean, water, sea
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 9.75c3 0 4.5 3 7.5 3s4.5-3 7.5-3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 14.25c3 0 4.5 3 7.5 3s4.5-3 7.5-3" />
    </svg>
  ),
  water: ( // Alias for ocean
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 9.75c3 0 4.5 3 7.5 3s4.5-3 7.5-3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 14.25c3 0 4.5 3 7.5 3s4.5-3 7.5-3" />
    </svg>
  ),
  environment: ( // Alias for nature
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
       <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-3.032-2.468-5.5-5.5-5.5S8.5 8.968 8.5 12c0 3.032 2.468 5.5 5.5 5.5S19.5 15.032 19.5 12z" />
    </svg>
  ),
  default: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
  ),
  // Add more specific icons as needed, e.g. tomato, dumbbell, car
  tomato: (
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-red-500">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 1.8.63 3.43 1.69 4.76L5.1 22h13.8l-1.59-8.24C18.37 12.43 19 10.8 19 9c0-3.87-3.13-7-7-7zm0 2c2.76 0 5 2.24 5 5 0 1.08-.35 2.08-.94 2.9A5.002 5.002 0 0012 11a5.002 5.002 0 00-4.06-3.1C7.35 7.08 7 6.08 7 5c0-2.76 2.24-5 5-5z" />
        <path d="M10 4.5C10 4.22 10.22 4 10.5 4h3c.28 0 .5.22.5.5V6h-4V4.5z" />
    </svg>
  ),
   dumbbell: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-gray-400">
        <path d="M20 7h-2V5h2v2zm-2 2h2v2h-2V9zm2 4h-2v2h2v-2zm-5-5H7v6h8V8zm-2-1c.55 0 1-.45 1-1s-.45-1-1-1h-4c-.55 0-1 .45-1 1s.45 1 1 1h4zm7-1V5c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v1H7V5c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v1H0v8h1V9c0-1.1.9-2 2-2h1v2H3c-.55 0-1 .45-1 1s.45 1 1 1h1v2H3c-.55 0-1 .45-1 1s.45 1 1 1h1v2H3c-.55 0-1 .45-1 1s.45 1 1 1h1v1c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-1h8v1c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-1h1v-2h-1c.55 0 1-.45 1-1s-.45-1-1-1h-1v-2h1c.55 0 1-.45 1-1s-.45-1-1-1zM5 19H3v-1h2v1zm14 0h-2v-1h2v1zm-1-2h-2v-2h2v2zm-4 0H9v-2h4v2zm-4-4H7V9h2v4z"/>
    </svg>
  ),
};


export const getIconByName = (keyword?: string): React.ReactNode => {
  if (!keyword) return IconMap.default;
  const lowerKeyword = keyword.toLowerCase().replace(/\s+/g, ''); // Remove spaces for better matching

  // Try exact match first
  if (IconMap[lowerKeyword]) return IconMap[lowerKeyword];

  // Try matching common variations or root words by checking if the keyword includes a map key
  // This helps if API returns "ocean waves" and IconMap has "ocean"
  for (const key in IconMap) {
    if (key === 'default') continue; // Don't partially match 'default'
    if (lowerKeyword.includes(key)) return IconMap[key];
  }
  
  // Check for common pluralizations (s, es)
  if (lowerKeyword.endsWith('s')) {
    const singular = lowerKeyword.slice(0, -1);
    if (IconMap[singular]) return IconMap[singular];
  }
  if (lowerKeyword.endsWith('es')) {
    const singular = lowerKeyword.slice(0, -2);
    if (IconMap[singular]) return IconMap[singular];
  }

  return IconMap.default; // Fallback to default
};

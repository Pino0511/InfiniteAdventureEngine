import React from 'react';

interface SidebarProps {
  quest: string;
  inventory: string[];
}

const ScrollIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const BagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);


const Sidebar: React.FC<SidebarProps> = ({ quest, inventory }) => {
  return (
    <aside className="w-full lg:w-1/4 bg-gray-900/80 backdrop-blur-sm p-6 rounded-lg border border-indigo-900/50 shadow-lg h-full">
      <div className="mb-8">
        <h2 className="font-medieval text-2xl text-amber-300 mb-4 flex items-center border-b-2 border-amber-300/20 pb-2">
          <ScrollIcon />
          Current Quest
        </h2>
        <p className="text-gray-300 text-lg leading-relaxed">{quest || 'Your adventure is just beginning...'}</p>
      </div>
      <div>
        <h2 className="font-medieval text-2xl text-amber-300 mb-4 flex items-center border-b-2 border-amber-300/20 pb-2">
          <BagIcon />
          Inventory
        </h2>
        {inventory.length > 0 ? (
          <ul className="space-y-2">
            {inventory.map((item, index) => (
              <li key={index} className="text-gray-300 text-lg capitalize bg-gray-800/50 px-3 py-2 rounded-md shadow-sm">
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 italic">Your bag is empty.</p>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;

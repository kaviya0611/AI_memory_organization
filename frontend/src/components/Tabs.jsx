import React from 'react'

export function Tabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="border-b border-gray-200 overflow-x-auto scrollbar-thin">
      <div className="flex space-x-4 sm:space-x-6 min-w-max py-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-3.5 px-2 border-b-2 font-bold text-xs sm:text-sm transition-all whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

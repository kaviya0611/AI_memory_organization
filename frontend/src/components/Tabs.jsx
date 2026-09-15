import React from 'react'

export function Tabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="border-b border-slate-200 overflow-x-auto scrollbar-thin">
      <div className="flex space-x-1 sm:space-x-2 min-w-max py-2 px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-2.5 px-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap flex items-center space-x-2 ${
                isActive
                  ? 'bg-[#1C52C2] text-white shadow-md'
                  : 'text-slate-600 hover:text-[#071A45] hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                  isActive ? 'bg-[#FFC000] text-[#071A45]' : 'bg-blue-100 text-[#1C52C2]'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

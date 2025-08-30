export default function ImpactMetrics() {
  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header */}
      <div className="relative bg-white/70 backdrop-blur-xl border border-black/[0.05] rounded-3xl p-6 text-center shadow-[0_1px_0_rgba(0,0,0,0.04),0_30px_60px_-30px_rgba(0,0,0,0.25)] overflow-hidden">
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover opacity-90"
          style={{
            backgroundImage: "url('/recyclablesbg.jpg')",
            backgroundPosition: "bottom center",
            backgroundSize: "150%"
          }}
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/10 to-transparent" />
        <div className="relative inline-flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-2xl">♻️</div>
          <div className="flex items-center gap-2 text-xs text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live • 47 items</span>
          </div>
        </div>
        <h2 className="relative text-white text-[22px] leading-7 font-medium tracking-tight">Today&apos;s impact at The Garage</h2>
      </div>

      {/* Metrics grid */}
      <div className="flex flex-col gap-3 flex-1 min-h-0">
        {/* First row - 3 cards */}
        <div className="grid grid-cols-3 gap-3">
        {/* Recyclables */}
        <div className="bg-white/70 backdrop-blur-xl border border-black/5 rounded-3xl p-5 shadow-sm flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M4 12a8 8 0 0 1 8-8V2.5L16 6l-4 3.5V8a6 6 0 1 0 6 6h1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-emerald-600 text-xs font-medium">+48%</span>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <div className="text-gray-600 text-xs font-medium mb-3">Recyclables</div>
            <div className="relative w-20 h-20 mb-3">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(rgb(16,185,129) 67%, rgba(16,185,129,0.1) 67% 100%)`,
                }}
              />
              <div className="absolute inset-1 rounded-full bg-white/90 backdrop-blur" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-900 text-2xl font-bold">23</span>
              </div>
            </div>
            <div className="text-gray-500 text-xs">3.2kg saved</div>
          </div>
        </div>

        {/* Organic Waste */}
        <div className="bg-white/70 backdrop-blur-xl border border-black/5 rounded-3xl p-5 shadow-sm flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M7 20h10M7 16h10M12 4v12M8 8l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-emerald-600 text-xs font-medium">+32%</span>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <div className="text-gray-600 text-xs font-medium mb-3">Organic Waste</div>
            <div className="relative w-20 h-20 mb-3">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(rgb(16,185,129) 50%, rgba(16,185,129,0.1) 50% 100%)`,
                }}
              />
              <div className="absolute inset-1 rounded-full bg-white/90 backdrop-blur" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-900 text-2xl font-bold">12</span>
              </div>
            </div>
            <div className="text-gray-500 text-xs">1.8kg rich soil</div>
          </div>
        </div>



        {/* General */}
        <div className="bg-white/70 backdrop-blur-xl border border-black/5 rounded-3xl p-5 shadow-sm flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18l-1.68 9.6A2 2 0 0 1 17.36 17H6.64a2 2 0 0 1-1.96-1.4L3 6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-orange-500 text-xs font-medium">-15%</span>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <div className="text-gray-600 text-xs font-medium mb-3">General Waste</div>
            <div className="relative w-20 h-20 mb-3">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(rgb(107,114,128) 33%, rgba(107,114,128,0.1) 33% 100%)`,
                }}
              />
              <div className="absolute inset-1 rounded-full bg-white/90 backdrop-blur" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-900 text-2xl font-bold">6</span>
              </div>
            </div>
            <div className="text-gray-500 text-xs">Minimized disposal</div>
          </div>
        </div>
        </div>

        {/* Second row - 2 cards */}
        <div className="grid grid-cols-2 gap-3 flex-1">
        {/* CO2 Emissions Saved */}
        <div className="bg-white/70 backdrop-blur-xl border border-black/5 rounded-3xl p-5 shadow-sm flex flex-col relative overflow-hidden">
          {/* Background image */}
          <div 
            className="absolute inset-0 bg-cover opacity-20"
            style={{
              backgroundImage: "url('/co2bg.png')",
              backgroundPosition: "center",
              backgroundSize: "cover"
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/80 via-transparent to-blue-50/80" />
          
          <div className="relative flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 16.5v2A2.5 2.5 0 0 0 5.5 21h13a2.5 2.5 0 0 0 2.5-2.5v-2M8.5 10.5L12 14l3.5-3.5M12 3v11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-green-600 text-xs font-medium">-85%</span>
          </div>
          <div className="relative flex-1 flex flex-col justify-center items-center text-center">
            <div className="text-gray-600 text-xs font-medium mb-3">CO2 Emissions Saved</div>
            <div className="relative w-20 h-20 mb-3">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(rgb(34,197,94) 85%, rgba(34,197,94,0.1) 85% 100%)`,
                }}
              />
              <div className="absolute inset-1 rounded-full bg-white/90 backdrop-blur" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-900 text-2xl font-bold">42</span>
              </div>
            </div>
            <div className="text-gray-500 text-xs">kg CO2 prevented today</div>
          </div>
        </div>

      {/* Summary */}
      <div className="bg-white/70 backdrop-blur-xl border border-black/5 rounded-3xl p-5 shadow-sm relative overflow-hidden">
        {/* Ocean wave background pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
            <path d="M0,50 Q100,20 200,50 T400,50 L400,100 L0,100 Z" fill="currentColor" className="text-blue-500"/>
            <path d="M0,60 Q150,30 300,60 T600,60 L600,100 L0,100 Z" fill="currentColor" className="text-blue-400"/>
          </svg>
        </div>
        
        <div className="relative flex flex-col items-center text-center h-full">
          {/* Top - Ocean Impact */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <span className="text-lg">🐢</span>
            </div>
            <div className="text-gray-600 text-sm font-medium">Ocean Impact</div>
          </div>
          
          {/* Center - Main content */}
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="text-gray-800 text-lg font-semibold mb-1">127 Sea Turtles</div>
            <div className="text-gray-500 text-xs">equivalent saved from ocean pollution</div>
          </div>
          
          {/* Bottom - Impact percentage */}
          <div className="flex items-center gap-1 mt-4">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-emerald-600 text-xs font-medium">+15% impact today</span>
          </div>
        </div>
        </div>
        </div>
      </div>
    </div>
  );
}

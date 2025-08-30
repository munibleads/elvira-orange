import { Card, CardContent } from "@/components/ui/card";

export default function CardFour() {
  return (
    <Card className="w-1/3 h-full bg-white/70 backdrop-blur-xl border-black/5 shadow-lg relative overflow-hidden group hover:shadow-xl transition-all duration-300">
      {/* Background */}
      <div className="absolute inset-0 bg-[#525661]" />
      
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent" />
      
      <CardContent className="relative flex-1 flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white/80 text-sm font-medium">Your Eco-Progress</span>
          </div>
          <div className="text-white/60 text-xs bg-white/10 px-2 py-1 rounded-full backdrop-blur">
            Live
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center mb-6">
          <div className="text-white/90 text-lg font-semibold mb-4">Carbon Footprint Reduced</div>
          
          {/* Enhanced circular progress */}
          <div className="relative w-24 h-24 mx-auto mb-4">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="6"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#ff8d30"
                strokeWidth="6"
                strokeDasharray={`${85 * 2.83} ${15 * 2.83}`}
                strokeLinecap="round"
                className="drop-shadow-lg"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="text-white text-3xl font-bold block">42</span>
                <span className="text-white/70 text-xs">kg</span>
              </div>
            </div>
          </div>
          
          <div className="text-white/80 text-sm">by your actions today</div>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white/5 rounded-xl backdrop-blur border border-white/10">
            <div className="text-white text-lg font-bold">156</div>
            <div className="text-white/60 text-xs">Weekly Impact</div>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-xl backdrop-blur border border-white/10">
            <div className="text-white text-lg font-bold">85%</div>
            <div className="text-white/60 text-xs">Monthly Goal</div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-green-400/20 to-transparent rounded-full blur-xl" />
        <div className="absolute bottom-6 left-4 w-12 h-12 bg-gradient-to-br from-orange-400/20 to-transparent rounded-full blur-lg" />
      </CardContent>
    </Card>
  );
}

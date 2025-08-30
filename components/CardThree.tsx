import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Recycle, Leaf, AlertTriangle } from "lucide-react";

export default function CardThree() {
  const binData = [
    {
      name: "Recyclables",
      items: 120,
      fullness: 75,
      icon: Recycle,
      color: "bg-blue-500/20 text-blue-300",
    },
    {
      name: "Non Recyclables",
      items: 80,
      fullness: 50,
      icon: Trash2,
      color: "bg-slate-500/20 text-slate-300",
    },
    {
      name: "Organic",
      items: 50,
      fullness: 30,
      icon: Leaf,
      color: "bg-emerald-500/20 text-emerald-300",
    },
  ];

  const getFullnessStatus = (fullness: number) => {
    if (fullness >= 80) return { text: "Almost Full", color: "bg-red-500/20 text-red-400 border border-red-500/30" };
    if (fullness >= 60) return { text: "", color: "" };
    return { text: "", color: "" };
  };

  return (
    <div className="flex gap-4 w-full">
      {binData.map((bin, index) => {
        const Icon = bin.icon;
        const status = getFullnessStatus(bin.fullness);
        
        return (
          <Card key={index} className="flex flex-col justify-center flex-1 shadow-lg bg-[#183063] text-gray-200 border border-blue-900/50">
            <CardContent className="p-6">
              <div className="flex flex-col items-center mb-5">
                <div className={`p-4 rounded-lg ${bin.color} mb-4`}>
                  <Icon className="h-10 w-10" />
                </div>
                <h3 className="font-semibold text-2xl text-white text-center">{bin.name}</h3>
                <p className="text-xl text-gray-400">{bin.items} items</p>
              </div>
              
              <div className="flex-1 space-y-5">
                {status.text && (
                  <Badge variant="outline" className={`${status.color} w-full justify-center py-4 text-xl`}>
                    {status.text}
                  </Badge>
                )}
                
                <div className="space-y-2">
                  <div className="relative w-28 h-28 mx-auto">
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `conic-gradient(#ff8d30 ${bin.fullness}%, rgba(255,255,255,0.1) ${bin.fullness}% 100%)`,
                      }}
                    />
                    <div className="absolute inset-1 rounded-full bg-[#183063]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">{bin.fullness}%</span>
                    </div>
                  </div>
                </div>

                {bin.fullness >= 80 && (
                  <div className="flex items-center justify-center gap-2 text-amber-400 !mt-4">
                    <AlertTriangle className="h-6 w-6" />
                    <span className="text-base font-medium">Needs emptying</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

import { Card, CardContent } from "@/components/ui/card";

export default function CardTwo() {
  return (
    <Card className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-[#0F1016] text-white">
      <CardContent className="text-center p-10">
        <p className="text-3xl font-bold mb-4">Please place your item in the smart bin below</p>
        <p className="text-xl text-gray-200">The smart bin will automatically sort your item into the correct compartmnt.</p>
      </CardContent>
    </Card>
  );
}

import { useQuery } from "@tanstack/react-query";
import { InfoIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface VLSFOPrice {
  price: number;
  month: string;
  year: number;
}

export default function FuelPriceDisplay() {
  const { data, isLoading, error } = useQuery<VLSFOPrice>({
    queryKey: ['/api/vlsfo-price'],
  });

  if (isLoading) {
    return (
      <Card className="w-full bg-white/80 backdrop-blur-sm mb-6">
        <CardContent className="p-4">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full bg-white/80 backdrop-blur-sm mb-6">
        <CardContent className="p-4 text-red-600">
          Price temporarily unavailable
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-gradient-to-br from-blue-50 to-blue-100/90 backdrop-blur-md mb-6 shadow-xl border-blue-200 hover:shadow-2xl transition-all">
      <CardContent className="p-8">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-blue-900 tracking-tight">
              Current Global VLSFO Price
              <p className="text-sm font-normal mt-1 text-blue-800">
                Very Low Sulfur Fuel Oil (VLSFO) - the maritime industry standard fuel that complies with IMO 2020 emissions regulations
              </p>
            </h3>
            <p className="text-4xl font-extrabold text-blue-700 mt-4 flex items-baseline">
              ${data?.price}
              <span className="text-xl font-semibold text-blue-600 ml-1">/MT</span>
              <span className="text-sm font-medium text-blue-500 ml-3 tracking-wide">
                ({data?.month} {data?.year})
              </span>
            </p>
            <p className="text-sm font-medium text-blue-600 mt-4 tracking-wide">
              Global Reference Price - February 2025
            </p>
          </div>
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon className="h-5 w-5 text-slate-400 cursor-help" /> {/* Changed here */}
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-white border-blue-200 shadow-lg max-w-[300px] p-2">
              <div className="space-y-2">
                <h4 className="font-medium text-blue-900">Monthly Average VLSFO Fuel Price</h4>
                <p className="text-sm text-slate-800 leading-snug">
                  Based on Ship & Bunker's Global 20 Ports Average. Monthly averages provide a stable reference point, smoothing out daily price fluctuations.
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardContent>
    </Card>
  );
}
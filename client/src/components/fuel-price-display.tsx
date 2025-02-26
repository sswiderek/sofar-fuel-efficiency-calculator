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
              <InfoIcon className="h-5 w-5 text-blue-500 cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-slate-50 border-2 border-blue-100 shadow-md">
              <div className="max-w-[280px] p-3">
                <h4 className="text-base font-medium text-slate-900 mb-2">About This Fuel Price</h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  This is the price of marine-grade low sulfur fuel, which most ships use to meet environmental regulations. The price shown is a monthly average from the world's 20 largest ports.
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardContent>
    </Card>
  );
}
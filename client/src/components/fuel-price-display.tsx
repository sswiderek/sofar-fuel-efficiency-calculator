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
    <Card className="w-full bg-white/80 backdrop-blur-sm mb-6">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Current Global VLSFO Price
            </h3>
            <p className="text-2xl font-bold text-blue-600">
              ${data?.price}/MT
              <span className="text-sm font-normal text-slate-600 ml-2">
                ({data?.month} {data?.year})
              </span>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Based on the Global 20 Ports Average
            </p>
          </div>
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon className="h-5 w-5 text-slate-400" />
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-2 p-1">
                <h4 className="font-medium">Price Information</h4>
                <p className="max-w-[200px] text-sm text-muted-foreground leading-snug">
                  Global monthly average price, updated on the 1st of each month using previous month's data.
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardContent>
    </Card>
  );
}

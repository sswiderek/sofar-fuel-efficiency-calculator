import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CalculatorForm from "@/components/calculator-form";
import { WavesIcon, Fuel as FuelIcon, DollarSign as DollarSignIcon, LeafIcon, Globe as GlobeIcon, SettingsIcon, BarChartIcon, TrendingUpIcon, TargetIcon, ChevronRightIcon } from "lucide-react";

export default function Calculator() {
  return (
    <div className="min-h-screen w-full p-4 md:p-8" style={{ 
      backgroundImage: 'url(/images/ocean.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="max-w-6xl mx-auto">
        <Card className="w-full shadow-xl bg-white/80 backdrop-blur-sm ring-1 ring-slate-100">
          <CardHeader className="pb-4 border-b bg-gradient-to-r from-blue-50/50 to-sky-50/50">
            <div className="flex items-center gap-6 py-4">
              <img src="/images/sofar-logov2.png" alt="Sofar Logo" className="h-12 w-auto" />
              <div className="border-l pl-6 border-slate-200">
                <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
                  Maritime Fuel Savings Simulator
                </CardTitle>
                <p className="text-sm text-slate-600 mt-1.5 tracking-wide">
                  Estimate your cost savings and <span className="text-emerald-600 font-medium">CO₂</span> reduction with Wayfinder
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Powered by Sofar Ocean's weather routing technology
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-4 bg-gradient-to-r from-sky-50 to-white border border-sky-100 rounded-lg">
              <h2 className="text-base font-medium text-slate-900 mb-1">How it works</h2>
              <p className="text-xs text-slate-600 mb-2">This calculator helps you estimate potential fuel savings and environmental impact using Sofar's Wayfinder platform:</p>
              <ul className="list-disc list-inside text-xs text-slate-600 space-y-0.5 ml-1">
                <li>Enter your fleet details and current fuel usage</li>
                <li>View savings scenarios based on real-world data</li>
                <li>Compare cost reductions and CO₂ savings across different optimization levels</li>
              </ul>
            </div>
            <CalculatorForm />

            <div className="my-8 relative">
              <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-blue-200/70 to-transparent"></div>
              <div className="relative flex justify-center">
                <span className="bg-white/80 backdrop-blur-sm px-4 py-1 text-sm font-medium text-blue-900/70 rounded-full border border-blue-100/50 shadow-sm">
                  Explore Real-World Results
                </span>
              </div>
            </div>

            <Card className="bg-gradient-to-br from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white shadow-xl transform hover:scale-[1.01] hover:shadow-2xl transition-all duration-300 border border-blue-700/50 cursor-pointer group overflow-hidden rounded-xl">
              <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-blue-500/30 p-2 rounded-full">
                      <TargetIcon className="h-5 w-5 text-blue-100" />
                    </span>
                    <h3 className="text-lg font-semibold text-white">Real-World Success Stories</h3>
                  </div>
                  <p className="text-blue-100 mb-3">2024 Savings Report: Major fuel savings achieved across global routes</p>
                  <a href="#" className="inline-flex items-center text-sm font-medium text-blue-100 hover:text-white transition-colors">
                    Download 2024 savings report
                    <ChevronRightIcon className="h-4 w-4 ml-1" />
                  </a>
                </div>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
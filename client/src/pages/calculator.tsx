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
            <div className="mt-8">
              <div className="space-y-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-sky-100"> {/* Removed shadow-lg */}
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Assumptions Made in This Calculator
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-sky-50/50 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="bg-sky-100 p-2 rounded-lg">
                          <BarChartIcon className="h-5 w-5 text-sky-700" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">Voyage Time and Port Operations</p>
                          <p className="text-xs text-slate-600 mt-1">The calculator accounts for both sea time and necessary port operations between voyages, reflecting real-world shipping operations.</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-sky-50/50 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="bg-sky-100 p-2 rounded-lg">
                          <FuelIcon className="h-5 w-5 text-sky-700" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">VLSFO Fuel Type</p>
                          <p className="text-xs text-slate-600 mt-1">Calculations use Very Low Sulfur Fuel Oil (VLSFO) prices, which is the primary marine fuel used to comply with IMO 2020 sulfur regulations.</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-sky-50/50 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="bg-sky-100 p-2 rounded-lg">
                          <TrendingUpIcon className="h-5 w-5 text-sky-700" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">Estimated Savings Range</p>
                          <p className="text-xs text-slate-600 mt-1">The fuel savings percentage is estimated between 3% to 7%, based on typical results from Sofar Ocean's Wayfinder platform.</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-sky-50/50 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="bg-sky-100 p-2 rounded-lg">
                          <LeafIcon className="h-5 w-5 text-sky-700" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">CO₂ Emissions Reduction</p>
                          <p className="text-xs text-slate-600 mt-1">Each metric ton of fuel burned produces 3.15 metric tons of CO₂ based on standard shipping benchmarks.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Card className="bg-gradient-to-br from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white shadow-xl transform hover:scale-102 hover:shadow-2xl transition-all duration-300 border border-blue-700/50 cursor-pointer group overflow-hidden">
                  <a href="https://www.sofarocean.com/posts/wayfinder-voyage-optimization-savings-report-2024" target="_blank" rel="noopener noreferrer" className="block relative h-full">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
                    <div className="flex flex-col justify-center min-h-[180px] p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-blue-700/50 group-hover:bg-blue-600/50 transition-colors duration-200">
                          <TargetIcon className="h-5 w-5 text-blue-100" />
                        </div>
                        <CardTitle className="text-xl">Real-World Success Stories</CardTitle>
                      </div>
                      <p className="text-blue-200 text-base mb-3">2024 Savings Report: Major fuel savings achieved across global routes</p>
                      <div className="flex items-center gap-2 text-blue-200 text-sm font-medium">
                        <span>Download 2024 savings report</span>
                        <ChevronRightIcon className="h-4 w-4" />
                      </div>
                    </div>
                  </a>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
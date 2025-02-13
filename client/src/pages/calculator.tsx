import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CalculatorForm from "@/components/calculator-form";
import { WavesIcon, Fuel as FuelIcon, DollarSign as DollarSignIcon, LeafIcon, Globe as GlobeIcon, SettingsIcon, BarChartIcon, TrendingUpIcon } from "lucide-react";

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
          <CardHeader className="space-y-2 pb-4 border-b">
            <div className="flex items-center gap-4 py-3">
              <img src="/images/sofar-logo.png" alt="Sofar Logo" className="h-10 w-auto" />
              <div className="border-l pl-4 border-slate-200">
                <CardTitle className="text-2xl font-light tracking-tight text-slate-900">
                  Fuel Savings Calculator
                </CardTitle>
                <p className="text-xs text-slate-500 mt-1 tracking-wide">
                  Estimate potential fuel cost savings and CO₂ emission reductions using Sofar Ocean's Wayfinder platform
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-3 bg-gradient-to-r from-sky-50 to-white border border-sky-100 rounded-lg">
              <h2 className="text-base font-medium text-slate-900 mb-1">How it works</h2>
              <ul className="list-disc list-inside text-xs text-slate-600 space-y-0.5 ml-1">
                <li>Enter your fleet details and current fuel usage</li>
                <li>View savings scenarios based on real-world data</li>
                <li>Compare cost reductions and CO₂ savings across optimization levels</li>
              </ul>
            </div>
            <CalculatorForm />
            <div className="mt-8">
              <div className="bg-gradient-to-br from-sky-100 to-white/80 rounded-lg p-4 w-full">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
                  Assumptions Made in This Calculator
                  <SettingsIcon className="h-5 w-5 text-sky-600" />
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <BarChartIcon className="h-5 w-5 text-slate-700 mt-1 shrink-0" />
                    <div>
                      <p className="font-medium text-slate-900">Fuel Consumption is Based on Daily Averages</p>
                      <p className="text-sm text-slate-600">The calculator assumes a constant fuel consumption rate (MT/day) for the entire voyage duration.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <DollarSignIcon className="h-5 w-5 text-slate-700 mt-1 shrink-0" />
                    <div>
                      <p className="font-medium text-slate-900">Fuel Price is Static</p>
                      <p className="text-sm text-slate-600">The fuel price entered is considered fixed for the voyage. Fluctuations in fuel prices are not accounted for.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUpIcon className="h-5 w-5 text-slate-700 mt-1 shrink-0" />
                    <div>
                      <p className="font-medium text-slate-900">Estimated Savings Range</p>
                      <p className="text-sm text-slate-600">The fuel savings percentage is estimated between 4% to 10%, based on typical results from Sofar Ocean's Wayfinder platform.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <LeafIcon className="h-5 w-5 text-slate-700 mt-1 shrink-0" />
                    <div>
                      <p className="font-medium text-slate-900">CO₂ Emissions Reduction</p>
                      <p className="text-sm text-slate-600">Each metric ton of fuel burned produces 3.15 metric tons of CO₂ based on standard shipping benchmarks.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <Card className="transform transition-transform hover:scale-105 cursor-pointer bg-gradient-to-br from-blue-900 to-blue-800 text-white shadow-xl">
            <a href="https://www.sofarocean.com/posts/weather-maritime-shipping-white-paper" target="_blank" rel="noopener noreferrer">
              <CardHeader className="space-y-2">
                <CardTitle className="text-xl">Validate Your Savings</CardTitle>
                <p className="text-lg text-blue-200">Case Study & Analysis</p>
              </CardHeader>
              <CardContent>
                <p className="text-base leading-relaxed">See how leading shipping companies achieve 4-8% fuel savings using weather routing technology.</p>
              </CardContent>
            </a>
          </Card>
        </Card>
      </div>
    </div>
  );
}
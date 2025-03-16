import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CalculatorForm from "@/components/calculator-form";
import AssumptionsSection from "@/components/assumptions-section";
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
                <li>Get a comprehensive cost breakdown across your entire fleet</li>
                <li>See projected annual fuel savings and CO₂ emission reductions</li>
              </ul>
            </div>
            <CalculatorForm />
            <div className="mt-12 mb-8">
              <AssumptionsSection />
            </div>
            <div className="space-y-6">
                
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
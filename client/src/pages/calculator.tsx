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
              <div className="space-y-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-sky-100">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-6">
                    <SettingsIcon className="h-5 w-5 text-sky-600" />
                    Assumptions Made in This Calculator
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-sky-50/50 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="bg-sky-100 p-2 rounded-lg">
                          <BarChartIcon className="h-5 w-5 text-sky-700" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">Fuel Consumption is Based on Daily Averages</p>
                          <p className="text-sm text-slate-600 mt-1">The calculator assumes a constant fuel consumption rate (MT/day) for the entire voyage duration.</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-sky-50/50 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="bg-sky-100 p-2 rounded-lg">
                          <DollarSignIcon className="h-5 w-5 text-sky-700" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">Fuel Price is Static</p>
                          <p className="text-sm text-slate-600 mt-1">The fuel price entered is considered fixed for the voyage. Fluctuations in fuel prices are not accounted for.</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-sky-50/50 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="bg-sky-100 p-2 rounded-lg">
                          <TrendingUpIcon className="h-5 w-5 text-sky-700" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">Estimated Savings Range</p>
                          <p className="text-sm text-slate-600 mt-1">The fuel savings percentage is estimated between 4% to 10%, based on typical results from Sofar Ocean's Wayfinder platform.</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-sky-50/50 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="bg-sky-100 p-2 rounded-lg">
                          <LeafIcon className="h-5 w-5 text-sky-700" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">CO₂ Emissions Reduction</p>
                          <p className="text-sm text-slate-600 mt-1">Each metric ton of fuel burned produces 3.15 metric tons of CO₂ based on standard shipping benchmarks.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Card className="bg-gradient-to-br from-blue-900 to-blue-800 text-white shadow-xl transform hover:scale-102 hover:shadow-2xl transition-all duration-200 border border-blue-700 cursor-pointer group">
                  <a href="https://www.sofarocean.com/posts/weather-maritime-shipping-white-paper" target="_blank" rel="noopener noreferrer" className="block relative">
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-200"></div>
                    <CardHeader className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-800/50 p-2 rounded-lg">
                          <GlobeIcon className="h-5 w-5 text-blue-200" />
                        </div>
                        <CardTitle className="text-xl">Validate Your Savings</CardTitle>
                      </div>
                      <p className="text-blue-200 text-base">Case Study & Analysis</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed text-blue-100 flex items-center gap-2">
                        See how leading shipping companies achieve 4-8% fuel savings using weather routing technology
                        <span className="inline-block transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                      </p>
                    </CardContent>
                  </a>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <footer className="bg-[#0A1628] text-white mt-20">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <img src="/images/sofar-logo.png" alt="Sofar Logo" className="h-8 w-auto mb-6" />
              <p className="text-sm text-gray-400">The global leader in ocean intelligence, delivering the insights you need to make better decisions.</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Solutions</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Maritime Operations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Weather Intelligence</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Ocean Data</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Spotter Buoy</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Request Demo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
              <p>&copy; 2024 Sofar Ocean Technologies. All rights reserved.</p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Ship, Anchor, Navigation, Compass } from "lucide-react";
import { useEffect } from "react";

export default function Calculator() {
  // Function to handle redirection to Sofar Ocean's signup page
  const navigateToSofarSignup = () => {
    window.open("https://www.sofarocean.com/signup/wayfinder-demo", "_blank");
  };

  return (
    <div
      className="min-h-screen w-full p-4 md:p-8"
      style={{
        backgroundImage: "url(/images/ocean.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-3xl mx-auto">
        <Card className="w-full shadow-xl bg-white/90 backdrop-blur-sm ring-1 ring-slate-100">
          <CardHeader className="pb-4 border-b bg-gradient-to-r from-blue-50/50 to-sky-50/50">
            <div className="flex items-center gap-6 py-4">
              <img
                src="/images/sofar-logov2.png"
                alt="Sofar Logo"
                className="h-12 w-auto"
              />
              <div className="border-l pl-6 border-slate-200">
                <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
                  Wayfinder by Sofar Ocean
                </CardTitle>
                <p className="text-sm text-slate-600 mt-1.5 tracking-wide">
                  Advanced weather routing and maritime optimization
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6 text-center">
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-blue-100 p-4">
                  <Ship className="h-12 w-12 text-blue-600" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-slate-900">
                Ready to optimize your maritime operations?
              </h2>
              
              <p className="text-base text-slate-600 max-w-xl mx-auto">
                Wayfinder helps shipping companies reduce fuel consumption, lower emissions, and improve voyage planning through advanced weather routing technology.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 text-left">
                <div className="flex items-start gap-3 p-4 bg-white/80 rounded-lg border border-slate-200">
                  <div className="bg-emerald-100 rounded-full p-2">
                    <Anchor className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">Reduce Fuel Consumption</h3>
                    <p className="text-sm text-slate-600">Save 5-12% on fuel costs with optimal routing</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-white/80 rounded-lg border border-slate-200">
                  <div className="bg-blue-100 rounded-full p-2">
                    <Navigation className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">Real-time Weather Data</h3>
                    <p className="text-sm text-slate-600">Make decisions based on high-precision forecasts</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-white/80 rounded-lg border border-slate-200">
                  <div className="bg-indigo-100 rounded-full p-2">
                    <Compass className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">Route Optimization</h3>
                    <p className="text-sm text-slate-600">AI-powered algorithms for optimal voyage planning</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-white/80 rounded-lg border border-slate-200">
                  <div className="bg-amber-100 rounded-full p-2">
                    <ExternalLink className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">Easy Integration</h3>
                    <p className="text-sm text-slate-600">Seamlessly connect with your existing fleet management systems</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <Button 
                  onClick={navigateToSofarSignup} 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg h-auto"
                >
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Request a Wayfinder Demo
                </Button>
                <p className="text-sm text-slate-500 mt-3">
                  Sign up for a personalized demonstration of Sofar Ocean's Wayfinder platform
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

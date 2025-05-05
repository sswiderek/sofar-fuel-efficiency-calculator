import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart3, 
  LineChart, 
  DollarSign, 
  Users, 
  Ship, 
  Leaf, 
  Calendar, 
  ExternalLink,
  ArrowUpRight,
  Trash2
} from 'lucide-react';

interface DemoClick {
  totalFuelCost: number;
  estimatedSavings: number;
  fuelCostWithWayfinder: number;
  co2Reduction: number;
  totalFuelConsumption: number;
  vesselCount: number;
  timestamp: string;
  ip?: string;
  userAgent?: string;
  shareLink?: string;
}

export default function AdminAnalyticsDashboard() {
  const [demoClicks, setDemoClicks] = useState<DemoClick[]>([]);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Check if admin is authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      setLocation('/admin');
      toast({
        title: 'Authentication Required',
        description: 'Please login to access the analytics dashboard',
        variant: 'destructive'
      });
    }
  }, [setLocation, toast]);

  // Load analytics data
  useEffect(() => {
    // Retrieve clicks from local storage
    const storedClicks = localStorage.getItem('demoClicks');
    if (storedClicks) {
      try {
        const clicks = JSON.parse(storedClicks) as DemoClick[];
        // Sort by timestamp, most recent first
        clicks.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setDemoClicks(clicks);
      } catch (e) {
        console.error('Failed to parse stored demo clicks', e);
      }
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    setLocation('/admin');
  };

  // If there are no demo clicks yet
  if (demoClicks.length === 0) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-100">
              <BarChart3 className="h-5 w-5 text-blue-700" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Wayfinder Demo Request Analytics</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Back to Calculator
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        <Card className="bg-white shadow-md border-0">
          <CardContent className="pt-6 pb-8">
            <div className="text-center py-12 space-y-4">
              <div className="inline-flex mx-auto items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                <BarChart3 className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-medium text-slate-700">No Analytics Data Yet</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                When users interact with the Wayfinder demo request feature, their activity will appear here.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Function to delete a demo click
  const handleDeleteClick = (indexToDelete: number) => {
    // Create a new array without the deleted item
    const updatedClicks = demoClicks.filter((_, index) => index !== indexToDelete);
    
    // Update state
    setDemoClicks(updatedClicks);
    
    // Save to localStorage
    localStorage.setItem('demoClicks', JSON.stringify(updatedClicks));
    
    // Show toast
    toast({
      title: "Record deleted",
      description: "Demo request record has been removed",
    });
  };

  // Calculate summary metrics
  const totalRequests = demoClicks.length;
  const avgSavings = Math.round(demoClicks.reduce((sum, click) => sum + click.estimatedSavings, 0) / totalRequests);
  const avgFleetSize = Math.round(demoClicks.reduce((sum, click) => sum + click.vesselCount, 0) / totalRequests * 10) / 10;
  const totalFuelSaved = demoClicks.reduce((sum, click) => sum + (click.totalFuelConsumption * 0.05), 0);
  const totalCO2Reduced = demoClicks.reduce((sum, click) => sum + click.co2Reduction, 0);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-blue-100">
            <BarChart3 className="h-5 w-5 text-blue-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Wayfinder Demo Request Analytics</h1>
            <p className="text-slate-500 text-sm">Monitor user engagement and sales opportunities</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Back to Calculator
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <Card className="mb-8 border border-slate-200 bg-white shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Demo Request Summary</CardTitle>
          <CardDescription>
            All demo requests tracked from the calculator app
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-slate-50 to-blue-50 border-0 shadow-sm overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Total Demo Requests</p>
                    <h3 className="text-3xl font-bold text-slate-800 mt-1">{totalRequests}</h3>
                  </div>
                  <div className="p-2 rounded-full bg-blue-100">
                    <Users className="h-5 w-5 text-blue-700" />
                  </div>
                </div>
                {totalRequests > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-200">
                    <p className="text-xs text-blue-600 font-medium flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Last request: {new Date(demoClicks[0].timestamp).toLocaleString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-slate-50 to-green-50 border-0 shadow-sm overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Average Savings</p>
                    <h3 className="text-3xl font-bold text-slate-800 mt-1">${avgSavings.toLocaleString()}</h3>
                  </div>
                  <div className="p-2 rounded-full bg-emerald-100">
                    <DollarSign className="h-5 w-5 text-emerald-700" />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200">
                  <p className="text-xs text-emerald-600 font-medium flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    Total potential: ${demoClicks.reduce((sum, click) => sum + click.estimatedSavings, 0).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Simplified dashboard with just two key metrics as requested */}
          </div>

          <h3 className="text-lg font-medium mt-8 mb-4 text-slate-800 flex items-center">
            <LineChart className="h-5 w-5 mr-2 text-blue-600" />
            Recent Demo Requests
          </h3>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full bg-white">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left text-xs font-medium text-slate-500 uppercase px-4 py-3">Time</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase px-4 py-3">Fleet Size</th>
                  <th className="text-right text-xs font-medium text-slate-500 uppercase px-4 py-3">Fuel Cost</th>
                  <th className="text-right text-xs font-medium text-slate-500 uppercase px-4 py-3">Savings</th>
                  <th className="text-right text-xs font-medium text-slate-500 uppercase px-4 py-3">CO₂ Reduction</th>
                  <th className="text-right text-xs font-medium text-slate-500 uppercase px-4 py-3">Submission Results</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {demoClicks.map((click, index) => {
                  // Generate a shareable link from the analytics data
                  const shareData = {
                    version: "1.0",
                    timestamp: click.timestamp,
                    vessels: click.vesselCount > 0 ? [{
                      // This is a placeholder as we don't store full vessel details
                      // In a real app, you would store more details for accurate recreation
                      category: "bulk-carrier",
                      size: "large",
                      count: click.vesselCount,
                      fuelConsumption: Math.round(click.totalFuelConsumption / (click.vesselCount * 280)),
                      seaDaysPerYear: 280
                    }] : [],
                    fuelPrice: 531, // Default from the application
                    estimatedSavings: 5, // Fixed at 5% in the calculator
                    results: {
                      totalFuelCost: click.totalFuelCost,
                      estimatedSavings: click.estimatedSavings,
                      fuelCostWithWayfinder: click.fuelCostWithWayfinder,
                      co2Reduction: click.co2Reduction,
                      totalFuelConsumption: click.totalFuelConsumption,
                      fuelPrice: 531,
                      vessels: []
                    }
                  };
                  
                  // Create share link
                  const shareLink = `${window.location.origin}/?data=${btoa(encodeURIComponent(JSON.stringify(shareData)))}`;
                  
                  return (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="px-4 py-4 text-sm text-slate-700">
                        {new Date(click.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">
                        <div className="flex items-center">
                          <Ship className="h-4 w-4 mr-1.5 text-slate-400" />
                          {click.vesselCount} {click.vesselCount === 1 ? 'vessel' : 'vessels'}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-right font-medium text-slate-700">
                        ${click.totalFuelCost.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-sm text-right font-medium text-emerald-600">
                        ${click.estimatedSavings.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-sm text-right font-medium text-amber-600">
                        {Math.round(click.co2Reduction).toLocaleString()} MT
                      </td>
                      <td className="px-4 py-4 text-sm text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => window.open(shareLink, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            onClick={() => handleDeleteClick(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-xs text-slate-500">
            <p>Note: All demo request data is stored locally in the browser and is available for analysis purposes only.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

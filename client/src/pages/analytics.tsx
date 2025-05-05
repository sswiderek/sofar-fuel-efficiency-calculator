import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

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
}

export default function AnalyticsDashboard() {
  const [demoClicks, setDemoClicks] = useState<DemoClick[]>([]);
  
  // In a real app, we'd fetch this data from the server
  // This is a simplified version that uses client-side demo clicks
  useEffect(() => {
    // Retrieve clicks from local storage
    const storedClicks = localStorage.getItem('demoClicks');
    if (storedClicks) {
      try {
        setDemoClicks(JSON.parse(storedClicks));
      } catch (e) {
        console.error('Failed to parse stored demo clicks', e);
      }
    }
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Wayfinder Demo Request Analytics</h1>
        <Link href="/">
          <Button variant="outline">Back to Calculator</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Demo Request Summary</CardTitle>
          <CardDescription>
            All demo requests tracked from the calculator app
          </CardDescription>
        </CardHeader>
        <CardContent>
          {demoClicks.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p>No demo requests recorded yet.</p>
              <p className="text-sm mt-2">
                Demo click data will appear here when users click the "Request a Demo" button.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm font-medium text-slate-500">Total Demo Requests</div>
                    <div className="text-3xl font-bold">{demoClicks.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm font-medium text-slate-500">Average Savings</div>
                    <div className="text-3xl font-bold">
                      ${Math.round(demoClicks.reduce((sum, click) => sum + click.estimatedSavings, 0) / demoClicks.length).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm font-medium text-slate-500">Average Fleet Size</div>
                    <div className="text-3xl font-bold">
                      {Math.round(demoClicks.reduce((sum, click) => sum + click.vesselCount, 0) / demoClicks.length).toLocaleString()} vessels
                    </div>
                  </CardContent>
                </Card>
              </div>

              <h3 className="text-lg font-medium mt-8 mb-4">Recent Demo Requests</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left text-sm font-medium text-slate-500 pb-2">Time</th>
                      <th className="text-left text-sm font-medium text-slate-500 pb-2">Fleet Size</th>
                      <th className="text-right text-sm font-medium text-slate-500 pb-2">Fuel Cost</th>
                      <th className="text-right text-sm font-medium text-slate-500 pb-2">Savings</th>
                      <th className="text-right text-sm font-medium text-slate-500 pb-2">CO₂ Reduction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demoClicks.map((click, index) => (
                      <tr key={index} className="border-t border-slate-200">
                        <td className="py-3 text-sm">
                          {new Date(click.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3 text-sm">{click.vesselCount} vessels</td>
                        <td className="py-3 text-sm text-right">${click.totalFuelCost.toLocaleString()}</td>
                        <td className="py-3 text-sm text-right text-emerald-600">${click.estimatedSavings.toLocaleString()}</td>
                        <td className="py-3 text-sm text-right">{Math.round(click.co2Reduction).toLocaleString()} MT</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

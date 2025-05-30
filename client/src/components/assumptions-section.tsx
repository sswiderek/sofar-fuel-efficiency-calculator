import React from "react";
import { Clock, Fuel, BarChart3, Leaf, Gauge as GaugeIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

type AssumptionProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function AssumptionCard({ icon, title, description }: AssumptionProps) {
  return (
    <div className="flex items-start gap-3 p-4 bg-white/70 rounded-lg border border-slate-100 shadow-sm">
      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-sky-50 text-sky-600">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-medium text-slate-800 mb-1">{title}</h3>
        <p className="text-xs text-slate-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default function AssumptionsSection() {
  return (
    <Card className="p-5 mb-6 bg-slate-50/80 backdrop-blur-sm border border-slate-200/60">
      <h2 className="text-base font-semibold text-slate-900 mb-3">
        Assumptions Made in This Calculator
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AssumptionCard
          icon={<BarChart3 className="h-5 w-5" />}
          title="Expected Fuel Savings Rate"
          description="Based on real-world Wayfinder deployments, vessels typically achieve fuel savings of 4-8%. We assume a conservative 5% in calculations to provide reliable estimates."
        />
        <AssumptionCard
          icon={<GaugeIcon className="h-5 w-5" />}
          title="Fuel Consumption Estimates"
          description="Fuel consumption estimates blend actual vessel data from our platform with industry standards based on vessel type and size. Individual performance varies with operating conditions."
        />
        <AssumptionCard
          icon={<Fuel className="h-5 w-5" />}
          title="VLSFO Fuel Type"
          description="Calculations assume Very Low Sulfur Fuel Oil (VLSFO) prices, which is the primary marine fuel used to comply with IMO 2020 sulfur regulations."
        />
        <AssumptionCard
          icon={<Leaf className="h-5 w-5" />}
          title="CO₂ Conversion Rate"
          description="We assume each metric ton of fuel burned produces 3.15 metric tons of CO₂, based on standard shipping benchmarks."
        />
      </div>
    </Card>
  );
}

// ... other imports ...

function MyComponent() {
  // ... other code ...

  return (
    <div>
      {/* ... other sections ... */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((item, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-4">
            <div className={cn(
              item.key === "conservative" && "text-sky-700",
              item.key === "average" && "text-amber-700",
              item.key === "optimal" && "text-emerald-700"
            )}>
              <h3 className="text-sm font-medium">{item.title}</h3>
            </div>
            <div className={cn(
              item.key === "conservative" && "text-sky-700",
              item.key === "average" && "text-amber-700",
              item.key === "optimal" && "text-emerald-700"
            )}>
              <h3 className="text-sm font-medium">{item.title}</h3>
            </div>
            {/* ... rest of the tile content ... */}
          </div>
        ))}
      </div>


      <div className="mt-8"> {/* Adjusted spacing */}
        <div className="ship-container relative">
          <img src="/images/cargo-ship.png" alt="Cargo Ship" className="w-44 h-44 object-contain mb-2" />
          <div className="waves-small"></div>
        </div>
        <p className="text-slate-700 text-sm">Fill in your fleet details to calculate potential fuel savings</p>
      </div>

      {/* ... rest of the component ... */}
    </div>
  );
}

// ... rest of the file ...
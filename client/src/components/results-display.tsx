import React from 'react';

interface ResultsDisplayProps {
  results: any[];
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  return (
    <div>
      {results.map((result, index) => (
        <p key={index}>{result}</p>
      ))}
    </div>
  );
}
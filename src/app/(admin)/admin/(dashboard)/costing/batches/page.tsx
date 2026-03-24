"use client";

import { useEffect, useState } from "react";

export default function BatchesDashboard() {
  const [batches, setBatches] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Batch Form
  const [recipeId, setRecipeId] = useState("");
  const [plannedYield, setPlannedYield] = useState(0);
  const [batchDate, setBatchDate] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bRes, rRes] = await Promise.all([
        fetch("/api/production-batches"),
        fetch("/api/recipes")
      ]);
      setBatches(await bRes.json());
      setRecipes(await rRes.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const startBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeId) return alert("Select recipe");
    
    try {
      await fetch("/api/production-batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipeVersionId: recipeId,
          plannedYield: Number(plannedYield),
          batchDate: batchDate ? new Date(batchDate) : new Date()
        })
      });
      fetchData();
      alert("Batch started and theoretical costs generated!");
    } catch (e) {
      alert("Failed to create batch");
    }
  };

  const finalizeBatch = async (id: string) => {
    const act = prompt("Enter final actual yield (pcs):");
    if (!act) return;
    
    try {
      await fetch("/api/production-batches", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchId: id,
          actualYield: Number(act)
        })
      });
      fetchData();
      alert("Batch finalized, unit cost recalculated!");
    } catch (e) {
      alert("Failed to finalize");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Production Batches</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Start New Batch</h2>
        <form onSubmit={startBatch} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">Select Recipe Template</label>
            <select className="border p-2 rounded w-full" value={recipeId} onChange={e => {
              setRecipeId(e.target.value);
              const r = recipes.find(x => x.id === e.target.value);
              if (r) setPlannedYield(r.yieldQuantity);
            }}>
              <option value="">Select...</option>
              {recipes.map(r => <option key={r.id} value={r.id}>{r.name} (v{r.versionNo})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Planned Target Yield</label>
            <input type="number" className="border p-2 rounded w-32" value={plannedYield} onChange={e => setPlannedYield(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Production Date</label>
            <input type="date" className="border p-2 rounded w-48" value={batchDate} onChange={e => setBatchDate(e.target.value)} />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700">
            Create Batch
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <h2 className="text-lg font-semibold text-gray-700 p-6 border-b">Active & Completed Batches</h2>
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading batches...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 border-b text-sm">
                <th className="p-4 font-medium">Batch ID/Date</th>
                <th className="p-4 font-medium">Recipe</th>
                <th className="p-4 font-medium">Target vs Actual</th>
                <th className="p-4 font-medium">Total Mat Cost</th>
                <th className="p-4 font-medium text-right">Final Unit Cost</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {batches.map(b => (
                <tr key={b.id}>
                  <td className="p-4">
                    <div className="text-gray-900">{new Date(b.batchDate).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-400 font-mono">{b.id.slice(-6)}</div>
                  </td>
                  <td className="p-4">{b.recipeVersion?.name}</td>
                  <td className="p-4">
                    <span className="text-gray-500">{b.plannedYield}</span> / <span className="font-bold text-gray-900">{b.actualYield || '?'}</span> pcs
                  </td>
                  <td className="p-4 font-medium">${Number(b.totalMaterialCost).toFixed(2)}</td>
                  <td className="p-4 text-right font-bold text-green-700">
                    {b.unitCost ? `$${Number(b.unitCost).toFixed(2)}` : 'Pending'}
                  </td>
                  <td className="p-4">
                    {!b.actualYield ? (
                      <button onClick={() => finalizeBatch(b.id)} className="text-blue-600 hover:underline">
                        Log Actual & Finalize
                      </button>
                    ) : (
                      <span className="text-green-600 font-medium">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

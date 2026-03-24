"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";

export default function MaterialsDashboard() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Material form state
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newUnit, setNewUnit] = useState("g");

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/materials");
      const data = await res.json();
      setMaterials(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newName || !newUnit) return alert("Fill all fields");
    
    try {
      await fetch("/api/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: newCode,
          name: newName,
          category: "Raw Material",
          baseUnit: newUnit,
          isActive: true
        })
      });
      setNewCode("");
      setNewName("");
      setNewUnit("g");
      fetchMaterials();
    } catch (error) {
      alert("Failed to create material");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Materials & Cost Snapshots</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Add New Material</h2>
        <form onSubmit={handleCreate} className="flex gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
            <input 
              value={newCode} onChange={(e) => setNewCode(e.target.value)}
              className="border p-2 rounded w-32" placeholder="e.g. FLR01" 
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input 
              value={newName} onChange={(e) => setNewName(e.target.value)}
              className="border p-2 rounded w-full" placeholder="e.g. Bread Flour" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Base Unit</label>
            <select 
              value={newUnit} onChange={(e) => setNewUnit(e.target.value)}
              className="border p-2 rounded w-24">
              <option value="g">g</option>
              <option value="kg">kg</option>
              <option value="ml">ml</option>
              <option value="l">L</option>
              <option value="pc">pc</option>
            </select>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition">
            Add
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading materials...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 border-b text-sm">
                <th className="p-4 font-medium">Code</th>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Base Unit</th>
                <th className="p-4 font-medium">Current Unit Cost ({materials.length > 0 ? '$' : ''})</th>
                <th className="p-4 font-medium">Cost Source</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {materials.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="p-4 text-gray-800">{m.code}</td>
                  <td className="p-4 font-medium text-gray-900">{m.name}</td>
                  <td className="p-4 text-gray-600">{m.baseUnit}</td>
                  <td className="p-4 font-semibold text-green-600">
                    {/* The API returns m.currentCost -> formatted directly or manually */}
                    ${Number(m.currentCost).toFixed(4)}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-600 whitespace-nowrap">
                      {m.currentMethod}
                    </span>
                  </td>
                </tr>
              ))}
              {materials.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No materials found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

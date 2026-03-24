"use client";

import { useEffect, useState } from "react";

export default function RecipesDashboard() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Recipe State
  const [productId, setProductId] = useState("");
  const [versionNo, setVersionNo] = useState(1);
  const [name, setName] = useState("Standard Recipe");
  const [yieldQty, setYieldQty] = useState(10);
  const [items, setItems] = useState<any[]>([{ materialId: "", quantity: 0, unit: "g", wastePercent: 0 }]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rRes, mRes] = await Promise.all([
        fetch("/api/recipes"),
        fetch("/api/materials")
      ]);
      setRecipes(await rRes.json());
      setMaterials(await mRes.json());
      
      // we'd typically fetch /api/products here. Mocking for UI
      setProducts([{ id: "prod-1", name: "Sourdough Bread" }, { id: "prod-2", name: "Croissant" }]);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const addItemRow = () => setItems([...items, { materialId: "", quantity: 0, unit: "g", wastePercent: 0 }]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || items.length === 0) return alert("Select product and add items");

    try {
      await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId, versionNo, name, yieldQuantity: yieldQty, items
        })
      });
      fetchData();
      alert("Recipe created!");
    } catch (error) {
      alert("Failed to create recipe");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Recipe Formula Manager</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Creates a New Recipe Version</h2>
        
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Product</label>
              <select className="border p-2 rounded w-48" value={productId} onChange={e => setProductId(e.target.value)}>
                <option value="">Select...</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Label Name</label>
              <input type="text" className="border p-2 rounded" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Target Yield (pcs)</label>
              <input type="number" className="border p-2 rounded w-24" value={yieldQty} onChange={e => setYieldQty(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Version</label>
              <input type="number" className="border p-2 rounded w-20" value={versionNo} onChange={e => setVersionNo(Number(e.target.value))} />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md border">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">Formula Ingredients</h3>
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-end mb-2">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">Material</label>
                  <select className="border p-2 rounded w-full text-sm" value={item.materialId} onChange={e => {
                    const newItems = [...items]; newItems[idx].materialId = e.target.value; setItems(newItems);
                  }}>
                    <option value="">Select Material...</option>
                    {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Qty</label>
                  <input type="number" className="border p-2 rounded w-24 text-sm" value={item.quantity} onChange={e => {
                    const newItems = [...items]; newItems[idx].quantity = Number(e.target.value); setItems(newItems);
                  }} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Unit</label>
                  <select className="border p-2 rounded w-20 text-sm" value={item.unit} onChange={e => {
                    const newItems = [...items]; newItems[idx].unit = e.target.value; setItems(newItems);
                  }}>
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml</option>
                    <option value="l">L</option>
                    <option value="pc">pc</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Waste %</label>
                  <input type="number" className="border p-2 rounded w-24 text-sm" value={item.wastePercent} onChange={e => {
                    const newItems = [...items]; newItems[idx].wastePercent = Number(e.target.value); setItems(newItems);
                  }} />
                </div>
              </div>
            ))}
            <button type="button" onClick={addItemRow} className="text-sm text-blue-600 font-medium mt-2">+ Add Ingredient</button>
          </div>
          
          <div>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700">Save Recipe</button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <h2 className="text-lg font-semibold text-gray-700 p-6 border-b">Saved Recipes</h2>
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading recipes...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 border-b text-sm">
                <th className="p-4 font-medium">Product ID</th>
                <th className="p-4 font-medium">v#</th>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Std Yield</th>
                <th className="p-4 font-medium">Ingredients</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {recipes.map(r => (
                <tr key={r.id}>
                  <td className="p-4">{r.productId}</td>
                  <td className="p-4">v{r.versionNo}</td>
                  <td className="p-4 font-medium">{r.name}</td>
                  <td className="p-4">{r.yieldQuantity} pcs</td>
                  <td className="p-4 text-gray-500">{r.items?.length} items mapped</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

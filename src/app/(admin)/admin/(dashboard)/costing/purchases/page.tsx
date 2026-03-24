"use client";

import { useEffect, useState } from "react";

export default function PurchasesDashboard() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);

  // Bill Entry State
  const [supplierId, setSupplierId] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  
  const [items, setItems] = useState<any[]>([
    { materialId: "", itemNameRaw: "", quantity: 1, unit: "kg", amount: 0, conversionRate: 1000 }
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, mRes] = await Promise.all([
        fetch("/api/purchases"),
        fetch("/api/materials")
      ]);
      setPurchases(await pRes.json());
      setMaterials(await mRes.json());
      // For a real app, you'd fetch /api/suppliers. Hardcoding one for demo.
      setSuppliers([{ id: "demo-supp", name: "Demo Supplier" }]);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const addItemRow = () => {
    setItems([...items, { materialId: "", itemNameRaw: "", quantity: 1, unit: "kg", amount: 0, conversionRate: 1000 }]);
  };

  const calculateTotals = (itemsArray: any[]) => {
    return itemsArray.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId || !invoiceNo || items.length === 0) return alert("Fill required fields");

    // Calculate Base Units
    const processedItems = items.map(item => ({
      ...item,
      quantityBase: Number(item.quantity) * Number(item.conversionRate),
      unitCostBase: Number(item.amount) / (Number(item.quantity) * Number(item.conversionRate))
    }));

    const totalAmount = calculateTotals(processedItems);

    try {
      await fetch("/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplierId,
          invoiceNo,
          purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date(),
          totalAmount,
          items: processedItems
        })
      });
      // Reset
      setSupplierId("");
      setInvoiceNo("");
      setItems([{ materialId: "", itemNameRaw: "", quantity: 1, unit: "kg", amount: 0, conversionRate: 1000 }]);
      fetchData();
      alert("Purchase logged and material costs recomputed!");
    } catch (err) {
      alert("Error saving purchase");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Purchases & Receiving</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8 flex flex-col gap-6">
        <h2 className="text-lg font-semibold text-gray-700">Log an Invoice</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex gap-4 border-b pb-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Supplier</label>
              <select className="border p-2 rounded" value={supplierId} onChange={e => setSupplierId(e.target.value)}>
                <option value="">Select...</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Invoice No</label>
              <input type="text" className="border p-2 rounded w-48" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
              <input type="date" className="border p-2 rounded w-48" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} />
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-600 mb-2">Invoice Items</h3>
            {items.map((item, index) => (
              <div key={index} className="flex gap-2 items-end mb-2">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">Map to Material</label>
                  <select 
                    className="border p-2 rounded w-full text-sm"
                    value={item.materialId}
                    onChange={e => {
                      const newItems = [...items];
                      newItems[index].materialId = e.target.value;
                      setItems(newItems);
                    }}
                  >
                    <option value="">Select Material...</option>
                    {materials.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.baseUnit})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Qty</label>
                  <input type="number" className="border p-2 rounded w-20 text-sm" value={item.quantity} onChange={e => {
                    const newItems = [...items]; newItems[index].quantity = e.target.value; setItems(newItems);
                  }} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Unit</label>
                  <input type="text" className="border p-2 rounded w-16 text-sm" placeholder="e.g. Bag" value={item.unit} onChange={e => {
                    const newItems = [...items]; newItems[index].unit = e.target.value; setItems(newItems);
                  }} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Conversion *</label>
                  <input type="number" className="border p-2 rounded w-24 text-sm" placeholder="Base Qty" value={item.conversionRate} onChange={e => {
                    const newItems = [...items]; newItems[index].conversionRate = e.target.value; setItems(newItems);
                  }} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Total Line $</label>
                  <input type="number" className="border p-2 rounded w-24 text-sm" value={item.amount} onChange={e => {
                    const newItems = [...items]; newItems[index].amount = e.target.value; setItems(newItems);
                  }} />
                </div>
              </div>
            ))}
            
            <button type="button" onClick={addItemRow} className="text-sm text-blue-600 font-medium mt-2">+ Add Row</button>
          </div>

          <div className="bg-gray-50 p-4 border rounded-lg flex items-center justify-between">
            <div className="text-lg font-semibold text-gray-800">
              Total Invoice: ${calculateTotals(items).toFixed(2)}
            </div>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700">
              Submit Purchase & Recalculate Costs
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <h2 className="text-lg font-semibold text-gray-700 p-6 border-b">Recent Purchase History</h2>
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading history...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 border-b text-sm">
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Invoice No</th>
                <th className="p-4 font-medium">Supplier</th>
                <th className="p-4 font-medium">Total Amount</th>
                <th className="p-4 font-medium">Items</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {purchases.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-4">{new Date(p.purchaseDate).toLocaleDateString()}</td>
                  <td className="p-4 font-medium">{p.invoiceNo}</td>
                  <td className="p-4">{p.supplier?.name || p.supplierId}</td>
                  <td className="p-4 font-semibold text-green-600">${Number(p.totalAmount).toFixed(2)}</td>
                  <td className="p-4 text-gray-500">{p.items.length} mapped rows</td>
                </tr>
              ))}
              {purchases.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No purchases found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

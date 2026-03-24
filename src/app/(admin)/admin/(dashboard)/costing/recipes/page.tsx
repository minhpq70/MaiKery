"use client";

import { useEffect, useState } from "react";

export default function RecipesDashboard() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [productId, setProductId] = useState("");
  const [versionNo, setVersionNo] = useState(1);
  const [name, setName] = useState("Công thức chuẩn");
  const [yieldQty, setYieldQty] = useState(10);
  const [items, setItems] = useState<any[]>([{ materialId: "", quantity: 0, unit: "g", wastePercent: 0 }]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rRes, mRes, pRes] = await Promise.all([
        fetch("/api/recipes"),
        fetch("/api/materials"),
        fetch("/api/products?limit=100")
      ]);
      setRecipes(await rRes.json());
      setMaterials(await mRes.json());
      const pData = await pRes.json();
      setProducts(Array.isArray(pData) ? pData : (pData.products ?? []));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const addItemRow = () => setItems([...items, { materialId: "", quantity: 0, unit: "g", wastePercent: 0 }]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || items.length === 0) return alert("Vui lòng chọn sản phẩm và thêm nguyên liệu");

    try {
      await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId, versionNo, name, yieldQuantity: yieldQty, items
        })
      });
      fetchData();
      alert("Đã lưu công thức!");
    } catch (error) {
      alert("Không thể lưu công thức. Vui lòng thử lại.");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#40332B]">Quản lý Công thức</h1>

      <div className="bg-white p-6 rounded-xl border border-[#E5D5C5] shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-[#40332B]">Tạo công thức mới</h2>

        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div className="flex gap-4 flex-wrap">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Sản phẩm</label>
              <select
                className="border border-gray-200 p-2 rounded-lg w-56 focus:outline-none focus:ring-2 focus:ring-[#D96C4E]"
                value={productId} onChange={e => setProductId(e.target.value)}
              >
                <option value="">-- Chọn sản phẩm --</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Tên công thức</label>
              <input type="text" className="border border-gray-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96C4E]" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Số lượng ra lò (cái)</label>
              <input type="number" className="border border-gray-200 p-2 rounded-lg w-28 focus:outline-none focus:ring-2 focus:ring-[#D96C4E]" value={yieldQty} onChange={e => setYieldQty(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Phiên bản</label>
              <input type="number" className="border border-gray-200 p-2 rounded-lg w-20 focus:outline-none focus:ring-2 focus:ring-[#D96C4E]" value={versionNo} onChange={e => setVersionNo(Number(e.target.value))} />
            </div>
          </div>

          <div className="bg-[#FFFBF5] p-4 rounded-lg border border-[#E5D5C5]">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Danh sách nguyên liệu trong công thức</h3>
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-end mb-3 flex-wrap">
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-xs text-gray-500 mb-1">Nguyên liệu</label>
                  <select className="border border-gray-200 p-2 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#D96C4E]" value={item.materialId} onChange={e => {
                    const newItems = [...items]; newItems[idx].materialId = e.target.value; setItems(newItems);
                  }}>
                    <option value="">-- Chọn nguyên liệu --</option>
                    {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Số lượng</label>
                  <input type="number" className="border border-gray-200 p-2 rounded-lg w-24 text-sm" value={item.quantity} onChange={e => {
                    const newItems = [...items]; newItems[idx].quantity = Number(e.target.value); setItems(newItems);
                  }} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Đơn vị</label>
                  <select className="border border-gray-200 p-2 rounded-lg w-20 text-sm" value={item.unit} onChange={e => {
                    const newItems = [...items]; newItems[idx].unit = e.target.value; setItems(newItems);
                  }}>
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml</option>
                    <option value="l">L</option>
                    <option value="pc">cái</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Hao hụt %</label>
                  <input type="number" className="border border-gray-200 p-2 rounded-lg w-24 text-sm" value={item.wastePercent} onChange={e => {
                    const newItems = [...items]; newItems[idx].wastePercent = Number(e.target.value); setItems(newItems);
                  }} />
                </div>
              </div>
            ))}
            <button type="button" onClick={addItemRow} className="text-sm text-[#D96C4E] font-medium mt-1 hover:underline">
              + Thêm nguyên liệu
            </button>
          </div>

          <div>
            <button type="submit" className="bg-[#D96C4E] hover:bg-[#C55A3D] text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Lưu công thức
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-[#E5D5C5] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#E5D5C5]">
          <h2 className="font-semibold text-[#40332B]">Danh sách công thức đã lưu</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-500">Đang tải...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-[#FFFBF5] text-[#5C4D43] text-sm border-b border-[#E5D5C5]">
              <tr>
                <th className="p-4 font-medium">Sản phẩm</th>
                <th className="p-4 font-medium">Phiên bản</th>
                <th className="p-4 font-medium">Tên công thức</th>
                <th className="p-4 font-medium">Số lượng ra lò</th>
                <th className="p-4 font-medium">Số nguyên liệu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5D5C5] text-sm">
              {recipes.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="p-4 text-gray-600">{r.product?.name || r.productId}</td>
                  <td className="p-4">v{r.versionNo}</td>
                  <td className="p-4 font-medium">{r.name}</td>
                  <td className="p-4">{r.yieldQuantity} cái</td>
                  <td className="p-4 text-gray-500">{r.items?.length} nguyên liệu</td>
                </tr>
              ))}
              {recipes.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">Chưa có công thức nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

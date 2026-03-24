"use client";

import { useEffect, useState } from "react";

export default function BatchesDashboard() {
  const [batches, setBatches] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    if (!recipeId) return alert("Vui lòng chọn công thức");

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
      alert("Đã tạo lô sản xuất và tính giá vốn lý thuyết!");
    } catch (e) {
      alert("Không thể tạo lô sản xuất. Vui lòng thử lại.");
    }
  };

  const finalizeBatch = async (id: string) => {
    const act = prompt("Nhập số lượng thực tế ra lò (cái):");
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
      alert("Đã chốt lô sản xuất và cập nhật giá vốn đơn vị!");
    } catch (e) {
      alert("Không thể chốt lô. Vui lòng thử lại.");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#40332B]">Lô sản xuất</h1>

      <div className="bg-white p-6 rounded-xl border border-[#E5D5C5] shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-[#40332B]">Tạo lô sản xuất mới</h2>
        <form onSubmit={startBatch} className="flex gap-4 items-end flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-gray-600 mb-1">Chọn công thức</label>
            <select
              className="border border-gray-200 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#D96C4E]"
              value={recipeId} onChange={e => {
                setRecipeId(e.target.value);
                const r = recipes.find(x => x.id === e.target.value);
                if (r) setPlannedYield(r.yieldQuantity);
              }}
            >
              <option value="">-- Chọn công thức --</option>
              {recipes.map(r => <option key={r.id} value={r.id}>{r.name} (v{r.versionNo})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Số lượng kế hoạch (cái)</label>
            <input
              type="number"
              className="border border-gray-200 p-2 rounded-lg w-36 focus:outline-none focus:ring-2 focus:ring-[#D96C4E]"
              value={plannedYield} onChange={e => setPlannedYield(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Ngày sản xuất</label>
            <input
              type="date"
              className="border border-gray-200 p-2 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-[#D96C4E]"
              value={batchDate} onChange={e => setBatchDate(e.target.value)}
            />
          </div>
          <button type="submit" className="bg-[#D96C4E] hover:bg-[#C55A3D] text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Bắt đầu lô
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-[#E5D5C5] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#E5D5C5]">
          <h2 className="font-semibold text-[#40332B]">Danh sách lô sản xuất</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-500">Đang tải...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-[#FFFBF5] text-[#5C4D43] text-sm border-b border-[#E5D5C5]">
              <tr>
                <th className="p-4 font-medium">Mã lô / Ngày</th>
                <th className="p-4 font-medium">Công thức</th>
                <th className="p-4 font-medium">KH / Thực tế</th>
                <th className="p-4 font-medium">Tổng chi phí NL</th>
                <th className="p-4 font-medium text-right">Giá vốn/cái</th>
                <th className="p-4 font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5D5C5] text-sm">
              {batches.map(b => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="text-gray-900">{new Date(b.batchDate).toLocaleDateString("vi-VN")}</div>
                    <div className="text-xs text-gray-400 font-mono">{b.id.slice(-6)}</div>
                  </td>
                  <td className="p-4">{b.recipeVersion?.name}</td>
                  <td className="p-4">
                    <span className="text-gray-500">{b.plannedYield}</span>
                    {" / "}
                    <span className="font-bold text-gray-900">{b.actualYield || "?"}</span> cái
                  </td>
                  <td className="p-4 font-medium">
                    {Number(b.totalMaterialCost).toLocaleString("vi-VN")} ₫
                  </td>
                  <td className="p-4 text-right font-bold text-[#D96C4E]">
                    {b.unitCost
                      ? `${Number(b.unitCost).toLocaleString("vi-VN")} ₫`
                      : <span className="text-gray-400 font-normal italic">Chờ chốt</span>
                    }
                  </td>
                  <td className="p-4">
                    {!b.actualYield ? (
                      <button
                        onClick={() => finalizeBatch(b.id)}
                        className="text-[#D96C4E] hover:underline font-medium text-sm"
                      >
                        Chốt lô
                      </button>
                    ) : (
                      <span className="text-green-600 font-medium">Đã hoàn thành</span>
                    )}
                  </td>
                </tr>
              ))}
              {batches.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">Chưa có lô sản xuất nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

export default function MaterialsDashboard() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    if (!newCode || !newName || !newUnit) return alert("Vui lòng điền đầy đủ thông tin");

    try {
      await fetch("/api/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: newCode,
          name: newName,
          category: "Nguyên liệu thô",
          baseUnit: newUnit,
          isActive: true
        })
      });
      setNewCode("");
      setNewName("");
      setNewUnit("g");
      fetchMaterials();
    } catch (error) {
      alert("Không thể thêm nguyên liệu. Vui lòng thử lại.");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#40332B]">Nguyên liệu & Chi phí</h1>

      <div className="bg-white p-6 rounded-xl border border-[#E5D5C5] shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-[#40332B]">Thêm nguyên liệu mới</h2>
        <form onSubmit={handleCreate} className="flex gap-4 items-end flex-wrap">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Mã nguyên liệu</label>
            <input
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              className="border border-gray-200 p-2 rounded-lg w-32 focus:outline-none focus:ring-2 focus:ring-[#D96C4E]"
              placeholder="VD: NL001"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-600 mb-1">Tên nguyên liệu</label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border border-gray-200 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#D96C4E]"
              placeholder="VD: Bột mì"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Đơn vị cơ bản</label>
            <select
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              className="border border-gray-200 p-2 rounded-lg w-24 focus:outline-none focus:ring-2 focus:ring-[#D96C4E]"
            >
              <option value="g">g</option>
              <option value="kg">kg</option>
              <option value="ml">ml</option>
              <option value="l">L</option>
              <option value="pc">cái</option>
            </select>
          </div>
          <button type="submit" className="bg-[#D96C4E] hover:bg-[#C55A3D] text-white px-5 py-2 rounded-lg font-medium transition-colors">
            Thêm mới
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-[#E5D5C5] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#E5D5C5]">
          <h2 className="font-semibold text-[#40332B]">Danh sách nguyên liệu</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-500">Đang tải...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-[#FFFBF5] text-[#5C4D43] text-sm border-b border-[#E5D5C5]">
              <tr>
                <th className="p-4 font-medium">Mã</th>
                <th className="p-4 font-medium">Tên nguyên liệu</th>
                <th className="p-4 font-medium">Đơn vị</th>
                <th className="p-4 font-medium">Giá vốn hiện tại (/đv)</th>
                <th className="p-4 font-medium">Phương pháp tính</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5D5C5] text-sm">
              {materials.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="p-4 text-gray-600 font-mono">{m.code}</td>
                  <td className="p-4 font-medium text-gray-900">{m.name}</td>
                  <td className="p-4 text-gray-600">{m.baseUnit}</td>
                  <td className="p-4 font-semibold text-[#D96C4E]">
                    {Number(m.currentCost).toLocaleString("vi-VN")} ₫
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
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    Chưa có nguyên liệu nào. Hãy thêm nguyên liệu đầu tiên!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

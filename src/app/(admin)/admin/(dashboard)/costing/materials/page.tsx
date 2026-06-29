"use client";

import { useEffect, useState } from "react";

const UNIT_SUGGESTIONS = [
  "g", "kg", "ml", "L", "cái", "quả", "gói", "hộp", "túi", "lon",
  "bánh", "tờ", "cuộn", "chai", "lọ", "bịch", "bình", "thùng",
];

const CATEGORY_OPTIONS = [
  "Nguyên liệu thô",
  "Bao bì & Đóng gói",
  "Gia vị & Hương liệu",
  "Dụng cụ tiêu hao",
  "Khác",
];

export default function MaterialsDashboard() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("");

  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newUnit, setNewUnit] = useState("g");
  const [newCategory, setNewCategory] = useState("Nguyên liệu thô");
  const [showUnitSuggestions, setShowUnitSuggestions] = useState(false);

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
          category: newCategory,
          baseUnit: newUnit,
          isActive: true
        })
      });
      setNewCode("");
      setNewName("");
      setNewUnit("g");
      setNewCategory("Nguyên liệu thô");
      fetchMaterials();
    } catch (error) {
      alert("Không thể thêm. Vui lòng thử lại.");
    }
  };

  const filtered = filterCategory
    ? materials.filter(m => m.category === filterCategory)
    : materials;

  // Badge color by category
  const categoryColor = (cat: string) => {
    if (cat?.includes("Bao bì")) return "bg-purple-50 text-purple-700";
    if (cat?.includes("Gia vị")) return "bg-yellow-50 text-yellow-700";
    if (cat?.includes("Dụng cụ")) return "bg-blue-50 text-blue-700";
    if (cat?.includes("Nguyên liệu")) return "bg-green-50 text-green-700";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#40332B]">Nguyên vật liệu</h1>

      {/* Add form */}
      <div className="bg-white p-6 rounded-xl border border-[#E5D5C5] shadow-sm">
        <h2 className="text-lg font-semibold mb-1 text-[#40332B]">Thêm nguyên vật liệu mới</h2>
        <p className="text-xs text-gray-500 mb-4">
          Bao gồm: nguyên liệu thô (bột, đường, trứng…), bao bì đóng gói (hộp, túi, nơ…), gia vị, dụng cụ tiêu hao.
        </p>
        <form onSubmit={handleCreate} className="flex gap-4 items-end flex-wrap">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Mã</label>
            <input
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              className="border border-gray-200 p-2 rounded-lg w-28 focus:outline-none focus:ring-2 focus:ring-[#D96C4E]"
              placeholder="VD: NL001"
            />
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-medium text-gray-600 mb-1">Tên</label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border border-gray-200 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#D96C4E]"
              placeholder="VD: Bột mì, Hộp bánh 4 cái, Trứng gà"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Danh mục</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="border border-gray-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96C4E]"
            >
              {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-600 mb-1">Đơn vị cơ bản</label>
            <input
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              onFocus={() => setShowUnitSuggestions(true)}
              onBlur={() => setTimeout(() => setShowUnitSuggestions(false), 150)}
              className="border border-gray-200 p-2 rounded-lg w-24 focus:outline-none focus:ring-2 focus:ring-[#D96C4E]"
              placeholder="VD: g"
            />
            {showUnitSuggestions && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 flex flex-wrap gap-1 p-2 w-56">
                {UNIT_SUGGESTIONS.map(u => (
                  <button
                    key={u}
                    type="button"
                    onMouseDown={() => { setNewUnit(u); setShowUnitSuggestions(false); }}
                    className="px-2 py-1 text-xs rounded border border-gray-200 hover:bg-[#D96C4E] hover:text-white hover:border-[#D96C4E] transition-colors"
                  >
                    {u}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button type="submit" className="bg-[#D96C4E] hover:bg-[#C55A3D] text-white px-5 py-2 rounded-lg font-medium transition-colors">
            Thêm mới
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-[#E5D5C5] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#E5D5C5] flex items-center justify-between gap-4 flex-wrap">
          <h2 className="font-semibold text-[#40332B]">
            Danh sách nguyên vật liệu
            {filterCategory && <span className="ml-2 text-sm font-normal text-[#D96C4E]">— {filterCategory}</span>}
          </h2>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterCategory("")}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${!filterCategory ? "bg-[#D96C4E] text-white border-[#D96C4E]" : "border-gray-200 text-gray-600 hover:border-[#D96C4E]"}`}
            >
              Tất cả ({materials.length})
            </button>
            {CATEGORY_OPTIONS.map(cat => {
              const count = materials.filter(m => m.category === cat).length;
              if (count === 0) return null;
              return (
                <button key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${filterCategory === cat ? "bg-[#D96C4E] text-white border-[#D96C4E]" : "border-gray-200 text-gray-600 hover:border-[#D96C4E]"}`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-500">Đang tải...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-[#FFFBF5] text-[#5C4D43] text-sm border-b border-[#E5D5C5]">
              <tr>
                <th className="p-4 font-medium">Mã</th>
                <th className="p-4 font-medium">Tên</th>
                <th className="p-4 font-medium">Danh mục</th>
                <th className="p-4 font-medium">Đơn vị</th>
                <th className="p-4 font-medium">Giá vốn (/đv)</th>
                <th className="p-4 font-medium">Phương pháp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5D5C5] text-sm">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="p-4 text-gray-600 font-mono text-xs">{m.code}</td>
                  <td className="p-4 font-medium text-gray-900">{m.name}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${categoryColor(m.category)}`}>
                      {m.category || "—"}
                    </span>
                  </td>
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
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    {filterCategory ? `Chưa có mục nào trong danh mục "${filterCategory}".` : "Chưa có nguyên vật liệu nào."}
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

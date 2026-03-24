"use client";

import { useEffect, useState } from "react";

export default function PurchasesDashboard() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      setSuppliers([{ id: "demo-supp", name: "Nhà cung cấp mặc định" }]);
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
    if (!supplierId || !invoiceNo || items.length === 0) {
      return alert("Vui lòng điền đầy đủ thông tin bắt buộc");
    }

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
      setSupplierId("");
      setInvoiceNo("");
      setItems([{ materialId: "", itemNameRaw: "", quantity: 1, unit: "kg", amount: 0, conversionRate: 1000 }]);
      fetchData();
      alert("Đã lưu hóa đơn và cập nhật giá vốn nguyên liệu!");
    } catch (err) {
      alert("Lỗi khi lưu hóa đơn. Vui lòng thử lại.");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#40332B]">Nhập hàng & Hóa đơn</h1>

      <div className="bg-white p-6 rounded-xl border border-[#E5D5C5] shadow-sm flex flex-col gap-6">
        <h2 className="text-lg font-semibold text-[#40332B]">Ghi nhận hóa đơn nhập hàng</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex gap-4 flex-wrap border-b border-[#E5D5C5] pb-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Nhà cung cấp</label>
              <select
                className="border border-gray-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96C4E]"
                value={supplierId} onChange={e => setSupplierId(e.target.value)}
              >
                <option value="">-- Chọn --</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Số hóa đơn</label>
              <input
                type="text"
                className="border border-gray-200 p-2 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-[#D96C4E]"
                value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)}
                placeholder="VD: HD-0001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Ngày nhập</label>
              <input
                type="date"
                className="border border-gray-200 p-2 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-[#D96C4E]"
                value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-3">Danh sách hàng hóa</h3>
            {items.map((item, index) => (
              <div key={index} className="flex gap-2 items-end mb-3 flex-wrap">
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-xs text-gray-500 mb-1">Nguyên liệu</label>
                  <select
                    className="border border-gray-200 p-2 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#D96C4E]"
                    value={item.materialId}
                    onChange={e => {
                      const newItems = [...items];
                      newItems[index].materialId = e.target.value;
                      setItems(newItems);
                    }}
                  >
                    <option value="">-- Chọn nguyên liệu --</option>
                    {materials.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.baseUnit})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Số lượng</label>
                  <input type="number" className="border border-gray-200 p-2 rounded-lg w-20 text-sm" value={item.quantity} onChange={e => {
                    const newItems = [...items]; newItems[index].quantity = e.target.value; setItems(newItems);
                  }} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Đơn vị mua</label>
                  <input type="text" className="border border-gray-200 p-2 rounded-lg w-20 text-sm" placeholder="VD: túi" value={item.unit} onChange={e => {
                    const newItems = [...items]; newItems[index].unit = e.target.value; setItems(newItems);
                  }} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Quy đổi *</label>
                  <input type="number" className="border border-gray-200 p-2 rounded-lg w-24 text-sm" placeholder="Số lượng đv cơ bản" value={item.conversionRate} onChange={e => {
                    const newItems = [...items]; newItems[index].conversionRate = e.target.value; setItems(newItems);
                  }} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Thành tiền (₫)</label>
                  <input type="number" className="border border-gray-200 p-2 rounded-lg w-28 text-sm" value={item.amount} onChange={e => {
                    const newItems = [...items]; newItems[index].amount = e.target.value; setItems(newItems);
                  }} />
                </div>
              </div>
            ))}
            <button type="button" onClick={addItemRow} className="text-sm text-[#D96C4E] font-medium mt-1 hover:underline">
              + Thêm dòng hàng hóa
            </button>
          </div>

          <div className="bg-[#FFFBF5] p-4 border border-[#E5D5C5] rounded-lg flex items-center justify-between">
            <div className="text-lg font-semibold text-[#40332B]">
              Tổng hóa đơn: {calculateTotals(items).toLocaleString("vi-VN")} ₫
            </div>
            <button type="submit" className="bg-[#D96C4E] hover:bg-[#C55A3D] text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Lưu & Cập nhật giá vốn
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-[#E5D5C5] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#E5D5C5]">
          <h2 className="font-semibold text-[#40332B]">Lịch sử nhập hàng</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-500">Đang tải...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-[#FFFBF5] text-[#5C4D43] text-sm border-b border-[#E5D5C5]">
              <tr>
                <th className="p-4 font-medium">Ngày nhập</th>
                <th className="p-4 font-medium">Số HĐ</th>
                <th className="p-4 font-medium">Nhà cung cấp</th>
                <th className="p-4 font-medium">Tổng tiền</th>
                <th className="p-4 font-medium">Số dòng hàng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5D5C5] text-sm">
              {purchases.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-4">{new Date(p.purchaseDate).toLocaleDateString("vi-VN")}</td>
                  <td className="p-4 font-medium">{p.invoiceNo}</td>
                  <td className="p-4">{p.supplier?.name || p.supplierId}</td>
                  <td className="p-4 font-semibold text-[#D96C4E]">
                    {Number(p.totalAmount).toLocaleString("vi-VN")} ₫
                  </td>
                  <td className="p-4 text-gray-500">{p.items.length} dòng</td>
                </tr>
              ))}
              {purchases.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">Chưa có hóa đơn nhập hàng nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

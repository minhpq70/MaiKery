"use client";

import { useState, useTransition } from "react";
import { Product } from "@prisma/client";
import { saveProduct } from "@/app/(admin)/admin/(dashboard)/products/actions";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const MAX_UPLOAD_SIZE = 4 * 1024 * 1024;

async function compressImage(file: File) {
  const bitmap = await createImageBitmap(file);
  const maxDimension = 2400;
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.8),
  );
  if (!blob) throw new Error("Không thể nén ảnh");

  return new File([blob], `${file.name.replace(/\.[^/.]+$/, "")}.jpg`, {
    type: "image/jpeg",
  });
}

export function ProductForm({ product }: { product?: Product }) {
  const [isPending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || "");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadFile = file.size > MAX_UPLOAD_SIZE ? await compressImage(file) : file;
      const formData = new FormData();
      formData.append("file", uploadFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setImageUrl(data.url);
      } else {
        alert("Upload thất bại: " + (data.error || "Lỗi không xác định"));
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Đã xảy ra lỗi khi upload.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  return (
    <form 
      action={(formData) => startTransition(() => saveProduct(formData))} 
      className="space-y-6 max-w-2xl bg-white p-6 md:p-8 rounded-xl border border-[#E5D5C5] shadow-sm"
    >
      {product && <input type="hidden" name="id" value={product.id} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#5C4D43] mb-1.5">Mã sản phẩm</label>
          <input 
            name="productCode" 
            required 
            defaultValue={product?.productCode} 
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96C4E] focus:bg-white transition-all"
            placeholder="VD: BANH01"
          />
        </div>

        <div>
           <label className="block text-sm font-medium text-[#5C4D43] mb-1.5">Giá bán (VNĐ)</label>
          <input 
            name="price" 
            type="number" 
            required 
            min="0" 
            step="1000"
            defaultValue={product?.salePrice?.toString()} 
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96C4E] focus:bg-white transition-all"
            placeholder="VD: 50000"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#5C4D43] mb-1.5">Tên sản phẩm</label>
        <input 
          name="name" 
          required 
          defaultValue={product?.name} 
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96C4E] focus:bg-white transition-all"
          placeholder="Thuật ngữ tên sản phẩm..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#5C4D43] mb-1.5">Mô tả sản phẩm</label>
        <textarea 
          name="description" 
          rows={4} 
          defaultValue={product?.description || ""} 
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96C4E] focus:bg-white transition-all"
          placeholder="Mô tả chi tiết nguyên liệu, hương vị..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#5C4D43] mb-1.5">Hình ảnh sản phẩm</label>
        
        <input type="hidden" name="image" value={imageUrl} />

        <div className="flex flex-col gap-4">
          {imageUrl && (
            <div className="relative w-32 h-32 rounded-lg border border-gray-200 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
          
          <div className="flex items-center gap-4">
            <label className={`cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-[#5C4D43] hover:bg-gray-50 flex items-center gap-2 transition-all ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}>
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isUploading ? "Đang tải ảnh..." : "Chọn ảnh từ máy"}
              <input 
                type="file" 
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden" 
              />
            </label>
            <span className="text-xs text-gray-500 hidden md:inline">Ảnh lớn sẽ được tự nén — tối đa 4 MB sau nén</span>
          </div>

          <input 
            type="url" 
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96C4E] focus:bg-white transition-all text-sm"
            placeholder="https://example.com/image.jpg hoặc đường dẫn nội bộ"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
        <input 
          name="active" 
          type="checkbox" 
          defaultChecked={product ? product.isActive : true} 
          id="active"
          className="w-5 h-5 text-[#D96C4E] rounded border-gray-300 focus:ring-[#D96C4E]"
        />
        <div>
          <label htmlFor="active" className="text-sm font-bold text-[#40332B] cursor-pointer">Đang bán</label>
          <p className="text-xs text-gray-500">Hiển thị sản phẩm này trên cửa hàng</p>
        </div>
      </div>

      <div className="pt-4 flex items-center gap-4 border-t border-gray-100">
        <button 
          type="submit" 
          disabled={isPending} 
          className="bg-[#D96C4E] hover:bg-[#C55A3D] text-white px-6 py-2.5 rounded-lg font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {product ? "Cập nhật sản phẩm" : "Tạo sản phẩm mới"}
        </button>
        <Link 
          href="/admin/products"
          className="text-[#5C4D43] font-medium hover:text-[#D96C4E] transition-colors"
        >
          Hủy bỏ
        </Link>
      </div>
    </form>
  )
}

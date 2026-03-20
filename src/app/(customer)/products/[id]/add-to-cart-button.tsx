"use client";

import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { Product } from "@prisma/client";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    addItem({
      productId: product.id,
      productCode: product.productCode,
      productName: product.name,
      unitPrice: Number(product.salePrice),
      quantity: quantity,
      imageUrl: product.imageUrl || "",
    });
    alert(`Đã thêm ${quantity} x ${product.name} vào giỏ hàng!`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex items-center border-2 border-[#F2E8D9] rounded-full overflow-hidden bg-white w-32 h-14">
        <button 
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="w-10 h-full flex items-center justify-center text-[#5C4D43] hover:bg-[#FFFBF5] transition-colors"
        >
          -
        </button>
        <span className="flex-1 text-center font-bold text-[#40332B]">{quantity}</span>
        <button 
          onClick={() => setQuantity(quantity + 1)}
          className="w-10 h-full flex items-center justify-center text-[#5C4D43] hover:bg-[#FFFBF5] transition-colors"
        >
          +
        </button>
      </div>
      <button 
        onClick={handleAdd}
        className="flex-1 bg-[#D96C4E] hover:bg-[#8C3D2B] text-white font-bold h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        Thêm Vào Giỏ
      </button>
    </div>
  );
}

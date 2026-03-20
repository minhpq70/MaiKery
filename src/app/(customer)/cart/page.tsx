"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { cart, updateQty: updateQuantity, removeItem, clearCart } = useCart();
  const { items, totalItems, subtotal: totalPrice } = cart;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 bg-[#FFFBF5] rounded-full flex items-center justify-center text-[#D96C4E] mb-6 shadow-sm border border-[#F2E8D9]">
          <ShoppingBag size={40} />
        </div>
        <h1 className="text-2xl font-bold text-[#40332B] mb-4">Giỏ hàng rỗng</h1>
        <p className="text-[#5C4D43] mb-8">Bạn chưa chọn sản phẩm nào vào giỏ hàng.</p>
        <Link 
          href="/products" 
          className="bg-[#D96C4E] hover:bg-[#8C3D2B] text-white font-bold px-8 py-3 rounded-full transition-colors flex items-center gap-2"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl">
      <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#40332B] mb-8">Giỏ Hàng Của Bạn</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-[#F2E8D9] overflow-hidden">
            <div className="hidden sm:grid grid-cols-12 gap-4 p-4 border-b border-[#F2E8D9] bg-[#FFFBF5] text-sm font-bold text-[#5C4D43]">
              <div className="col-span-6">Sản phẩm</div>
              <div className="col-span-3 text-center">Số lượng</div>
              <div className="col-span-3 text-right text-[#8C3D2B]">Tạm tính</div>
            </div>
            
            <ul className="divide-y divide-[#F2E8D9]">
              {items.map((item) => (
                <li key={item.productId} className="p-4 sm:p-6 grid sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-6 flex items-center gap-4">
                    <button 
                      onClick={() => removeItem(item.productId)}
                      className="text-[#D96C4E] hover:text-red-600 transition-colors p-2 -ml-2 rounded-full hover:bg-red-50"
                      aria-label="Xoá sản phẩm"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#F2E8D9] rounded-xl overflow-hidden flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.imageUrl || "/placeholder.png"} alt={item.productName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#40332B] truncate max-w-[150px] sm:max-w-[200px]">{item.productName}</h3>
                      <p className="text-sm text-[#8C3D2B] font-medium">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.unitPrice)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3 flex justify-start sm:justify-center">
                    <div className="flex items-center border border-[#F2E8D9] rounded-full overflow-hidden bg-white h-10 w-28">
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-10 h-full flex items-center justify-center text-[#5C4D43] hover:bg-[#FFFBF5] transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="flex-1 text-center font-bold text-[#40332B] text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-10 h-full flex items-center justify-center text-[#5C4D43] hover:bg-[#FFFBF5] transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3 flex justify-between sm:justify-end items-center font-bold text-[#8C3D2B]">
                    <span className="sm:hidden text-[#5C4D43] text-sm">Tổng: </span>
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.unitPrice * item.quantity)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-6 flex justify-between items-center px-2">
            <Link href="/products" className="text-[#5C4D43] hover:text-[#D96C4E] text-sm font-medium flex items-center gap-2 transition-colors">
              Tiếp tục mua bánh
            </Link>
            <button 
              onClick={clearCart}
              className="text-[#5C4D43] hover:text-red-600 text-sm font-medium transition-colors border-b border-transparent hover:border-red-600"
            >
              Xoá tất cả
            </button>
          </div>
        </div>
        
        <div className="lg:w-[380px] shrink-0">
          <div className="bg-[#FFFBF5] rounded-2xl p-6 shadow-sm border border-[#F2E8D9] sticky top-24">
            <h2 className="text-xl font-bold text-[#40332B] mb-6">Tổng Đơn Hàng</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-[#5C4D43]">
                <span>Tổng {totalItems} sản phẩm</span>
                <span>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-[#5C4D43]">
                <span>Phí vận chuyển</span>
                <span className="text-sm italic">Chưa tính</span>
              </div>
            </div>
            
            <div className="border-t border-[#F2E8D9] pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#40332B]">Tạm tính</span>
                <span className="text-2xl font-bold text-[#8C3D2B]">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalPrice)}
                </span>
              </div>
            </div>
            
            <Link 
              href="/checkout" 
              className="w-full bg-[#D96C4E] hover:bg-[#8C3D2B] text-white font-bold h-12 rounded-full shadow-md flex items-center justify-center gap-2 transition-colors"
            >
              Tiến hành Thanh Toán <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

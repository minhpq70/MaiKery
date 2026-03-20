"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { useEffect, useState } from "react";

export function CartIcon() {
  const { cart } = useCart();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <Link href="/cart" className="relative group p-2 hover:bg-[#FFFBF5] rounded-full transition-colors border border-transparent hover:border-[#F2E8D9]">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C4D43" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-[#D96C4E] transition-colors">
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </svg>
      {mounted && itemCount > 0 && (
        <span className="absolute min-w-[20px] h-[20px] top-0 right-0 inline-flex items-center justify-center px-1 text-[11px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-[#D96C4E] rounded-full shadow-sm">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  );
}

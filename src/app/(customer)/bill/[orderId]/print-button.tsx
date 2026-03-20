"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="flex items-center gap-2 bg-[#F2E8D9] text-[#40332B] px-4 py-2 rounded-lg font-medium hover:bg-[#E5D5C5] transition-colors print:hidden"
    >
      <Printer className="w-4 h-4" /> In hóa đơn
    </button>
  );
}

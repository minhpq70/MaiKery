"use client";

import { deleteDiscount } from "@/app/(admin)/admin/(dashboard)/discounts/actions";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";

export function DeleteDiscountButton({ id, code }: { id: string; code: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (confirm(`Bạn có chắc chắn muốn xóa mã "${code}" không? Hành động này không thể hoàn tác.`)) {
      startTransition(async () => {
        const result = await deleteDiscount(id);
        if (result && !result.success) {
          alert(result.error);
        }
      });
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50" 
      title="Xóa mã"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}

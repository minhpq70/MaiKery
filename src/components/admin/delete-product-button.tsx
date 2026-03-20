"use client";

import { deleteProduct } from "@/app/(admin)/admin/(dashboard)/products/actions";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}" không?`)) {
      startTransition(async () => {
        const result = await deleteProduct(id);
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
      title="Xóa"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}

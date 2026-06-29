"use client";

import { useState, useTransition } from "react";
import { savePageContent } from "./actions";
import { Loader2, Save } from "lucide-react";

type PageItem = { slug: string; title: string; content: string };

export function PageEditorForm({ pages }: { pages: PageItem[] }) {
  const [activeSlug, setActiveSlug] = useState(pages[0]?.slug ?? "about");
  const [contents, setContents] = useState<Record<string, string>>(
    Object.fromEntries(pages.map((p) => [p.slug, p.content]))
  );
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState({ type: "", text: "" });

  const activePage = pages.find((p) => p.slug === activeSlug)!;

  const handleSave = () => {
    setMessage({ type: "", text: "" });
    startTransition(async () => {
      try {
        await savePageContent(activeSlug, contents[activeSlug]);
        setMessage({ type: "success", text: "Đã lưu nội dung" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } catch (err: any) {
        setMessage({ type: "error", text: "Lỗi: " + (err.message || "Đã xảy ra lỗi") });
      }
    });
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5D5C5] shadow-sm overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-[#E5D5C5] bg-[#FFFBF5]">
        {pages.map((p) => (
          <button
            key={p.slug}
            onClick={() => setActiveSlug(p.slug)}
            className={`px-5 py-3 text-sm font-medium transition-colors ${
              activeSlug === p.slug
                ? "border-b-2 border-[#D96C4E] text-[#D96C4E]"
                : "text-[#5C4D43] hover:text-[#40332B]"
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      <div className="p-6 space-y-4">
        {message.text && (
          <div className={`p-3 rounded-lg text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {message.text}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">
              URL: <span className="font-mono">/{activeSlug}</span>
            </p>
          </div>
          <a
            href={`/${activeSlug}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-[#D96C4E] hover:underline"
          >
            Xem trang →
          </a>
        </div>

        <textarea
          value={contents[activeSlug] ?? ""}
          onChange={(e) => setContents((prev) => ({ ...prev, [activeSlug]: e.target.value }))}
          rows={20}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96C4E] focus:bg-white transition-all font-serif text-sm text-[#40332B] leading-relaxed resize-y"
          placeholder="Nhập nội dung trang..."
        />
        <p className="text-xs text-gray-400">Xuống dòng 2 lần để tạo đoạn văn mới.</p>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isPending}
            className="bg-[#D96C4E] hover:bg-[#C55A3D] text-white px-6 py-2.5 rounded-lg font-bold transition-all disabled:opacity-70 flex items-center gap-2"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useTransition, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { savePageContent } from "./actions";
import { Loader2, Save, Bold, Italic, UnderlineIcon, AlignLeft, AlignCenter, AlignRight, List } from "lucide-react";

type PageItem = { slug: string; title: string; content: string };

function ToolbarButton({ onClick, active, title, children }: { onClick: () => void; active?: boolean; title: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={`p-1.5 rounded transition-colors ${active ? "bg-[#D96C4E] text-white" : "text-gray-600 hover:bg-gray-100"}`}
    >
      {children}
    </button>
  );
}

function PageEditor({ content, onSave, isPending }: { content: string; onSave: (html: string) => void; isPending: boolean }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Nhập nội dung trang..." }),
    ],
    content,
    editorProps: {
      attributes: {
        class: "prose prose-stone max-w-none focus:outline-none min-h-[400px] p-4 font-serif text-[#40332B] leading-relaxed",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-gray-200 bg-gray-50 flex-wrap">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="In đậm (Ctrl+B)">
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="In nghiêng (Ctrl+I)">
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Gạch chân (Ctrl+U)">
          <UnderlineIcon className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Căn trái">
          <AlignLeft className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Căn giữa">
          <AlignCenter className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Căn phải">
          <AlignRight className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Danh sách">
          <List className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        {["H2", "H3"].map((h) => {
          const level = parseInt(h[1]) as 2 | 3;
          return (
            <ToolbarButton key={h} onClick={() => editor.chain().focus().toggleHeading({ level }).run()} active={editor.isActive("heading", { level })} title={`Tiêu đề ${h}`}>
              <span className="text-xs font-bold px-0.5">{h}</span>
            </ToolbarButton>
          );
        })}

        <div className="ml-auto">
          <button
            type="button"
            onClick={() => onSave(editor.getHTML())}
            disabled={isPending}
            className="bg-[#D96C4E] hover:bg-[#C55A3D] text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-all disabled:opacity-70 flex items-center gap-1.5"
          >
            {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Lưu
          </button>
        </div>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  );
}

export function PageEditorForm({ pages }: { pages: PageItem[] }) {
  const [activeSlug, setActiveSlug] = useState(pages[0]?.slug ?? "about");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState({ type: "", text: "" });

  const activePage = pages.find((p) => p.slug === activeSlug)!;

  const handleSave = useCallback((html: string) => {
    setMessage({ type: "", text: "" });
    startTransition(async () => {
      try {
        await savePageContent(activeSlug, html);
        setMessage({ type: "success", text: "Đã lưu nội dung" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } catch (err: any) {
        setMessage({ type: "error", text: "Lỗi: " + (err.message || "Đã xảy ra lỗi") });
      }
    });
  }, [activeSlug]);

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

      <div className="p-6 space-y-3">
        {message.text && (
          <div className={`p-3 rounded-lg text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {message.text}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>URL: <span className="font-mono">/{activeSlug}</span></span>
          <a href={`/${activeSlug}`} target="_blank" rel="noreferrer" className="text-[#D96C4E] hover:underline">
            Xem trang →
          </a>
        </div>

        <PageEditor key={activeSlug} content={activePage.content} onSave={handleSave} isPending={isPending} />
      </div>
    </div>
  );
}

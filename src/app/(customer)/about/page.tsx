import { prisma } from "@/lib/prisma";

const DEFAULT_CONTENT = `Chuyện về một nàng thiếu nữ tên Mai.

Nàng từng có nhiều năm sống ở Đức – nơi những căn bếp gia đình không chỉ là chỗ nấu ăn, mà là không gian của ký ức, của sự kiên nhẫn và tình yêu được truyền qua nhiều thế hệ. Ở đó, nàng học được rằng làm bánh không đơn thuần là pha trộn các nguyên liệu với nhau, mà là một hình thức kể chuyện – bằng mùi hương, kết cấu và cảm xúc.

Những người phụ nữ Đức lớn tuổi đã dạy nàng những công thức cổ điển, những bí quyết nhỏ bé nhưng tinh tế, và trên hết là triết lý làm bánh bằng sự trân trọng: trân trọng nguyên liệu, trân trọng thời gian chờ đợi, và trân trọng người sẽ thưởng thức chiếc bánh ấy.

Khi về nước, nàng mang theo tình yêu dành cho những "tác phẩm nghệ thuật" từ căn bếp nhỏ. Ban đầu, đó chỉ là những chiếc bánh làm cho bạn bè, cho những buổi gặp gỡ thân tình. Nhưng rồi, niềm vui nhìn thấy người khác mỉm cười khi thưởng thức những miếng bánh đầu tiên đã thôi thúc nàng đi xa hơn – muốn được chia sẻ nhiều hơn.

MaiKery ra đời từ mong muốn giản dị ấy: đem tình yêu cùng tinh thần thủ công học được từ Đức gửi gắm vào từng chiếc bánh nhỏ bé.

Ngày ý tưởng MaiKery được hình thành là ngày đầu tiên của năm 2026, một cột mốc đáng nhớ trong cuộc đời nàng (!). Một khởi đầu mới, chậm rãi nhưng vững vàng, nơi nàng chọn làm bánh với sự nghiêm túc và trân trọng của một người luôn lấy sự chỉn chu làm kim chỉ nam trong từng việc nhỏ.

MaiKery không hướng đến sản xuất hàng loạt. MaiKery chọn làm bánh vừa đủ – đủ để giữ trọn chất lượng, đủ để mỗi chiếc bánh vẫn mang hơi ấm của căn bếp nhà, đủ để người nhận cảm thấy mình được quan tâm và yêu thương.

Với MaiKery, mỗi chiếc bánh không chỉ để ăn, mà để cảm. Và MaiKery ra đời để những cảm xúc ấy được lan tỏa – nhẹ nhàng, tinh tế, và chân thành.

MaiKery – bánh từ căn bếp của Mai, thương gửi đến bạn!`;

export default async function AboutPage() {
  const page = await prisma.pageContent.findUnique({ where: { slug: "about" } });
  const content = page?.content ?? DEFAULT_CONTENT;
  const isHtml = content.trimStart().startsWith("<");
  const displayContent = isHtml ? content.replace(/<p><\/p>/g, "<p><br></p>") : null;
  const paragraphs = isHtml ? null : content.split(/\n\n+/);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#40332B] mb-6">Về MaiKery</h1>
        <div className="h-1 w-20 bg-[#D96C4E] mx-auto rounded-full"></div>
      </div>
      {isHtml
        ? <div className="prose prose-stone lg:prose-lg mx-auto text-[#5C4D43] font-serif leading-relaxed" dangerouslySetInnerHTML={{ __html: displayContent! }} />
        : <div className="prose prose-stone lg:prose-lg mx-auto text-[#5C4D43] font-serif leading-relaxed">{paragraphs!.map((para, i) => <p key={i}>{para}</p>)}</div>
      }
    </div>
  );
}

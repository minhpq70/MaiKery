import { prisma } from "@/lib/prisma";

const DEFAULT_CONTENT = `Chính sách giao hàng của MaiKery.

Khu vực giao hàng
Hiện tại MaiKery giao hàng trong khu vực Ecopark và các khu vực lân cận. Vui lòng liên hệ trực tiếp để xác nhận khu vực giao hàng của bạn.

Thời gian giao hàng
Đơn hàng được xử lý và giao trong ngày (đối với đơn đặt trước 10:00 sáng). Thời gian giao hàng cụ thể sẽ được thông báo sau khi xác nhận đơn.

Phí giao hàng
Phí giao hàng được tính dựa trên khoảng cách và sẽ hiển thị khi thanh toán. Miễn phí giao hàng cho đơn từ 300.000đ trong khu vực Ecopark.

Lưu ý
Bánh là sản phẩm tươi, vui lòng nhận hàng và bảo quản ngay sau khi giao. Liên hệ ngay nếu có vấn đề về sản phẩm sau khi nhận hàng.`;

export default async function DeliveryPage() {
  const page = await prisma.pageContent.findUnique({ where: { slug: "delivery" } });
  const content = page?.content ?? DEFAULT_CONTENT;
  const isHtml = content.trimStart().startsWith("<");
  const paragraphs = isHtml ? null : content.split(/\n\n+/);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#40332B] mb-6">Chính sách giao hàng</h1>
        <div className="h-1 w-20 bg-[#D96C4E] mx-auto rounded-full"></div>
      </div>
      {isHtml
        ? <div className="prose prose-stone lg:prose-lg mx-auto text-[#5C4D43] font-serif leading-relaxed" dangerouslySetInnerHTML={{ __html: content }} />
        : <div className="prose prose-stone lg:prose-lg mx-auto text-[#5C4D43] font-serif leading-relaxed">{paragraphs!.map((para, i) => <p key={i}>{para}</p>)}</div>
      }
    </div>
  );
}

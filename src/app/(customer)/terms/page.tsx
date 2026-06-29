import { prisma } from "@/lib/prisma";

const DEFAULT_CONTENT = `Điều khoản dịch vụ của MaiKery.

Bằng cách sử dụng trang web và đặt hàng tại MaiKery, bạn đồng ý tuân thủ các điều khoản dịch vụ dưới đây.

Chính sách đặt hàng
Đơn hàng được xác nhận sau khi khách hàng hoàn tất thanh toán. MaiKery có quyền từ chối hoặc hủy đơn hàng trong trường hợp sản phẩm không còn sẵn hàng.

Chính sách thanh toán
MaiKery chấp nhận thanh toán qua chuyển khoản ngân hàng. Đơn hàng chỉ được xử lý sau khi nhận được thanh toán đầy đủ.

Trách nhiệm
MaiKery cam kết cung cấp sản phẩm đúng mô tả và đảm bảo chất lượng. Trong trường hợp sản phẩm bị lỗi do quá trình vận chuyển hoặc sản xuất, MaiKery sẽ hoàn trả hoặc đổi sản phẩm mới.`;

export default async function TermsPage() {
  const page = await prisma.pageContent.findUnique({ where: { slug: "terms" } });
  const content = page?.content ?? DEFAULT_CONTENT;
  const isHtml = content.trimStart().startsWith("<");
  const displayContent = isHtml ? content.replace(/<p><\/p>/g, "<p><br></p>") : null;
  const paragraphs = isHtml ? null : content.split(/\n\n+/);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#40332B] mb-6">Điều khoản dịch vụ</h1>
        <div className="h-1 w-20 bg-[#D96C4E] mx-auto rounded-full"></div>
      </div>
      {isHtml
        ? <div className="prose prose-stone lg:prose-lg mx-auto text-[#5C4D43] font-serif leading-relaxed" dangerouslySetInnerHTML={{ __html: displayContent! }} />
        : <div className="prose prose-stone lg:prose-lg mx-auto text-[#5C4D43] font-serif leading-relaxed">{paragraphs!.map((para, i) => <p key={i}>{para}</p>)}</div>
      }
    </div>
  );
}

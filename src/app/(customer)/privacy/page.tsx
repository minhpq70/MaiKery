import { prisma } from "@/lib/prisma";

const DEFAULT_CONTENT = `Chính sách bảo mật của MaiKery.

MaiKery cam kết bảo vệ thông tin cá nhân của khách hàng. Chúng tôi chỉ thu thập thông tin cần thiết để xử lý đơn hàng và cải thiện dịch vụ.

Thông tin chúng tôi thu thập
Họ tên, địa chỉ email, số điện thoại và địa chỉ giao hàng. Thông tin thanh toán (không lưu trữ thông tin thẻ ngân hàng).

Cách chúng tôi sử dụng thông tin
Xử lý và giao nhận đơn hàng. Thông báo về trạng thái đơn hàng. Cải thiện trải nghiệm mua sắm.

Bảo mật thông tin
Chúng tôi không chia sẻ thông tin cá nhân của bạn cho bên thứ ba ngoài mục đích giao hàng. Mọi dữ liệu được mã hóa và lưu trữ an toàn.`;

export default async function PrivacyPage() {
  const page = await prisma.pageContent.findUnique({ where: { slug: "privacy" } });
  const content = page?.content ?? DEFAULT_CONTENT;
  const paragraphs = content.split(/\n\n+/);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#40332B] mb-6">Chính sách bảo mật</h1>
        <div className="h-1 w-20 bg-[#D96C4E] mx-auto rounded-full"></div>
      </div>
      <div className="prose prose-stone lg:prose-lg mx-auto text-[#5C4D43] font-serif leading-relaxed">
        {paragraphs.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </div>
  );
}

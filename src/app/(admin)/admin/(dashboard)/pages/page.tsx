import { prisma } from "@/lib/prisma";
import { PageEditorForm } from "./page-editor-form";

const PAGE_DEFAULTS: Record<string, { title: string; defaultContent: string }> = {
  about: {
    title: "Về chúng tôi",
    defaultContent: `Chuyện về một nàng thiếu nữ tên Mai.

Nàng từng có nhiều năm sống ở Đức – nơi những căn bếp gia đình không chỉ là chỗ nấu ăn, mà là không gian của ký ức, của sự kiên nhẫn và tình yêu được truyền qua nhiều thế hệ. Ở đó, nàng học được rằng làm bánh không đơn thuần là pha trộn các nguyên liệu với nhau, mà là một hình thức kể chuyện – bằng mùi hương, kết cấu và cảm xúc.

Những người phụ nữ Đức lớn tuổi đã dạy nàng những công thức cổ điển, những bí quyết nhỏ bé nhưng tinh tế, và trên hết là triết lý làm bánh bằng sự trân trọng: trân trọng nguyên liệu, trân trọng thời gian chờ đợi, và trân trọng người sẽ thưởng thức chiếc bánh ấy.

Khi về nước, nàng mang theo tình yêu dành cho những "tác phẩm nghệ thuật" từ căn bếp nhỏ. Ban đầu, đó chỉ là những chiếc bánh làm cho bạn bè, cho những buổi gặp gỡ thân tình. Nhưng rồi, niềm vui nhìn thấy người khác mỉm cười khi thưởng thức những miếng bánh đầu tiên đã thôi thúc nàng đi xa hơn – muốn được chia sẻ nhiều hơn.

MaiKery ra đời từ mong muốn giản dị ấy: đem tình yêu cùng tinh thần thủ công học được từ Đức gửi gắm vào từng chiếc bánh nhỏ bé.

Ngày ý tưởng MaiKery được hình thành là ngày đầu tiên của năm 2026, một cột mốc đáng nhớ trong cuộc đời nàng (!). Một khởi đầu mới, chậm rãi nhưng vững vàng, nơi nàng chọn làm bánh với sự nghiêm túc và trân trọng của một người luôn lấy sự chỉn chu làm kim chỉ nam trong từng việc nhỏ.

MaiKery không hướng đến sản xuất hàng loạt. MaiKery chọn làm bánh vừa đủ – đủ để giữ trọn chất lượng, đủ để mỗi chiếc bánh vẫn mang hơi ấm của căn bếp nhà, đủ để người nhận cảm thấy mình được quan tâm và yêu thương.

Với MaiKery, mỗi chiếc bánh không chỉ để ăn, mà để cảm. Và MaiKery ra đời để những cảm xúc ấy được lan tỏa – nhẹ nhàng, tinh tế, và chân thành.

MaiKery – bánh từ căn bếp của Mai, thương gửi đến bạn!`,
  },
  terms: {
    title: "Điều khoản dịch vụ",
    defaultContent: `Điều khoản dịch vụ của MaiKery.

Bằng cách sử dụng trang web và đặt hàng tại MaiKery, bạn đồng ý tuân thủ các điều khoản dịch vụ dưới đây.

Chính sách đặt hàng
Đơn hàng được xác nhận sau khi khách hàng hoàn tất thanh toán. MaiKery có quyền từ chối hoặc hủy đơn hàng trong trường hợp sản phẩm không còn sẵn hàng.

Chính sách thanh toán
MaiKery chấp nhận thanh toán qua chuyển khoản ngân hàng. Đơn hàng chỉ được xử lý sau khi nhận được thanh toán đầy đủ.

Trách nhiệm
MaiKery cam kết cung cấp sản phẩm đúng mô tả và đảm bảo chất lượng. Trong trường hợp sản phẩm bị lỗi do quá trình vận chuyển hoặc sản xuất, MaiKery sẽ hoàn trả hoặc đổi sản phẩm mới.`,
  },
  privacy: {
    title: "Chính sách bảo mật",
    defaultContent: `Chính sách bảo mật của MaiKery.

MaiKery cam kết bảo vệ thông tin cá nhân của khách hàng. Chúng tôi chỉ thu thập thông tin cần thiết để xử lý đơn hàng và cải thiện dịch vụ.

Thông tin chúng tôi thu thập
Họ tên, địa chỉ email, số điện thoại và địa chỉ giao hàng. Thông tin thanh toán (không lưu trữ thông tin thẻ ngân hàng).

Cách chúng tôi sử dụng thông tin
Xử lý và giao nhận đơn hàng. Thông báo về trạng thái đơn hàng. Cải thiện trải nghiệm mua sắm.

Bảo mật thông tin
Chúng tôi không chia sẻ thông tin cá nhân của bạn cho bên thứ ba ngoài mục đích giao hàng. Mọi dữ liệu được mã hóa và lưu trữ an toàn.`,
  },
  delivery: {
    title: "Chính sách giao hàng",
    defaultContent: `Chính sách giao hàng của MaiKery.

Khu vực giao hàng
Hiện tại MaiKery giao hàng trong khu vực Ecopark và các khu vực lân cận. Vui lòng liên hệ trực tiếp để xác nhận khu vực giao hàng của bạn.

Thời gian giao hàng
Đơn hàng được xử lý và giao trong ngày (đối với đơn đặt trước 10:00 sáng). Thời gian giao hàng cụ thể sẽ được thông báo sau khi xác nhận đơn.

Phí giao hàng
Phí giao hàng được tính dựa trên khoảng cách và sẽ hiển thị khi thanh toán. Miễn phí giao hàng cho đơn từ 300.000đ trong khu vực Ecopark.

Lưu ý
Bánh là sản phẩm tươi, vui lòng nhận hàng và bảo quản ngay sau khi giao. Liên hệ ngay nếu có vấn đề về sản phẩm sau khi nhận hàng.`,
  },
};

export default async function AdminPagesPage() {
  const pages = await prisma.pageContent.findMany();
  const contentMap = Object.fromEntries(pages.map((p) => [p.slug, p.content]));

  const pageList = Object.entries(PAGE_DEFAULTS).map(([slug, meta]) => ({
    slug,
    title: meta.title,
    content: contentMap[slug] ?? meta.defaultContent,
  }));

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">Nội dung trang</h1>
      <PageEditorForm pages={pageList} />
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#40332B] mb-6">Về MaiKery</h1>
        <div className="h-1 w-20 bg-[#D96C4E] mx-auto rounded-full"></div>
      </div>
      
      <div className="prose prose-stone lg:prose-lg mx-auto text-[#5C4D43] font-serif leading-relaxed">
        <p>
          Chào mừng bạn đến với MaiKery - Tiệm bánh nhỏ ngập tràn tình yêu thương! 
        </p>
        <p>
          Khởi nguồn từ một căn bếp nhỏ vào năm 2023, MaiKery được sinh ra mang theo giấc mơ tạo nên những chiếc bánh không chỉ đạt chuẩn về hình thức, mà còn lay động vị giác ngay từ miếng cắn đầu tiên. 
        </p>
        <p>
          Chúng tôi tin rằng ẩm thực là một loại ngôn ngữ kì diệu. Một chiếc bánh ngon có thể xua tan mệt mỏi, gửi gắm lời yêu thương khó nói, hay đơn giản là tự thưởng cho bản thân sau một ngày dài vất vả.
        </p>
        <h3 className="text-2xl font-bold text-[#8C3D2B] mt-10 mb-4">Triết Lý Của Chúng Tôi</h3>
        <ul>
          <li><strong>Nguyên liệu thượng hạng:</strong> Bơ lạt xuất xứ từ Pháp, chocolate Bỉ 70%, bột mì đặc dụng cao cấp... Chúng tôi không bao giờ thoả hiệp với chất lượng nguyên liệu.</li>
          <li><strong>Tươi mới mỗi ngày:</strong> Bánh tại MaiKery luôn được ra lò liên tục mỗi 4 giờ và bán hết trong ngày.</li>
          <li><strong>Không chất bảo quản:</strong> Tôn trọng sự nguyên bản và tự nhiên nhất, chúng tôi tuyệt đối nói không với bất kì loại chất bảo quản công nghiệp nào.</li>
        </ul>
        <p>
          Mỗi chiếc bánh là một tác phẩm nghệ thuật thu nhỏ được những người thợ làm bánh tại MaiKery nhào nặn bằng thủ công, gửi gắm toàn bộ tâm huyết và sự tận tuỵ.
        </p>
        <p className="text-xl font-bold text-[#D96C4E] mt-10 italic text-center">
          "Cảm ơn bạn đã ghé thăm MaiKery. Chúc bạn có một ngày thật ngọt ngào!"
        </p>
      </div>
    </div>
  );
}

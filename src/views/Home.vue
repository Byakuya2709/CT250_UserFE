<template>
    <div>
      <!-- Hero Section -->
      <section class="bg-blue-600 text-white text-center py-16 relative">
        <img src="https://picsum.photos/1600/900?random=1" alt="Sự kiện nổi bật" class="absolute inset-0 w-full h-full object-cover opacity-30">
        <div class="relative z-10">
          <h1 class="text-4xl font-bold">Chào mừng đến với EventHub</h1>
          <p class="mt-4 text-lg">Nền tảng đặt vé sự kiện hàng đầu giúp bạn trải nghiệm những khoảnh khắc tuyệt vời nhất!</p>
          <router-link to="/events" style="display: inline-block;" class="mt-6 px-6 py-3 bg-yellow-400 text-black font-semibold rounded-full shadow-lg hover:bg-yellow-500">
            Tìm Hiểu Ngay
          </router-link>
        </div>
      </section>
  
      <!-- Giới thiệu về EventHub -->
      <section class="container mx-auto py-12 px-6 text-center">
        <h2 class="text-3xl font-bold mb-8">Về Chúng Tôi</h2>
        <img src="https://picsum.photos/800/400?random=2" alt="Giới thiệu EventHub" class="mx-auto rounded-lg shadow-lg mb-6">
        <p class="text-gray-700 text-lg max-w-3xl mx-auto">
          EventHub là nền tảng giúp bạn dễ dàng tìm kiếm, đặt vé và tham gia những sự kiện hấp dẫn nhất. Chúng tôi mang đến
          trải nghiệm đặt vé nhanh chóng, an toàn và tiện lợi với đa dạng các sự kiện từ hội thảo, âm nhạc, thể thao đến giải trí.
        </p>
      </section>
  
      <!-- Lợi ích khi sử dụng EventHub -->
      <section class="container mx-auto py-12 bg-gray-100 px-6">
        <h2 class="text-3xl font-bold text-center mb-8">Tại sao chọn EventHub?</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white shadow-lg p-6 rounded-lg text-center">
            <img src="https://picsum.photos/200/200?random=3" alt="Đa dạng sự kiện" class="mx-auto mb-4 rounded-full">
            <h3 class="text-xl font-semibold">Đa dạng sự kiện</h3>
            <p class="text-gray-600 mt-2">Hàng trăm sự kiện hấp dẫn trên toàn quốc.</p>
          </div>
          <div class="bg-white shadow-lg p-6 rounded-lg text-center">
            <img src="https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg" style="width: 200px; height: 200px;" alt="Thanh toán an toàn" class="mx-auto mb-4 rounded-full">
            <h3 class="text-xl font-semibold">Thanh toán trực tuyến</h3>
            <p class="text-gray-600 mt-2">Hỗ trợ thanh toán trực tuyến qua VNPAY.</p>
          </div>
          <div class="bg-white shadow-lg p-6 rounded-lg text-center">
            <img src="https://picsum.photos/200/200?random=5" alt="Dễ dàng sử dụng" class="mx-auto mb-4 rounded-full">
            <h3 class="text-xl font-semibold">Dễ dàng sử dụng</h3>
            <p class="text-gray-600 mt-2">Giao diện thân thiện, đặt vé nhanh chóng.</p>
          </div>
        </div>
      </section>
  
      <!-- Danh sách sự kiện nổi bật -->
      <section class="container mx-auto py-12 px-6">
        <h2 class="text-3xl font-bold text-center mb-8">Sự kiện nổi bật</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white shadow-lg p-6 rounded-lg text-center">
            <img src="https://picsum.photos/400/300?random=6" alt="Lễ hội âm nhạc" class="mx-auto mb-4 rounded-lg">
            <h3 class="text-xl font-semibold">Lễ hội Âm nhạc 2024</h3>
            <p class="text-gray-600 mt-2">Trải nghiệm không khí sôi động với các nghệ sĩ hàng đầu.</p>
          </div>
          <div class="bg-white shadow-lg p-6 rounded-lg text-center">
            <img src="https://picsum.photos/400/300?random=7" alt="Hội thảo kinh doanh" class="mx-auto mb-4 rounded-lg">
            <h3 class="text-xl font-semibold">Hội thảo Kinh doanh Toàn cầu</h3>
            <p class="text-gray-600 mt-2">Kết nối với chuyên gia và mở rộng cơ hội phát triển.</p>
          </div>
          <div class="bg-white shadow-lg p-6 rounded-lg text-center">
            <img src="https://picsum.photos/400/300?random=8" alt="Giải đấu thể thao" class="mx-auto mb-4 rounded-lg">
            <h3 class="text-xl font-semibold">Giải đấu Thể thao Mùa hè</h3>
            <p class="text-gray-600 mt-2">Cùng cổ vũ và tận hưởng những trận đấu hấp dẫn.</p>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  export default {};
  </script>
  
  <style>
  body {
    font-family: 'Arial', sans-serif;
  }
  </style>
  
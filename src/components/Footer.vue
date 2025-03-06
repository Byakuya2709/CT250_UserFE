<template>
  <footer id="footer" class="text-white py-6">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Chi Nhánh -->
        <div>
          <h3 class="text-lg font-semibold mb-3">Chi Nhánh</h3>
          <ul class="space-y-2">
            <li>
              <button
                class="w-full text-left flex justify-between items-center font-medium text-black hover:text-blue-400"
                @click="toggleCollapse('hcm')"
              >
                <span
                  ><i class="fa-solid fa-location-dot mr-2"></i>Chi Nhánh Hồ Chí
                  Minh</span
                >
                <i
                  class="fa-solid"
                  :class="
                    openSection === 'hcm' ? 'fa-angle-up' : 'fa-angle-down'
                  "
                ></i>
              </button>
              <div v-if="openSection === 'hcm'" class="mt-2 text-black-300">
                <p><strong>Quận 1:</strong> Central Market, 4 Phạm Ngũ Lão</p>
                <p><strong>Quận 10:</strong> 561 Sư Vạn Hạnh, Phường 13</p>
                <p><strong>Gò Vấp:</strong> 326 Quang Trung, Phường 10</p>
              </div>
            </li>
            <li>
              <button
                class="w-full text-left flex justify-between items-center font-medium text-black hover:text-blue-400"
                @click="toggleCollapse('ct')"
              >
                <span
                  ><i class="fa-solid fa-location-dot mr-2"></i>Chi Nhánh Cần
                  Thơ</span
                >
                <i
                  class="fa-solid"
                  :class="
                    openSection === 'ct' ? 'fa-angle-up' : 'fa-angle-down'
                  "
                ></i>
              </button>
              <div v-if="openSection === 'ct'" class="mt-2 text-black-300">
                <p><strong>Ninh Kiều:</strong> 52 Mậu Thân, Phường An Phú</p>
              </div>
            </li>
          </ul>

          <!-- Contact -->
          <div class="mt-4 text-black-300">
            <p>
              <i class="fa-solid fa-envelope mr-2"></i>nhom10@student.ctu.edu.vn
            </p>
            <p>
              <i class="fa-solid fa-phone mr-2"></i> Hỗ trợ / Mua hàng: 0xxx xxx
              xxx
            </p>
          </div>
        </div>

        <!-- Mạng Xã Hội & Chính Sách -->
        <div>
          <div class="mb-4">
            <h3 class="text-lg font-semibold">Mạng Xã Hội</h3>
            <div class="flex space-x-4 mt-2">
              <a href="#" class="text-black-400 hover:text-blue-400 text-xl"
                ><i class="fa-brands fa-facebook"></i
              ></a>
              <a href="#" class="text-black-400 hover:text-pink-500 text-xl"
                ><i class="fa-brands fa-instagram"></i
              ></a>
              <a href="#" class="text-black-400 hover:text-red-500 text-xl"
                ><i class="fa-brands fa-youtube"></i
              ></a>
            </div>
          </div>

          <div>
            <button
              class="w-full text-left flex justify-between items-center font-medium text-black hover:text-blue-400"
              @click="toggleCollapse('policy')"
            >
              <span>Chính Sách</span>
              <i
                class="fa-solid"
                :class="
                  openSection === 'policy' ? 'fa-angle-up' : 'fa-angle-down'
                "
              ></i>
            </button>
            <ul
              v-if="openSection === 'policy'"
              class="mt-2 text-gray-300 space-y-1"
            >
              <li>
                <a href="#" class="hover:text-blue-400">Chính sách bảo mật</a>
              </li>
              <li><a href="#" class="hover:text-blue-400">FAQ</a></li>
              <li>
                <a href="#" class="hover:text-blue-400"
                  >Chính sách Bảo hành & Đổi trả</a
                >
              </li>
              <li>
                <a href="#" class="hover:text-blue-400">Chính sách giao hàng</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div
        class="text-center border-t border-gray-700 mt-6 pt-4 text-black-400"
      >
        <p>Copyright &copy; Nhóm 10.</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      openSection: null,
    };
  },
  methods: {
    toggleCollapse(section) {
      this.openSection = this.openSection === section ? null : section;
    },
  },
};
</script>

<style scoped>
#footer {
  background-color: rgba(223, 216, 205, 0.322);
  color: black !important;
}
</style>

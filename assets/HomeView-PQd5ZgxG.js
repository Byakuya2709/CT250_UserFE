import{_ as x,r as _,c as r,o as l,a as t,b,d as y,w as f,e as c,n as g,F as d,f as u,t as i,g as v}from"./index-ocYKao6t.js";const k="/CT250_UserFE/assets/vnpay-CObE-f4E.png",w={data(){return{blogs:[],loading:!0,error:null,eventInCurrentMonth:[]}},methods:{goBlogDetail(n){this.$router.push(`/events/${n.eventId}/blogs/${n.blogId}`)},async fetchCurrentMonthEvents(){try{const n=await v.get("/public/current-month");this.eventInCurrentMonth=n.data.data}catch(n){this.error="Lỗi khi lấy danh sách sự kiện top-rated",console.error(n)}},async fetchBlogsRecent(){var n,e;try{const a=await v.get("/blogs/recent");this.blogs=a.data,console.log(this.blogs)}catch(a){this.$toast.error(((e=(n=a.response)==null?void 0:n.data)==null?void 0:e.message)||"Đã xảy ra lỗi")}},toDetail(n){this.$router.push({path:`/events/${n}`})}},async mounted(){await this.fetchCurrentMonthEvents(),await this.fetchBlogsRecent(),this.loading=!1}},C={class:"bg-gradient-to-b from-purple-600 to-pink-500 text-white"},I={class:"text-center py-16"},D={class:"mt-6"},B={class:"py-16"},M={key:0,class:"mt-8 px-4 rounded-lg"},S={class:"flex justify-center"},E=["onClick"],L=["src"],V={class:"p-4 space-y-2 bg-gray-100"},j={class:"text-lg font-medium text-gray-900 truncate"},N={class:"text-sm text-gray-600"},R={key:1,class:"text-center text-gray-500 text-base mt-6"},T={class:"py-16"},F={class:"container mx-auto px-4"},H={class:"flex justify-center"},K=["onClick"],U=["src"],z={class:"p-4"},A={class:"text-lg font-semibold text-gray-800"},q={class:"text-gray-600 text-sm mt-2 truncate"},G={class:"text-gray-500 text-xs mt-3"};function O(n,e,a,P,o,h){const p=_("router-link");return l(),r(d,null,[t("div",C,[t("section",I,[e[1]||(e[1]=t("h1",{class:"text-4xl font-bold"},"Chào mừng đến với EventHub",-1)),e[2]||(e[2]=t("p",{class:"mt-4"}," Nền tảng đặt vé sự kiện hàng đầu giúp bạn trải nghiệm những khoảnh khắc tuyệt vời nhất! ",-1)),t("div",D,[y(p,{to:"/events",class:"bg-pink-600 px-6 py-3 rounded-full"},{default:f(()=>e[0]||(e[0]=[c(" Xem Sự Kiện ")])),_:1})])])]),t("section",B,[e[4]||(e[4]=t("h2",{class:"text-3xl font-bold text-center"},"Sự Kiện Sắp Diễn Ra",-1)),o.eventInCurrentMonth.length?(l(),r("div",M,[t("div",S,[t("div",{class:g(["grid gap-6",{"grid-cols-3":o.eventInCurrentMonth.length>=3,"grid-cols-2":o.eventInCurrentMonth.length===2,"grid-cols-1":o.eventInCurrentMonth.length===1}])},[(l(!0),r(d,null,u(o.eventInCurrentMonth,s=>(l(),r("div",{key:s.eventId,onClick:m=>h.toDetail(s.eventId),class:"group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-blue-500"},[t("img",{src:s.eventImageURL??"https://res.cloudinary.com/dtza0pk4w/image/upload/v1736700339/mbs_ortxmh.jpg",class:"w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110",alt:"Event Image"},null,8,L),t("div",V,[t("h5",j,i(s.eventTitle),1),t("p",N,[c(" 📅 "+i(new Date(s.eventStartDate).toLocaleDateString())+" ",1),e[3]||(e[3]=t("br",null,null,-1)),c("📍 "+i(s.eventAddress),1)])])],8,E))),128))],2)])])):(l(),r("div",R," Không có sự kiện nào trong tháng này. "))]),e[6]||(e[6]=b('<div class="make-event-container bg-gradient-to-b from-purple-600 to-pink-500" data-v-318e1235><div class="make-event-content" data-v-318e1235><img src="'+k+'" style="width:200px;height:200px;" class="event-image" data-v-318e1235><div class="event-text" data-v-318e1235><h2 class="text-2xl font-bold" data-v-318e1235>Thanh toán trực tuyến</h2><p class="text-2xl" data-v-318e1235>Hỗ trợ thanh toán trực tuyến qua VNPAY.</p></div></div></div>',1)),t("section",T,[e[5]||(e[5]=t("h2",{class:"text-3xl font-bold text-center mb-8"},"Bài Viết Gần Đây",-1)),t("div",F,[t("div",H,[t("div",{class:g(["grid gap-6",{"grid-cols-5":o.blogs.length>=5,"grid-cols-4":o.blogs.length===4,"grid-cols-3":o.blogs.length===3,"grid-cols-2":o.blogs.length===2,"grid-cols-1":o.blogs.length===1}])},[(l(!0),r(d,null,u(o.blogs,s=>(l(),r("div",{key:s.blogId,class:"bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 hover:shadow-2xl hover:border-blue-500",onClick:m=>h.goBlogDetail(s)},[t("img",{src:s.eventListImgURL[0],alt:"Blog image",class:"w-full h-48 object-cover"},null,8,U),t("div",z,[t("h3",A,i(s.blogSubject),1),t("p",q,i(s.blogContent),1),t("div",G,i(new Date(s.blogCreateDate).toLocaleDateString()),1)])],8,K))),128))],2)])])])],64)}const Y=x(w,[["render",O],["__scopeId","data-v-318e1235"]]);export{Y as default};

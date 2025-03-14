import{_ as c,c as l,o as d,a as e,F as g,f as u,t as n,e as i,g as h}from"./index-ocYKao6t.js";import{f as m}from"./format-Dp1kM_9R.js";const f={data(){return{loading:!0,events:[],currentPage:1,itemsPerPage:20,totalPages:1,keyword:""}},computed:{},methods:{formatCurrency:m,getPosterImage(s){return!s||s.length===0?"/default-event.jpg":s.find(t=>t.includes("poster.jpg"))||s[0]},async getEvents(){this.loading=!0;try{const s=await h.get("/public/search-text",{params:{keyword:this.keyword,page:this.currentPage-1,size:this.itemsPerPage}});s.data.status==="OK"?(this.events=s.data.data.content,this.totalPages=s.data.data.totalPages):this.$toast.error("Lỗi khi tải sự kiện.")}catch(s){console.error("Lỗi khi tải sự kiện:",s),this.$toast.error("Lỗi khi tải sự kiện.")}finally{this.loading=!1}},formatDate(s){return new Date(s).toLocaleString()},goToEventDetails(s){this.$router.push({path:`/events/${s}`})},prevPage(){this.currentPage>1&&(this.currentPage--,this.getEvents())},nextPage(){this.currentPage<this.totalPages&&(this.currentPage++,this.getEvents())}},watch:{"$route.query.keyword":{immediate:!0,handler(s){this.keyword=s||"",this.currentPage=1,this.getEvents()}}}},p={class:"flex mx-auto p-4 border border-gray-300"},P={class:"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"},v=["onClick"],x={class:"text-lg font-semibold mb-2"},b={class:"text-gray-600 mb-2 truncate"},y={class:"text-sm"},k={class:"text-sm"},_={class:"text-sm"},w={class:"text-sm"},D=["src"],T={class:"flex justify-between items-center mt-6"},E=["disabled"],C={class:"font-semibold"},I=["disabled"];function S(s,t,j,B,o,a){return d(),l(g,null,[t[8]||(t[8]=e("h2",{class:"text-4xl font-bold text-gray-800 p-4 text-center",style:{background:"#f3e8ff"}}," Kết Quả Tìm Kiếm ",-1)),e("div",p,[e("div",null,[e("div",P,[(d(!0),l(g,null,u(o.events,r=>(d(),l("div",{key:r.eventId,class:"bg-white shadow-lg rounded-lg p-4 hover:scale-105 cursor-pointer",onClick:K=>a.goToEventDetails(r.eventId)},[e("h3",x,n(r.eventTitle),1),e("p",b,n(r.eventDescription),1),e("p",y,[t[2]||(t[2]=e("strong",null,"Ngày Bắt đầu:",-1)),i(" "+n(a.formatDate(r.eventStartDate)),1)]),e("p",k,[t[3]||(t[3]=e("strong",null,"Ngày Kết Thúc:",-1)),i(" "+n(a.formatDate(r.eventEndDate)),1)]),e("p",_,[t[4]||(t[4]=e("strong",null,"Giá:",-1)),i(" "+n(a.formatCurrency(r.eventPrice)),1)]),e("p",w,[t[5]||(t[5]=e("strong",null,"Trạng thái:",-1)),i(" "+n(r.eventStatus),1)]),e("img",{src:a.getPosterImage(r.eventListImgURL),alt:"Event Image",class:"w-full h-40 object-cover mt-3 rounded-md"},null,8,D)],8,v))),128))]),e("div",T,[e("button",{onClick:t[0]||(t[0]=(...r)=>a.prevPage&&a.prevPage(...r)),disabled:o.currentPage===1,class:"px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"},t[6]||(t[6]=[e("i",{class:"fas fa-chevron-left"},null,-1),i(" Trang trước ")]),8,E),e("span",C,"Trang "+n(o.currentPage)+" / "+n(o.totalPages),1),e("button",{onClick:t[1]||(t[1]=(...r)=>a.nextPage&&a.nextPage(...r)),disabled:o.currentPage>=o.totalPages,class:"px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"},t[7]||(t[7]=[i(" Trang sau "),e("i",{class:"fas fa-chevron-right"},null,-1)]),8,I)])])])],64)}const V=c(f,[["render",S]]);export{V as default};

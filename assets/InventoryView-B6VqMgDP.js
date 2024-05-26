import{r as i,b as u,d as _,c as a,a as t,f as h,w as p,F as m,e as g,h as v,i as y,j as b,z as f,o as n,q as x,t as o}from"./index-IiPDjdcb.js";const w={class:"container d-flex justify-content-center align-items-center mt-2"},k={class:"card col-lg mx-2 my-2 shadow"},D={class:"mx-2 mt-2"},L=t("i",{class:"bi bi-plus"},null,-1),N={class:"card mx-2 my-2"},A={class:"card-body"},B={class:"container mt-3"},I={class:"table-responsive"},V={class:"table table-hover"},z=t("thead",null,[t("tr",null,[t("th",{scope:"col"},"ID"),t("th",{scope:"col"},"Name"),t("th",{scope:"col"},"Description"),t("th",{scope:"col"},"Quantity"),t("th",{scope:"col"},"Price"),t("th",{scope:"col"},"Updated At")])],-1),S={key:0},U=t("td",{colspan:"7",class:"text-center align-middle"},[t("div",{class:"spinner-border text-primary",role:"status"},[t("span",{class:"visually-hidden"},"Loading...")])],-1),j=[U],P={__name:"InventoryView",setup(q){const c=i([]),l=i(!0),r=async()=>{try{const e=await v.get(`${y}products`,{headers:{Authorization:`Bearer ${b.get("token")}`}});c.value=e.data.data}catch(e){console.error(e),e.response&&e.response.status===401?(alert("Unauthorized. Please login again"),await f.push("/login")):alert("Something went wrong: "+e)}finally{l.value=!1}};return u(()=>{r()}),(e,C)=>{const d=_("RouterLink");return n(),a("div",w,[t("div",k,[t("div",D,[h(d,{class:"btn btn-outline-secondary",to:"/inventory/add"},{default:p(()=>[L,x(" Add New Inventory ")]),_:1})]),t("div",N,[t("div",A,[t("div",B,[t("div",I,[t("table",V,[z,t("tbody",null,[l.value?(n(),a("tr",S,j)):(n(!0),a(m,{key:1},g(c.value,s=>(n(),a("tr",{key:s.id},[t("td",null,o(s.id),1),t("td",null,o(s.name),1),t("td",null,o(s.quantity),1),t("td",null,o(s.price),1),t("td",null,o(s.description),1),t("td",null,o(new Date(s.updated_at).toLocaleString()),1)]))),128))])])])])])])])])}}};export{P as default};

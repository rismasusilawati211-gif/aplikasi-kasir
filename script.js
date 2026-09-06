const products=[
 {id:1,name:"Nasi Goreng",price:15000,icon:"🍚"},
 {id:2,name:"Mie Goreng",price:12000,icon:"🍜"},
 {id:3,name:"Ayam Geprek",price:18000,icon:"🍗"},
 {id:4,name:"Es Teh",price:5000,icon:"🥤"},
 {id:5,name:"Kopi",price:8000,icon:"☕"},
 {id:6,name:"Air Mineral",price:4000,icon:"💧"},
 {id:7,name:"Kentang Goreng",price:10000,icon:"🍟"},
 {id:8,name:"Roti Bakar",price:11000,icon:"🍞"}
];
let cart=[];
let payment="Cash";

const rupiah=n=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);

function renderProducts(list=products){
 document.getElementById("productList").innerHTML=list.map(p=>`
  <div class="product">
   <div class="icon">${p.icon}</div><h3>${p.name}</h3><div class="price">${rupiah(p.price)}</div>
   <button class="add" onclick="addToCart(${p.id})">+ Tambah</button>
  </div>`).join("");
}
function addToCart(id){
 const item=cart.find(x=>x.id===id);
 if(item)item.qty++; else cart.push({...products.find(x=>x.id===id),qty:1});
 renderCart();
}
function changeQty(id,delta){
 const item=cart.find(x=>x.id===id); if(!item)return;
 item.qty+=delta;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);
 renderCart();
}
function clearCart(){cart=[];renderCart();}
function totals(){
 const subtotal=cart.reduce((s,x)=>s+x.price*x.qty,0);
 const percent=Math.min(100,Math.max(0,Number(document.getElementById("discountInput").value)||0));
 const discount=subtotal*percent/100;
 return {subtotal,discount,total:subtotal-discount};
}
function renderCart(){
 const box=document.getElementById("cartList");
 if(!cart.length)box.innerHTML='<div class="empty">Keranjang masih kosong</div>';
 else box.innerHTML=cart.map(x=>`
  <div class="cart-item">
   <div><h4>${x.name}</h4><small>${rupiah(x.price)} × ${x.qty}</small>
    <div class="qty"><button onclick="changeQty(${x.id},-1)">−</button><b>${x.qty}</b><button onclick="changeQty(${x.id},1)">+</button>
    <button class="remove" onclick="changeQty(${x.id},-${x.qty})">Hapus</button></div>
   </div><strong>${rupiah(x.price*x.qty)}</strong>
  </div>`).join("");
 const t=totals();
 document.getElementById("subtotal").textContent=rupiah(t.subtotal);
 document.getElementById("discount").textContent=rupiah(t.discount);
 document.getElementById("total").textContent=rupiah(t.total);
 updateChange();
}
function updateChange(){
 const t=totals(),cash=Number(document.getElementById("cashInput").value)||0;
 document.getElementById("change").textContent=rupiah(Math.max(0,cash-t.total));
}
function checkout(){
 if(!cart.length){alert("Keranjang masih kosong.");return}
 const t=totals(),cash=Number(document.getElementById("cashInput").value)||0;
 if(payment==="Cash" && cash<t.total){alert("Uang yang dibayar belum cukup.");return}
 const paid=payment==="Cash"?cash:t.total, change=payment==="Cash"?cash-t.total:0;
 const now=new Date(), no="TRX-"+Date.now().toString().slice(-6);
 document.getElementById("receiptContent").innerHTML=`
  <h2>QuickKasir</h2><p class="center">Struk Pembelian</p>
  <p class="center">${now.toLocaleString("id-ID")}<br>${no}</p><hr style="margin:12px 0">
  ${cart.map(x=>`<div class="receipt-row"><span>${x.name} × ${x.qty}</span><span>${rupiah(x.price*x.qty)}</span></div>`).join("")}
  <div class="receipt-row"><span>Subtotal</span><span>${rupiah(t.subtotal)}</span></div>
  <div class="receipt-row"><span>Diskon</span><span>${rupiah(t.discount)}</span></div>
  <div class="receipt-row receipt-total"><span>TOTAL</span><span>${rupiah(t.total)}</span></div>
  <div class="receipt-row"><span>Pembayaran</span><span>${payment}</span></div>
  <div class="receipt-row"><span>Dibayar</span><span>${rupiah(paid)}</span></div>
  <div class="receipt-row"><span>Kembalian</span><span>${rupiah(change)}</span></div>
  <p class="center" style="margin-top:16px">Terima kasih sudah berbelanja 😊</p>`;
 document.getElementById("receiptModal").classList.remove("hidden");
}
function closeReceipt(){document.getElementById("receiptModal").classList.add("hidden");clearCart();document.getElementById("cashInput").value="";}
document.getElementById("search").addEventListener("input",e=>{
 const q=e.target.value.toLowerCase();renderProducts(products.filter(p=>p.name.toLowerCase().includes(q)));
});
document.querySelectorAll(".pay").forEach(btn=>btn.addEventListener("click",()=>{
 document.querySelectorAll(".pay").forEach(x=>x.classList.remove("active"));btn.classList.add("active");
 payment=btn.dataset.method;document.getElementById("cashBox").style.display=payment==="Cash"?"block":"none";
}));
setInterval(()=>document.getElementById("clock").textContent=new Date().toLocaleString("id-ID"),1000);
renderProducts();renderCart();

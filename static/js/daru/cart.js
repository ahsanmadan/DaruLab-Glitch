let cartIcon = document.querySelector("#cart-icon");
let cart = document.querySelector(".cart");
let closeCart = document.querySelector("#close-cart");
function hapuslocal() {
  // Menghapus semua item dari Local Storage
  localStorage.clear();

  alert("localstorage telah kosong");
  window.location.reload();
}

cartIcon.onclick = () => {
  cart.classList.add("active");
};

closeCart.onclick = () => {
  cart.classList.remove("active");
};

// if (document.readyState == "loading") {
//   document.addEventListener("DOMContentLoaded", ready);
// } else {
//   ready();
// }

// function ready() {
//   var removeCartButtons = document.getElementsByClassName("cart-remove");
//   console.log(removeCartButtons);
//   for (var i = 0; i < removeCartButtons.length; i++) {
//     var button = removeCartButtons[i];
//     button.addEventListener("click", removeCartItem);
//   }
//   var quantityInputs = document.getElementsByClassName("cart-quantity");
//   for (var i = 0; i < quantityInputs.length; i++) {
//     var input = quantityInputs[i];
//     input.addEventListener("change", quantityChanged);
//   }
//   //add to cart
//   var addCart = document.getElementsByClassName("add-cart");
//   for (var i = 0; i < addCart.length; i++) {
//     var button = addCart[i];
//     button.addEventListener("click", addCartClicked);
//   }
// }

// // remove items from cart
// function removeCartItem(event) {
//   var buttonClicked = event.target;
//   buttonClicked.parentElement.remove();
//   updatetotal();
// }

// // Quantity Changes
// function quantityChanged(event) {
//   var input = event.target;
//   if (isNaN(input.value) || input.value <= 0) {
//     input.value = 1;
//   }
//   updatetotal();
// }
// document.addEventListener("DOMContentLoaded", function () {
//   var addToCartButtons = document.querySelectorAll(".add-to-cart");

//   addToCartButtons.forEach(function (button) {
//     button.addEventListener("click", function () {
//       var title = button.getAttribute("data-title");
//       var price = formatRupiah(parseFloat(button.getAttribute("data-price")));
//       var image = button.getAttribute("data-image");

//       addProductToCart(title, price, image);
//       updatetotal();
//     });
//   });
// });

// function formatRupiah(angka) {
//   var reverse = angka.toString().split("").reverse().join(""),
//     ribuan = reverse.match(/\d{1,3}/g);
//   ribuan = ribuan.join(".").split("").reverse().join("");
//   return "Rp " + ribuan;
// }
// function addProductToCart(title, price, productImg) {
//   var cartContent = document.querySelector(".cart-content");
//   var cartItemNames = cartContent.querySelectorAll(".cart-product-title");

//   // Membuat objek produk yang akan ditambahkan ke keranjang belanja
//   var product = {
//     title: title,
//     price: price,
//     productImg: productImg,
//     quantity: 1,
//   };

//   for (var i = 0; i < cartItemNames.length; i++) {
//     if (cartItemNames[i].innerText === title) {
//       // Jika produk sudah ada, tingkatkan jumlahnya
//       var quantityInput =
//         cartItemNames[i].nextElementSibling.querySelector(".cart-quantity");
//       quantityInput.value = parseInt(quantityInput.value) + 1;
//       updatetotal();
//       updateCartInLocalStorage(); // Update data keranjang di localStorage
//       return;
//     }
//   }

//   var cartShopBox = document.createElement("div");
//   cartShopBox.classList.add("cart-box");
//   var cartItemHTML = `
//     <img src="${product.productImg}" alt="" class="cart-img">
//     <div class="detail-box">
//       <div style="font-size:14px" class="cart-product-title h-100">${product.title}</div>
//       <div class="cart-price mt-auto">${product.price}</div>
//       <input min="0" type="number" value="1" class="cart-quantity">
//     </div>
//     <i class="fa-solid fa-trash cart-remove"></i>
//   `;

//   cartShopBox.innerHTML = cartItemHTML;
//   cartContent.appendChild(cartShopBox);

//   // Simpan produk ke dalam localStorage
//   saveProductToLocalStorage(product);

//   updatetotal();
// }

// function saveProductToLocalStorage(product) {
//   var cart = JSON.parse(localStorage.getItem("cart")) || [];

//   // Cek apakah produk sudah ada di keranjang
//   var existingProduct = cart.find(function (item) {
//     return item.title === product.title;
//   });

//   if (existingProduct) {
//     existingProduct.quantity++;
//   } else {
//     cart.push(product);
//   }

//   localStorage.setItem("cart", JSON.stringify(cart));
// }

// //update total
// function updatetotal() {
//   var cartContent = document.querySelector(".cart-content");
//   var cartBoxes = cartContent.querySelectorAll(".cart-box");
//   var total = 0;

//   for (var i = 0; i < cartBoxes.length; i++) {
//     var cartBox = cartBoxes[i];
//     var priceElement = cartBox.querySelector(".cart-price");
//     var quantityElement = cartBox.querySelector(".cart-quantity");

//     var priceText = priceElement.innerText;
//     var quantity = parseInt(quantityElement.value);

//     // Hapus "Rp" dari harga dan konversi ke angka
//     var price = parseFloat(priceText.replace("Rp", ""));

//     total += price * quantity;
//   }

//   // Simpan total ke dalam localStorage
//   localStorage.setItem("totalPrice", total);

//   var totalElement = document.querySelector(".total-price");
//   totalElement.innerText = "Rp " + total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
// }

// Fungsi untuk menambahkan produk ke keranjang
function tambahKeKeranjang(event) {
  const button = event.target;
  const title = button.getAttribute("data-title");
  const price = button.getAttribute("data-price");
  const image = button.getAttribute("data-image");

  // Ambil data keranjang dari localStorage atau inisialisasi dengan array kosong
  const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

  // Cari apakah produk sudah ada dalam keranjang
  let produkDitemukan = false;
  keranjang.forEach((produk) => {
    if (produk.title === title) {
      produkDitemukan = true;
      // Tingkatkan jumlah produk jika produk sudah ada dalam keranjang
      produk.quantity++;
    }
  });

  // Jika produk tidak ditemukan dalam keranjang, tambahkan sebagai produk baru
  if (!produkDitemukan) {
    const produk = {
      title: title,
      price: price,
      image: image,
      quantity: 1, // Tambahkan quantity awal
    };
    keranjang.push(produk);
  }

  // Simpan keranjang ke localStorage
  localStorage.setItem("keranjang", JSON.stringify(keranjang));

  alert("Produk ditambahkan ke keranjang");
  window.location.reload();
  tampilkanKeranjang();
}

// Tambahkan event listener untuk tombol "Add to Cart"
const buttons = document.querySelectorAll(".add-to-cart");
buttons.forEach((button) => {
  button.addEventListener("click", tambahKeKeranjang);
});

// Ambil data keranjang dari localStorage
const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

// Seleksi elemen "cart-content" untuk menampilkan produk dalam keranjang
const cartContent = document.querySelector(".cart-content");
// Seleksi elemen pesan keranjang kosong
const emptyCartMessage = document.querySelector(".empty-cart-message");
// Jika keranjang kosong, tampilkan pesan keranjang kosong
if (keranjang.length === 0) {
  emptyCartMessage.style.display = "block"; // Menampilkan pesan
} else {
  emptyCartMessage.style.display = "none"; // Menyembunyikan pesan
}
// Seleksi elemen "total-price" untuk menampilkan total harga
const totalPriceElement = document.querySelector(".total-price");

// Iterasi melalui produk dalam keranjang dan menambahkannya ke tampilan HTML
keranjang.forEach((produk) => {
  const cartBox = document.createElement("div");
  cartBox.classList.add("cart-box");

  const img = document.createElement("img");
  img.classList.add("cart-img");
  img.src = produk.image;
  img.alt = "";

  const detailBox = document.createElement("div");
  detailBox.classList.add("detail-box");

  const productTitle = document.createElement("div");
  productTitle.classList.add("cart-product-title");
  productTitle.textContent = produk.title;

  function formatRupiah(angka) {
    var reverse = angka.toString().split("").reverse().join(""),
      ribuan = reverse.match(/\d{1,3}/g);
    ribuan = ribuan.join(".").split("").reverse().join("");
    return "Rp " + ribuan;
  }
  const price = document.createElement("div");
  price.classList.add("cart-price", "my-1");
  price.textContent = formatRupiah(produk.price);

  const quantityInput = document.createElement("input");
  quantityInput.classList.add("cart-quantity");
  quantityInput.value = 1;

  const removeIcon = document.createElement("i");
  removeIcon.classList.add("fa-solid", "fa-trash-can", "cart-remove");
  removeIcon.addEventListener("click", function () {
    // Dapatkan indeks produk yang akan dihapus dari dataset
    const productIndex = quantityInput.dataset.index;

    // Hapus produk dari keranjang berdasarkan indeks
    keranjang.splice(productIndex, 1);

    // Simpan keranjang yang sudah diubah ke localStorage
    localStorage.setItem("keranjang", JSON.stringify(keranjang));

    // Perbarui tampilan keranjang
    tampilkanKeranjang();
    window.location.reload();
  });

  detailBox.appendChild(productTitle);
  detailBox.appendChild(price);
  detailBox.appendChild(quantityInput);

  cartBox.appendChild(img);
  cartBox.appendChild(detailBox);
  cartBox.appendChild(removeIcon);

  cartContent.appendChild(cartBox);
});

// Fungsi untuk menghitung total harga dan menampilkan di "total-price"
function hitungTotalHarga() {
  let totalHarga = 0;
  const quantityInputs = document.querySelectorAll(".cart-quantity");
  const prices = document.querySelectorAll(".cart-price");

  for (let i = 0; i < keranjang.length; i++) {
    const quantity = parseInt(quantityInputs[i].value);
    const price = parseInt(
      prices[i].textContent.replace("Rp ", "").replace(".", "")
    ); // Menghilangkan format harga
    totalHarga += quantity * price;
  }

  // Perbarui elemen "total-price" dengan total harga yang dihitung
  totalPriceElement.textContent = `Rp ${totalHarga.toLocaleString()}`;
}

// Memanggil fungsi hitungTotalHarga untuk menghitung total harga saat halaman dimuat
hitungTotalHarga();
// Dalam fungsi tampilkanKeranjang, setelah membuat elemen "removeIcon" untuk setiap produk:
function tampilkanKeranjang() {
  // Ambil data keranjang dari localStorage
  const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

  // Seleksi elemen "cart-content" untuk menampilkan produk dalam keranjang
  const cartContent = document.querySelector(".cart-content");

  // Hapus semua isi sebelum menampilkan ulang
  while (cartContent.firstChild) {
    cartContent.removeChild(cartContent.firstChild);
  }

  // Seleksi elemen "total-price" untuk menampilkan total harga
  const totalPriceElement = document.querySelector(".total-price");

  // Inisialisasi total harga
  let totalHarga = 0;

  // Iterasi melalui produk dalam keranjang dan menambahkannya ke tampilan HTML
  keranjang.forEach((produk, index) => {
    const cartBox = document.createElement("div");
    cartBox.classList.add("cart-box");

    const img = document.createElement("img");
    cartBox.classList.add("cart-img");
    img.src = produk.image;
    img.alt = "";

    const detailBox = document.createElement("div");
    detailBox.classList.add("detail-box");

    const productTitle = document.createElement("div");
    productTitle.classList.add("cart-product-title");
    productTitle.textContent = produk.title;

    const price = document.createElement("div");
    price.classList.add("cart-price");
    price.textContent = formatRupiah(produk.price);

    const quantityInput = document.createElement("input");

    quantityInput.classList.add("cart-quantity");
    quantityInput.value = produk.quantity;


    const removeIcon = document.createElement("i");
    removeIcon.classList.add("fa-solid", "fa-trash-can", "cart-remove");

    detailBox.appendChild(productTitle);
    detailBox.appendChild(price);
    detailBox.appendChild(quantityInput);

    cartBox.appendChild(img);
    cartBox.appendChild(detailBox);
    cartBox.appendChild(removeIcon);

    cartContent.appendChild(cartBox);

    // Hitung total harga berdasarkan jumlah produk
    totalHarga += produk.price * produk.quantity;
  });

  // Update total harga di tampilan
  totalPriceElement.textContent = `Rp ${totalHarga.toLocaleString()}`;
}

// function hitungTotalHarga(keranjang) {
//   let totalHarga = 0;

//   keranjang.forEach((produk) => {
//     totalHarga += produk.price * produk.quantity;
//   });

//   return totalHarga;
// }

function generateWhatsAppLink() {
  var cartContent = document.querySelector(".cart-content");
  var cartBoxes = cartContent.querySelectorAll(".cart-box");

  // Inisialisasi pesan WhatsApp dengan pesan awal
  var whatsappMessage = "Saya ingin memesan:\n";

  for (var i = 0; i < cartBoxes.length; i++) {
    var cartBox = cartBoxes[i];
    var title = cartBox.querySelector(".cart-product-title").innerText;
    var quantity = cartBox.querySelector(".cart-quantity").value;

    // Tambahkan detail produk dan kuantitas ke dalam pesan WhatsApp
    whatsappMessage += title + " - " + quantity + "\n";
  }

  // Ganti karakter spasi dan karakter khusus dalam pesan WhatsApp
  whatsappMessage = encodeURIComponent(whatsappMessage);

  // Buat tautan WhatsApp dengan pesan yang sudah dibuat
  var whatsappLink =
    "https://api.whatsapp.com/send?phone=6283830896926s&text=" +
    whatsappMessage;
  localStorage.removeItem("keranjang");

  return whatsappLink;
}

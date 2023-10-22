// bagian add user

function sign_up() {
  let username = $("#username-input").val();
  let nama = $("#nama-input").val();
  let pass = $("#pass-input").val();
  console.log(username, nama, pass);
  if ((username, nama, pass == "")) {
    alert("Fill in the blanks");
    return;
  }
  $.ajax({
    type: "POST",
    url: "/save",
    data: {
      username_give: username,
      nama_give: nama,
      password_give: pass,
    },
    success: function (response) {
      if (response["result"] === "success") {
        let token = response["token"];
        $.cookie("mytoken", token, { path: "/" });
        alert("Your are signed up! Nice!");
        window.location.replace("/admin");
      } else {
        alert(response[msg]);
      }
    },
  });
}
function save_user() {
  let username = $("#username-input").val();
  let nama = $("#nama-input").val();
  let pass = $("#pass-input").val();
  console.log(username, nama, pass);
  if ((username, nama, pass == "")) {
    alert("Fill in the blanks");
    return;
  }
  $.ajax({
    type: "POST",
    url: "/save",
    data: {
      username_give: username,
      nama_give: nama,
      password_give: pass,
    },
    success: function (response) {
      if (response["result"] === "success") {
        window.location.replace("/admin/user");
        alert("user added successfully");
      } else {
        alert("user was not successfully added");
      }
    },
  });
}
// bagian login
function sign_in() {
  let username = $("#log-username").val();
  let password = $("#log-pw").val();
  $.ajax({
    type: "POST",
    url: "/sign_in",
    data: {
      username_give: username,
      password_give: password,
    },
    success: function (response) {
      if (response["result"] === "success") {
        let token = response["token"];
        $.cookie("mytoken", token, { path: "/" });
        alert("Login Sucessful!");
        window.location.href = "/admin";
      } else {
        alert(response["msg"]);
      }
    },
  });
}
function sign_out() {
  $.removeCookie("mytoken", { path: "/" });
  alert("Signed out!");
  window.location.href = "/logout";
}

// function listUsers() {
//   $.ajax({
//     type: "GET",
//     url: "/getUsers",
//     data: {},
//     success: function (response) {
//       let userRows = response["users"];
//       for (let i = 0; i < userRows.length; i++) {
//         let username = userRows[i]["username"];
//         let nama = userRows[i]["nama_lengkap"];

//         let temp_html = `
//         <tr>
//         <td>
//           <label class="users-table__checkbox">
//             <input type="checkbox" class="check" />
//             ${username}
//           </label>
//         </td>
//         <td>${nama}</td>
//         <td>
//           <span class="p-relative">
//           <a href=""><i class="fa-solid fa-ellipsis" style="color: #b9b9b9;"></i></a>
//             <ul class="users-item-dropdown dropdown">
//               <li><a href="##">Edit</a></li>
//               <li><a href="##">Delete</a></li>
//             </ul>
//           </span>
//         </td>
//       </tr>
//                   `;
//         $("#tableUsers").append(temp_html);
//       }
//     },
//   });
// }

function deleteUser() {
  $.ajax({
    type: "GET",
    url: "/deleteUser",
    data: {},
    success: function (response) {
      if (response["result"] === "success") {
        alert("User data successfully deleted");
        window.location.href = "/admin/user";
      } else {
        alert(response["something wrong"]);
      }
    },
  });
}

function save_product() {
  let pname = $("#pname-input").val().trim();
  let ppic = $("#ppic-input").prop("files")[0];
  let price = $("#price-input").val();
  let desc = $("#desc-input").val();
  if (!pname || !ppic || !price) {
    alert("Fill in the blanks!");
    return;
  }

  // Validasi tipe file (hanya menerima gambar)
  if (!ppic.type.startsWith("image/") || ppic.type === "image/gif") {
    alert("Files allowed are only of the image type!");
    return;
  }

  // Validasi kapasitas gambar (maksimum  megabyte)
  if (ppic.size > 2 * 1024 * 1024) {
    alert("image size exceeds the limit(Max 2 MB)");
    return;
  }

  let image = new Image();
  image.src = URL.createObjectURL(ppic);
  image.onload = function () {
    // Validasi ukuran width dan height
    if (image.width >= 500 && image.height >= 400) {
      // Gambar memenuhi syarat, lanjutkan dengan pengiriman data
      let form_data = new FormData();
      form_data.append("pname_give", pname);
      form_data.append("ppic_give", ppic);
      form_data.append("price_give", price);
      form_data.append("desc_give", desc);

      $.ajax({
        type: "POST",
        url: "/save_product",
        data: form_data,
        contentType: false,
        processData: false,
        success: function (response) {
          alert(response["msg"]);
          window.location.reload();
        },
      });
    } else {
      alert("Width size must exceed 500px and height size must exceed 400px");
    }
  };
}

// bagian delete produk
function deleteProduk(id) {
  var result = confirm("Apakah anda yakin ingin menghapus produk ini?");
  if (result) {
    $.ajax({
      type: "POST",
      url: "/deleteProduk",
      data: { id_give: id },
      success: function (response) {
        alert(response["msg"]);
        window.location.reload();
      },
    });
  }
}
function removeDecimalPoint(numString) {
  // Menghapus titik (.)
  return numString.replace(/\./g, "");
}
function editProduk(id) {
  $.ajax({
    type: "GET",
    url: `/admin/fill-edit/${id}`,
    success: function (response) {
      if (response.result === "success") {
        let post = response.post;
        $("#pname-edit").val(post.pname);
        $("#desc-edit").val(post.desc);
        $("#price-edit").val(removeDecimalPoint(post.price));

        // Set nomor posting pada tombol "Simpan Perubahan"
        $("#editProduk-button").attr("onclick", `prosesEdit(${id})`);
      } else {
        alert(response.msg);
      }
    },
  });
}
function prosesEdit(id) {
  let name = $("#pname-edit").val();
  let desc = $("#desc-edit").val();
  let price = $("#price-edit").val();
  let newPpic = $("#ppic-edit")[0].files[0];
  console.log(name, desc, price);
  let formData = new FormData();
  formData.append("pname-give", name);
  formData.append("desc-give", desc);
  formData.append("price-give", price);

  if (newPpic) {
    formData.append("ppic-give", newPpic);
  }

  $.ajax({
    type: "POST",
    url: `/admin/prosesEdit/${id}`,
    data: formData,
    contentType: false,
    processData: false,
    success: function (response) {
      if (response.result === "success") {
        window.location.reload();
      } else {
        alert(response.msg);
      }
    },
  });
}

function produkDetail(folder) {
  $.ajax({
    type: "GET",
    url: `/produk/${folder}`,
    success: function (response) {},
  });
}
function addEllipsis() {
  const elements = document.getElementsByClassName("ellipsis-text");
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const max_length = 70;
    if (element.textContent.length > max_length) {
      element.textContent =
        element.textContent.substring(0, max_length) + "...";
    }
  }
}

// Panggil fungsi addEllipsis saat halaman dimuat
window.onload = addEllipsis;
// fungsi mengambil list cara penggunaan detail produk
function tambahCaraPemakaian() {
  var inputElement = document.getElementById("inputCaraPemakaian");
  var inputText = inputElement.value.trim();

  if (inputText !== "") {
    var list = document.getElementById("caraPemakaian");
    var newItem = document.createElement("li");
    newItem.textContent = inputText;
    list.appendChild(newItem);

    // Bersihkan teks di dalam textarea
    inputElement.value = "";
  }
}
function convertListToJson() {
  const ulElement = document.getElementById("caraPemakaian");
  const liElements = ulElement.querySelectorAll("li");
  const dataArray = [];

  liElements.forEach((li) => {
    dataArray.push(li.textContent.trim());
  });

  return JSON.stringify({ daftarCaraPemakaian: dataArray });
}
function tambahDetailProduk() {
  let urlParams = new URLSearchParams(window.location.search);
  let id = urlParams.get("id");
  let pic1 = $("#detail-pic1-input").prop("files")[0];
  let judul = $("#detail-judul-input").val();
  let detaildesc = $("#detail-desc-input").val();
  let pic2 = $("#detail-pic2-input").prop("files")[0];

  if (!pic1 || !judul || !detaildesc || !pic2) {
    alert("Fill in the blanks!");
    return;
  }

  if (
    !pic1.type.startsWith("image/") &&
    pic1.type !== "image/gif" &&
    !pic2.type.startsWith("image/") &&
    pic2.type !== "image/gif"
  ) {
    alert("Hanya gambar yang di perbolehkan");
    return;
  }

  if (pic1.size > 2 * 1024 * 1024 || pic2.size > 2 * 1024 * 1024) {
    alert("Ukuran gambar melebihi batas (Maksimal 2 MB)");
    return;
  }

  let image1 = new Image();
  image1.src = URL.createObjectURL(pic1);
  image1.onload = function () {
    if (image1.width < 700 || image1.height < 700) {
      alert("Ukuran gambar pertama harus minimal 700x700");
      return;
    }

    let image2 = new Image();
    image2.src = URL.createObjectURL(pic2);
    image2.onload = function () {
      if (image2.width < 420 || image2.height < 420) {
        alert("Ukuran gambar kedua harus minimal 420x420");
        return;
      }

      let form_data = new FormData();
      form_data.append("judul_give", judul);
      form_data.append("pic1_give", pic1);
      form_data.append("pic2_give", pic2);
      form_data.append("desc_give", detaildesc);
      form_data.append("id_give", id);
      form_data.append("jsonData", convertListToJson());

      $.ajax({
        url: "/tambahDetailProduk",
        type: "POST",
        contentType: false,
        processData: false,
        data: form_data,
        success: function (response) {
          alert(response.msg);
          window.location.reload();
        },
        error: function (error) {
          alert("Terjadi kesalahan: " + error);
          console.error("Terjadi kesalahan:", error);
        },
      });
    };
  };
}

function produk_detail(folder) {
  $.ajax({
    type: "GET",
    url: `/produk/${folder}`,
    success: function (response) {},
  });
}

function addComment() {
  const url = window.location.href;
  const urlObj = new URL(url);
  const id = urlObj.searchParams.get("id");
  const rating = $('input[name="rate"]:checked').val();
  let nama = $("#nama-pengulas").val();
  let head = $("#singkat").val();
  let isi = $("#ulasan").val();
  const date = new Date();

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); 
  const day = date.getDate().toString().padStart(2, "0"); 
  const hours = date.getHours().toString().padStart(2, "0"); 
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  const formatDate = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  console.log(id, nama, head, rating, isi, formatDate);
  if ((rating, head, nama, isi == "")) {
    alert("Fill in the blanks");
    return;
  }
  let form_data = new FormData();
  form_data.append("rating_give", rating);
  form_data.append("id_give", id);
  form_data.append("nama_give", nama);
  form_data.append("head_give", head);
  form_data.append("isi_give", isi);
  form_data.append("date_give", formatDate);

  $.ajax({
    url: "/tambahkomen",
    type: "POST",
    contentType: false,
    processData: false,
    data: form_data,
    success: function (response) {
      alert(response.msg);
      window.location.reload();
    },
    error: function (error) {
      alert("Terjadi kesalahan: " + error);
      console.error("Terjadi kesalahan:", error);
    },
  });
}



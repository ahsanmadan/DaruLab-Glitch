// Mendapatkan URL halaman saat ini
var currentURL = window.location.pathname;

// Menghilangkan tanda slash (/) pertama jika ada
if (currentURL.charAt(0) === "/") {
  currentURL = currentURL.slice(1);
}

// Mencari elemen tautan yang sesuai dengan URL saat ini

var activeLink = document.getElementById(currentURL + "-link");

// Menambahkan kelas "active" ke tautan yang sesuai
if (activeLink) {
  activeLink.classList.add("active");
}



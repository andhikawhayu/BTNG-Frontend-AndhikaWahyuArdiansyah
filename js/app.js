var API_URL = "https://mobileapi.smkn1ciomas.sch.id/api/mobil";

var gambarMobilLokal = {
  61: "img/byd-seal.png", 60: "img/fortuner.png", 59: "img/crv.png",
  58: "img/rocky.png",   57: "img/mazda3.png",   56: "img/byd-seal.png",
  55: "img/jimny.png",   54: "img/innova-zenix.png", 53: "img/ioniq5.png",
  52: "img/fortuner.png", 51: "img/civic.png",   50: "img/avanza.png"
};

var dataMobilCadangan = [
  { id: 61, nama: "BYD Seal Performance AWD",              brand: "BYD",        harga: 719000000, tahun: 2024, transmisi: "Matic",  bahan_bakar: "Listrik", status: "tersedia", foto: "img/byd-seal.png" },
  { id: 60, nama: "Toyota Fortuner 2.8 GR Sport 4x4",     brand: "Toyota",     harga: 735000000, tahun: 2023, transmisi: "Matic",  bahan_bakar: "Diesel",  status: "tersedia", foto: "img/fortuner.png" },
  { id: 59, nama: "Honda CR-V 2.0 e:HEV RS",              brand: "Honda",      harga: 805000000, tahun: 2024, transmisi: "CVT",    bahan_bakar: "Hybrid",  status: "sold",      foto: "img/crv.png" },
  { id: 58, nama: "Daihatsu Rocky 1.0 R Turbo CVT",       brand: "Daihatsu",   harga: 245000000, tahun: 2023, transmisi: "CVT",    bahan_bakar: "Bensin",  status: "tersedia", foto: "img/rocky.png" },
  { id: 57, nama: "Mazda 3 Hatchback 2.0 SKYACTIV-G",     brand: "Mazda",      harga: 555000000, tahun: 2022, transmisi: "Matic",  bahan_bakar: "Bensin",  status: "tersedia", foto: "img/mazda3.png" },
  { id: 56, nama: "Wuling Air EV Long Range",              brand: "Wuling",     harga: 275000000, tahun: 2023, transmisi: "Matic",  bahan_bakar: "Listrik", status: "sold",      foto: "img/byd-seal.png" },
  { id: 55, nama: "Suzuki Jimny 1.5 4x4 MT",              brand: "Suzuki",     harga: 445000000, tahun: 2023, transmisi: "Manual", bahan_bakar: "Bensin",  status: "tersedia", foto: "img/jimny.png" },
  { id: 54, nama: "Toyota Kijang Innova Zenix Hybrid 2.0 V", brand: "Toyota",  harga: 542000000, tahun: 2024, transmisi: "CVT",    bahan_bakar: "Hybrid",  status: "tersedia", foto: "img/innova-zenix.png" },
  { id: 53, nama: "Hyundai Ioniq 5 Signature Long Range",  brand: "Hyundai",    harga: 895000000, tahun: 2024, transmisi: "Matic",  bahan_bakar: "Listrik", status: "tersedia", foto: "img/ioniq5.png" },
  { id: 52, nama: "Mitsubishi Pajero Sport Dakar 4x2",     brand: "Mitsubishi", harga: 635000000, tahun: 2023, transmisi: "Matic",  bahan_bakar: "Diesel",  status: "tersedia", foto: "img/fortuner.png" },
  { id: 51, nama: "Honda Civic RS Turbo",                  brand: "Honda",      harga: 616000000, tahun: 2023, transmisi: "CVT",    bahan_bakar: "Bensin",  status: "tersedia", foto: "img/civic.png" },
  { id: 50, nama: "Toyota Avanza 1.5 G CVT",              brand: "Toyota",     harga: 275000000, tahun: 2024, transmisi: "CVT",    bahan_bakar: "Bensin",  status: "tersedia", foto: "img/avanza.png" }
];

var koleksiMobil = [];
var filterKategoriAktif = "semua";
var pencarianKataKunci = "";
var elemenFokusTerakhir = null;

function formatRupiah(nilai) {
  if (!nilai || isNaN(nilai)) return "Rp 0";
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(nilai);
}

function cariGambarMobilPNG(item) {
  if (item && item.id && gambarMobilLokal[item.id]) return gambarMobilLokal[item.id];
  var nama  = (item && item.nama  ? item.nama  : "").toLowerCase();
  var brand = (item && item.brand ? item.brand : "").toLowerCase();
  if (nama.includes("seal")   || brand.includes("byd"))    return "img/byd-seal.png";
  if (nama.includes("fortuner") || nama.includes("pajero")) return "img/fortuner.png";
  if (nama.includes("cr-v")   || nama.includes("crv"))     return "img/crv.png";
  if (nama.includes("rocky"))                               return "img/rocky.png";
  if (nama.includes("mazda"))                               return "img/mazda3.png";
  if (nama.includes("jimny"))                               return "img/jimny.png";
  if (nama.includes("zenix")  || nama.includes("innova"))  return "img/innova-zenix.png";
  if (nama.includes("ioniq"))                               return "img/ioniq5.png";
  if (nama.includes("civic"))                               return "img/civic.png";
  if (nama.includes("avanza"))                              return "img/avanza.png";
  return "img/byd-seal.png";
}

function muatDataMobil() {
  var countInfo = document.getElementById("carCountInfo");
  if (countInfo) countInfo.textContent = "Memuat koleksi kendaraan MyMobil...";

  fetch(API_URL)
    .then(function(r) { if (!r.ok) throw new Error(); return r.json(); })
    .then(function(res) {
      if (res && Array.isArray(res.data) && res.data.length > 0) {
        koleksiMobil = res.data.map(function(item) {
          return Object.assign({}, item, { foto: cariGambarMobilPNG(item) });
        });
      } else throw new Error();
      if (countInfo) countInfo.textContent = "Menampilkan " + koleksiMobil.length + " unit kendaraan siap kirim";
      jalankanFilterDanTampilan();
    })
    .catch(function() {
      koleksiMobil = dataMobilCadangan;
      if (countInfo) countInfo.textContent = "Menampilkan " + koleksiMobil.length + " unit kendaraan siap kirim";
      jalankanFilterDanTampilan();
    });
}

function buatEl(tag, props) {
  var el = document.createElement(tag);
  Object.assign(el, props);
  return el;
}

function renderKoleksiMobil(daftar) {
  var grid = document.getElementById("carGrid");
  if (!grid) return;
  grid.innerHTML = "";

  if (!daftar || daftar.length === 0) {
    var empty = buatEl("div", { className: "empty-state", textContent: "Tidak ada unit kendaraan yang sesuai dengan kriteria pencarian." });
    grid.appendChild(empty);
    return;
  }

  daftar.forEach(function(mobil) {
    var img = buatEl("img", { src: mobil.foto, alt: mobil.nama, className: "car-img-api", loading: "lazy", width: 400, height: 220 });
    img.onerror = function() { this.onerror = null; this.src = "img/byd-seal.png"; };

    var visualDiv = buatEl("div", { className: "car-card-visual" });
    visualDiv.appendChild(img);

    var brandSpan = buatEl("span", { className: "car-badge-brand", textContent: mobil.brand });
    var yearSpan  = buatEl("span", { className: "car-badge-year",  textContent: mobil.tahun });
    var metaTop   = buatEl("div",  { className: "car-meta-top" });
    metaTop.append(brandSpan, yearSpan);

    var h3       = buatEl("h3",  { className: "car-title car-model-title", textContent: mobil.nama });
    var specMini = buatEl("div", { className: "car-spec-mini", textContent: mobil.tahun + " · " + mobil.transmisi + " · " + mobil.bahan_bakar });
    var priceRow = buatEl("div", { className: "car-price-row" });
    priceRow.innerHTML = "Harga: <span class='car-price-val'>" + formatRupiah(mobil.harga) + "</span>";

    var btnDetail = buatEl("button", { type: "button", className: "btn-card-detail", textContent: "Detail Lengkap" });
    btnDetail.addEventListener("click", (function(m) { return function() { tampilkanModalDetail(m); }; })(mobil));

    var btnQuote = buatEl("button", { type: "button", className: "btn-card-quote", textContent: "Get Quote" });
    btnQuote.addEventListener("click", (function(n, h) { return function() { hubungiWhatsAppQuote(n, formatRupiah(h)); }; })(mobil.nama, mobil.harga));

    var actionsDiv = buatEl("div", { className: "car-card-actions" });
    actionsDiv.append(btnDetail, btnQuote);

    var bodyDiv = buatEl("div", { className: "car-card-body" });
    bodyDiv.append(metaTop, h3, specMini, priceRow, actionsDiv);

    var card = buatEl("article", { className: "car-card" });
    card.setAttribute("role", "listitem");
    card.setAttribute("aria-label", mobil.nama + ", brand " + mobil.brand + ", harga " + formatRupiah(mobil.harga));
    card.append(visualDiv, bodyDiv);

    grid.appendChild(card);
  });
}

function jalankanFilterDanTampilan() {
  var terfilter = koleksiMobil.filter(function(mobil) {
    var lolosKategori = filterKategoriAktif === "semua" ||
      (mobil.bahan_bakar && mobil.bahan_bakar.toLowerCase() === filterKategoriAktif.toLowerCase());
    var lolosPencarian = pencarianKataKunci.trim() === "" ||
      (mobil.nama  && mobil.nama.toLowerCase().includes(pencarianKataKunci.toLowerCase())) ||
      (mobil.brand && mobil.brand.toLowerCase().includes(pencarianKataKunci.toLowerCase()));
    return lolosKategori && lolosPencarian;
  });
  renderKoleksiMobil(terfilter);
}

function filterKategori(kategori, evt) {
  filterKategoriAktif = kategori;
  document.querySelectorAll(".tab-pill").forEach(function(t) {
    t.classList.remove("active");
    t.setAttribute("aria-selected", "false");
  });
  if (evt && evt.target) {
    evt.target.classList.add("active");
    evt.target.setAttribute("aria-selected", "true");
  }
  jalankanFilterDanTampilan();
}

function cariMobil(teks) {
  pencarianKataKunci = teks;
  jalankanFilterDanTampilan();
}

function tampilkanModalDetail(mobil) {
  elemenFokusTerakhir = document.activeElement;
  document.getElementById("modalBrand").textContent   = mobil.brand.toUpperCase();
  document.getElementById("modalNama").textContent    = mobil.nama;
  document.getElementById("modalHarga").textContent   = "Harga OTR: " + formatRupiah(mobil.harga);
  document.getElementById("modalTahun").textContent   = mobil.tahun;
  document.getElementById("modalTransmisi").textContent = mobil.transmisi;
  document.getElementById("modalBahan").textContent   = mobil.bahan_bakar;
  document.getElementById("modalStatus").textContent  = "Garansi Resmi & Siap Jalan";

  var modalImg = document.getElementById("modalImg");
  if (modalImg) {
    modalImg.src = mobil.foto;
    modalImg.alt = mobil.nama;
    modalImg.onerror = function() { this.onerror = null; this.src = "img/byd-seal.png"; };
  }

  var pesan = "Halo MyMobil, saya ingin berkonsultasi mengenai unit " + mobil.nama + " (" + formatRupiah(mobil.harga) + "). Mohon informasi ketersediaan inspeksi dan jadwal uji kemudi.";
  document.getElementById("modalWA").href = "https://wa.me/6281234567890?text=" + encodeURIComponent(pesan);

  var modal = document.getElementById("modalOverlay");
  if (modal) {
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    var closeBtn = modal.querySelector(".modal-close");
    if (closeBtn) closeBtn.focus();
  }
}

function tutupModal() {
  var modal = document.getElementById("modalOverlay");
  if (modal) { modal.classList.remove("show"); modal.setAttribute("aria-hidden", "true"); }
  if (elemenFokusTerakhir) elemenFokusTerakhir.focus();
}

function hubungiWhatsAppQuote(nama, hargaStr) {
  var pesan = "Halo MyMobil, saya ingin meminta rincian penawaran resmi (Get Quote) untuk model " + nama + " seharga " + hargaStr + ". Terima kasih.";
  window.open("https://wa.me/6281234567890?text=" + encodeURIComponent(pesan), "_blank");
}

function mintaBrosur() {
  var namaUnit = document.getElementById("modalNama").textContent || "unit pilihan";
  var pesan = "Halo MyMobil, mohon dikirimkan e-brochure lengkap serta skema simulasi angsuran untuk " + namaUnit + ".";
  window.open("https://wa.me/6281234567890?text=" + encodeURIComponent(pesan), "_blank");
}

function toggleMenu() {
  var nav = document.getElementById("mobileNav");
  var btn = document.getElementById("menuToggleBtn");
  if (!nav) return;
  var isOpen = nav.classList.toggle("show");
  if (btn) btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  if (isOpen) { var fl = nav.querySelector("a"); if (fl) fl.focus(); }
  else if (btn) btn.focus();
}

document.addEventListener("keydown", function(e) {
  if (e.key === "Escape" || e.keyCode === 27) {
    tutupModal();
    var nav = document.getElementById("mobileNav");
    if (nav && nav.classList.contains("show")) toggleMenu();
  }
});

var overlayEl = document.getElementById("modalOverlay");
if (overlayEl) {
  overlayEl.addEventListener("click", function(e) { if (e.target === overlayEl) tutupModal(); });
}

document.addEventListener("DOMContentLoaded", muatDataMobil);

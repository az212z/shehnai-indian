/* شهناي — Shehnai Indian Restaurant · interactions
   Vanilla, guarded, accessible. */
(function () {
  "use strict";

  var WA = "966531914513"; // WhatsApp intl
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Sticky nav shrink ---------- */
  var header = $(".site-header");
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 24) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Full-screen mobile menu ---------- */
  var burger = $(".burger");
  var menu = $(".mobile-menu");
  var mmClose = $(".mm-close");
  function openMenu() {
    if (!menu) return;
    menu.classList.add("open");
    menu.setAttribute("aria-hidden", "false");
    if (burger) burger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    if (mmClose) mmClose.focus();
  }
  function closeMenu() {
    if (!menu) return;
    menu.classList.remove("open");
    menu.setAttribute("aria-hidden", "true");
    if (burger) { burger.setAttribute("aria-expanded", "false"); burger.focus(); }
    document.body.style.overflow = "";
  }
  if (burger) burger.addEventListener("click", openMenu);
  if (mmClose) mmClose.addEventListener("click", closeMenu);
  if (menu) $$(".mm-links a", menu).forEach(function (a) { a.addEventListener("click", closeMenu); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { if (menu && menu.classList.contains("open")) closeMenu(); closeLightbox(); }
  });

  /* ---------- Spice particles (build inline so no extra DOM markup) ---------- */
  var pBox = $(".particles");
  if (pBox) {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var count = reduce ? 10 : 22;
    for (var i = 0; i < count; i++) {
      var s = document.createElement("span");
      s.className = "spice";
      var size = 4 + Math.random() * 6;
      s.style.left = (Math.random() * 100) + "%";
      s.style.width = s.style.height = size.toFixed(1) + "px";
      s.style.setProperty("--dur", (8 + Math.random() * 8).toFixed(1) + "s");
      s.style.setProperty("--delay", (Math.random() * 9).toFixed(1) + "s");
      s.style.setProperty("--drift", (Math.random() * 80 - 40).toFixed(0) + "px");
      if (reduce) { s.style.bottom = (Math.random() * 90 + 5) + "%"; }
      pBox.appendChild(s);
    }
  }

  /* ---------- Scroll reveal (IntersectionObserver + fallback) ---------- */
  var reveals = $$(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }
  // safety: ensure visibility after 1.4s no matter what
  setTimeout(function () { reveals.forEach(function (el) { el.classList.add("in"); }); }, 1400);

  /* ---------- Lightbox-lite ---------- */
  var lb = $(".lightbox"), lbImg = $(".lightbox img"), lbClose = $(".lightbox-close");
  function openLightbox(src, alt) {
    if (!lb || !lbImg) return;
    lbImg.src = src; lbImg.alt = alt || "";
    lb.classList.add("open"); lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (lbClose) lbClose.focus();
  }
  function closeLightbox() {
    if (!lb) return;
    lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  $$("[data-zoom]").forEach(function (fig) {
    var img = $("img", fig);
    fig.addEventListener("click", function () { if (img) openLightbox(img.src, img.alt); });
    fig.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (img) openLightbox(img.src, img.alt); }
    });
  });
  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  if (lb) lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });

  /* ---------- Toast ---------- */
  var toast = $(".toast"), toastMsg = $(".toast .msg"), toastTimer = null;
  function showToast(msg) {
    if (!toast) return;
    if (toastMsg) toastMsg.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 4500);
  }

  /* ---------- Reservation form ---------- */
  var form = $("#reserve-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      function fail(name, m) {
        var f = form.querySelector('[name="' + name + '"]');
        var box = f ? f.closest(".field") : null;
        var err = box ? $(".err", box) : null;
        if (err) err.textContent = m || "";
        if (m) ok = false;
      }
      var name = form.name_field.value.trim();
      var phone = form.phone.value.trim();
      var guests = form.guests.value;
      var date = form.date.value;
      fail("name_field", name ? "" : "فضلاً اكتب الاسم");
      fail("phone", /^0?5\d{8}$/.test(phone.replace(/\s/g, "")) ? "" : "أدخل رقم جوال سعودي صحيح");
      fail("guests", guests ? "" : "اختر عدد الضيوف");
      fail("date", date ? "" : "اختر التاريخ");
      if (!ok) {
        var firstErr = form.querySelector(".err:not(:empty)");
        if (firstErr) { var inp = $("input,select,textarea", firstErr.closest(".field")); if (inp) inp.focus(); }
        return;
      }

      var time = form.time.value;
      var notes = form.notes.value.trim();

      var btn = $(".btn-submit", form);
      var orig = btn ? btn.innerHTML : "";
      if (btn) { btn.setAttribute("aria-busy", "true"); btn.innerHTML = '<span class="spinner" aria-hidden="true"></span> جاري الإرسال…'; }

      // localStorage demo
      try {
        var store = JSON.parse(localStorage.getItem("shehnai_reservations") || "[]");
        store.push({ name: name, phone: phone, guests: guests, date: date, time: time, notes: notes, at: new Date().toISOString() });
        localStorage.setItem("shehnai_reservations", JSON.stringify(store));
      } catch (err) {}

      var msg =
        "السلام عليكم، أرغب بحجز طاولة في مطعم شهناي 🌿%0A" +
        "الاسم: " + encodeURIComponent(name) + "%0A" +
        "الجوال: " + encodeURIComponent(phone) + "%0A" +
        "عدد الضيوف: " + encodeURIComponent(guests) + "%0A" +
        "التاريخ: " + encodeURIComponent(date) + (time ? "%0Aالوقت: " + encodeURIComponent(time) : "") +
        (notes ? "%0Aملاحظات: " + encodeURIComponent(notes) : "");

      setTimeout(function () {
        if (btn) { btn.removeAttribute("aria-busy"); btn.innerHTML = orig; }
        showToast("تم تجهيز طلبك — جاري فتح واتساب لإتمام الحجز ✓");
        window.open("https://wa.me/" + WA + "?text=" + msg, "_blank", "noopener");
        form.reset();
      }, 850);
    });
  }

  /* ---------- Footer year ---------- */
  var yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();
})();

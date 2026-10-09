(function () {
  var d = document, r = d.documentElement;

  /* ===== ۱) انیمیشن ورود =====
     بعد از بارگذاری کامل صفحه (حداقل ۱.۴ ثانیه برای دیده شدن انیمیشن) مخفی
     و سپس کاملاً حذف می‌شود تا انیمیشنش در پس‌زمینه اجرا نشود */
  var t0 = Date.now(), done = false;
  function hide() {
    if (done) return; done = true;
    setTimeout(function () {
      var p = d.getElementById('pre');
      if (!p) return;
      p.classList.add('off');
      setTimeout(function () { p.remove(); }, 700);
    }, Math.max(0, 1400 - (Date.now() - t0)));
  }
  if (d.readyState === 'complete') hide(); else addEventListener('load', hide);
  setTimeout(hide, 6000); // اگر اینترنت کند بود، بعد از ۶ ثانیه حتماً مخفی شود

  /* ===== ۲) دکمه حالت روشن / تیره =====
     انتخاب کاربر در مرورگر ذخیره می‌شود */
  d.getElementById('th').onclick = function () {
    var n = r.dataset.theme === 'dark' ? 'light' : 'dark';
    r.dataset.theme = n;
    try { localStorage.setItem('theme', n); } catch (e) {}
  };

  /* ===== ۳) منوی موبایل =====
     باز و بسته شدن منو؛ با کلیک روی هر لینک بسته می‌شود */
  var nav = d.getElementById('nav');
  d.getElementById('mb').onclick = function () { nav.classList.toggle('open'); };
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') nav.classList.remove('open');
  });

  /* ===== ۴) اطلاعات گالری =====
     هر مورد: ['عنوان', 'توضیح', 'آدرس عکس']
     - عکس‌ها را در پوشه images کنار index.html بگذارید
     - اگر آدرس عکس را خالی بگذارید ('')، آیکون پیش‌فرض نمایش داده می‌شود
     - برای افزودن مورد جدید یک خط به آرایه اضافه کنید
     - پیشنهاد: نام عکس‌ها انگلیسی، کوچک و بدون فاصله باشد (مثلاً inside-view.webp) */
  var icon = '<svg viewBox="0 0 24 24"><path d="M20 5H4v14l9.3-9.3a1 1 0 0 1 1.4 0L20 15V5ZM2 4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4Zm6 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"/></svg>';
  var items = [
    ['کارگاه کامپیوتر', 'محل آموزش شبکه، برنامه‌نویسی و طراحی سایت.', 'computer/c1.webp'],
    ['کارگاه مکانیک', 'ماشین‌کاری، جوشکاری و ساخت قطعات صنعتی.', 'mechanic/m3.webp'],
    ['کارگاه برق', 'آموزش سیم‌کشی، تابلو برق و مدارهای الکترونیکی.', 'barghe/b3.webp'],
    ['فضای مدرسه', 'نمایی از حیاط و محیط آموزشی هنرستان.', 'images/insideschool.webp'],
    ['امکانات ورزشی', 'زمین ورزشی چمن مصنوعی', 'sports/sp1.webp'],
    ['افتخارات', 'دستاوردهای هنرجویان در مسابقات و جشنواره‌ها.', 'images/jum.webp']
  ];

  /* ===== ۵) ساخت کارت‌های گالری ===== */
  var g = d.getElementById('grid');
  if (g) { // فقط در صفحه اصلی (صفحه‌های کارگاه گالری ندارند)
  g.innerHTML = items.map(function (i) {
    // اگر عکس داشت عکس، وگرنه آیکون نمایش داده می‌شود
    var pic = i[2]
      ? '<img src="' + i[2] + '" alt="' + i[0] + '" loading="lazy" decoding="async" draggable="false">'
      : icon;
    return '<div class="card rv" tabindex="0">' + pic +
      '<div class="card__content"><p class="card__title">' + i[0] +
      '</p><p class="card__description">' + i[1] + '</p></div></div>';
  }).join('');

  /* ===== ۶) باز شدن کارت با لمس (برای موبایل) =====
     هر بار فقط یک کارت باز می‌ماند */
  g.addEventListener('click', function (e) {
    var c = e.target.closest('.card');
    if (!c) return;
    var wasOpen = c.classList.contains('open');
    [].forEach.call(g.children, function (x) { x.classList.remove('open'); });
    if (!wasOpen) c.classList.add('open');
  });
  }

  /* ===== ۷) انیمیشن ظاهر شدن بخش‌ها هنگام اسکرول ===== */
  var rv = d.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    rv.forEach(function (x) { io.observe(x); });
  } else {
    rv.forEach(function (x) { x.classList.add('in'); }); // مرورگرهای قدیمی
  }

  /* ===== ۸) جلوگیری از کلیک راست، کشیدن و انتخاب متن ===== */
  ['contextmenu', 'dragstart', 'selectstart'].forEach(function (n) {
    d.addEventListener(n, function (e) { e.preventDefault(); });
  });
})();
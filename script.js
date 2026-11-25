/* ============================================================
   مطعم الشعلة - script.js
   وظائف: القائمة، البحث، الفلاتر، الظهور، أزرار الواتساب
   ============================================================ */

// ===== عناصر الواجهة الرئيسية =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const siteHeader = document.getElementById('siteHeader');
const backToTop = document.getElementById('backToTop');
const searchInput = document.getElementById('menuSearch');
const categoryBtns = document.querySelectorAll('.category-btn');
const menuCards = document.querySelectorAll('.menu-card');
const emptyState = document.getElementById('emptyState');
const yearEl = document.getElementById('year');

// ===== فتح / إغلاق القائمة في الموبايل =====
function closeNav() {
  navToggle.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  navMenu.classList.remove('open');
}

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // إغلاق القائمة بعد الضغط على أي رابط داخلي
  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });
}

// ===== تنسيق وتأثيرات الظهور عند التمرير (Scroll Reveal) =====
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// ===== تنسيق الشريط عند التمرير + ظهور زر العودة للأعلى =====
const handleScroll = () => {
  if (siteHeader) siteHeader.classList.toggle('scrolled', window.scrollY > 20);
  if (backToTop) backToTop.classList.toggle('show', window.scrollY > 400);
};
window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== تحديد التصنيف المطلوب عند الضغط على زر تصفية المنيو =====
categoryBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    categoryBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const category = btn.dataset.category;
    menuCards.forEach((card) => {
      const matches = category === 'all' || card.dataset.category === category;
      card.style.display = matches ? '' : 'none';
    });
  });
});

// ===== البحث داخل المنيو (بحث ذكي مع تأخير بسيط) =====
let searchTimer;
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => performSearch(e.target.value.trim()), 200);
  });
}

function performSearch(query) {
  const q = query.toLowerCase();
  let visibleCount = 0;

  menuCards.forEach((card) => {
    const name = (card.dataset.name || '').toLowerCase();
    const desc = (card.dataset.desc || '').toLowerCase();
    const matches = !q || name.includes(q) || desc.includes(q);
    card.style.display = matches ? '' : 'none';
    if (matches) visibleCount++;
  });

  if (emptyState) emptyState.classList.toggle('visible', visibleCount === 0);
}

// ===== فتح صفحة الواتساب مع رسالة الطلب =====
document.querySelectorAll('.btn-wa').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();

    const message = btn.dataset.name
      ? `السلام عليكم، أود طلب:\nاسم المنتج: ${btn.dataset.name}\nالسعر: ${btn.dataset.price} ر.س`
      : `السلام عليكم، أود طلب:\n${btn.dataset.offer}`;

    const waUrl = `https://wa.me/967509730421?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  });
});

// ===== تحديث سنة التحديث في تذييل الصفحة =====
if (yearEl) yearEl.textContent = new Date().getFullYear();

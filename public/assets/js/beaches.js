
function openLightbox(src) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  lightboxImg.src = src;
  lightbox.style.display = 'flex';
}

const elems = document.querySelectorAll('.containertimeline');
const reveal = () => {
  elems.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9)
      el.classList.add('show');
  });
};

window.addEventListener('scroll', reveal);
window.addEventListener('load', reveal);

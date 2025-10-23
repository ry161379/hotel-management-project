// js/script.js

document.addEventListener('DOMContentLoaded', function(){
  // Sticky navbar bg on scroll
  const nav = document.querySelector('.navbar');
  const carousel = document.querySelector('#mainCarousel');

  window.addEventListener('scroll', () => {
    if(window.scrollY > 20){
      nav.classList.add('sticky-top','bg-blur');
    } else {
      nav.classList.remove('sticky-top','bg-blur');
    }
  });

  // Smooth anchor scrolling for all internal links
  document.querySelectorAll('a[href^="#"]').forEach(link=>{
    link.addEventListener('click', function(e){
      const hash = this.getAttribute('href');
      if(hash.length > 1 && document.querySelector(hash)){
        e.preventDefault();
        document.querySelector(hash).scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  // Simple gallery modal using bootstrap Modal
  const galleryImages = document.querySelectorAll('.gallery-img');
  const modalImg = document.getElementById('galleryModalImg');
  if(modalImg){
    galleryImages.forEach(img=>{
      img.addEventListener('click', ()=>{
        modalImg.src = img.dataset.large || img.src;
        const modal = new bootstrap.Modal(document.getElementById('galleryModal'));
        modal.show();
      });
    });
  }

  // Small form validation (contact forms)
  document.querySelectorAll('form.needs-validation').forEach(form=>{
    form.addEventListener('submit', function(e){
      if(!form.checkValidity()){
        e.preventDefault();
        e.stopPropagation();
        form.classList.add('was-validated');
      }
    });
  });
});

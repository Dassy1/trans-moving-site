
// === Page Load Animation ===
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

// === Mobile Menu Toggle ===
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
  });

  window.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('active');
      menuToggle.classList.remove('active');
    }
  });
}

// === Smooth Scroll ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 70,
        behavior: 'smooth'
      });
    }
    navLinks?.classList.remove('active');
    menuToggle?.classList.remove('active');
  });
});

// === Back to Top Button ===
const backToTopBtn = document.querySelector('.back-to-top');
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopBtn?.classList.add('visible');
  } else {
    backToTopBtn?.classList.remove('visible');
  }
});
backToTopBtn?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// === Form Validation and Submission ===
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  const successMessage = contactForm.querySelector('.form-success');
  const spinner = document.getElementById('loadingSpinner');
  const phoneInput = contactForm.querySelector('#phone');

  phoneInput?.addEventListener('input', (e) => {
    const x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    e.target.value = !x[2] ? x[1] : `(${x[1]}) ${x[2]}${x[3] ? '-' + x[3] : ''}`;
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = contactForm.querySelectorAll('input, textarea, select');
    let valid = true;

    fields.forEach(field => {
      field.classList.remove('error');
      if (field.required && !field.value.trim()) {
        field.classList.add('error');
        valid = false;
      }
    });

    if (!valid) return;

    spinner?.classList.add('show');

    setTimeout(() => {
      spinner?.classList.remove('show');
      contactForm.reset();
      successMessage?.classList.add('show');
      setTimeout(() => successMessage?.classList.remove('show'), 3000);
    }, 2000);
  });
}

// === Animate on Scroll ===
const animateOnScroll = () => {
  const elements = document.querySelectorAll('.animate-on-scroll');
  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
    }
  });
};
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// === Dynamic Services ===
const servicesData = [
  {
      title: 'Residential Moving',
      description: 'Professional residential moving services for your home relocation needs.',
      icon: 'fas fa-home',
      features: [
          'Packing and unpacking',
          'Furniture disassembly and reassembly',
          'Full insurance coverage',
          'Storage solutions'
      ]
  },
  {
      title: 'Commercial Moving',
      description: 'Seamless office relocation services for businesses of all sizes.',
      icon: 'fas fa-building',
      features: [
          'After-hours moving',
          'Office furniture handling',
          'Equipment relocation',
          'Storage options'
      ]
  },
  {
      title: 'Packing Services',
      description: 'Professional packing services to ensure your belongings are safe during transit.',
      icon: 'fas fa-box',
      features: [
          'Custom crating',
          'Specialty item packing',
          'Eco-friendly materials',
          'Storage options'
      ]
  },
  {
      title: 'Storage Solutions',
      description: 'Secure and reliable storage options for your belongings.',
      icon: 'fas fa-warehouse',
      features: [
          'Climate-controlled storage',
          'Short-term and long-term options',
          'Secure facilities',
          '24/7 access'
      ]
  },
  {
      title: 'Junk Removal',
      description: 'Efficient junk removal services for homes and businesses.',
      icon: 'fas fa-trash-alt',
      features: [
          'Eco-friendly disposal',
          'Same-day service',
          'Debris removal',
          'Furniture disposal'
      ]
  },
  {
      title: 'Specialty Moving',
      description: 'Specialized moving services for unique items and situations.',
      icon: 'fas fa-star',
      features: [
          'Piano moving',
          'Antique furniture',
          'Artwork handling',
          'Custom solutions'
      ]
  }
];

const testimonialsData = [
  {
      content: 'Let\'s Get Moving made our home relocation seamless. They were professional, efficient, and handled our belongings with care.',
      author: 'John Smith',
      position: 'Toronto Resident',
      rating: 5,
      image: 'img/testimonial-1.jpg'
  },
  {
      content: 'The team was punctual and organized. They packed our entire office in a single day without any damage to our equipment.',
      author: 'Sarah Johnson',
      position: 'Office Manager',
      rating: 5,
      image: 'img/testimonial-2.jpg'
  },
  {
      content: 'I was impressed with their attention to detail and professionalism. They went above and beyond my expectations.',
      author: 'Michael Chen',
      position: 'Business Owner',
      rating: 5,
      image: 'img/testimonial-3.jpg'
  }
];

function generateServiceCard(service) {
  const card = document.createElement('div');
  card.className = 'service-card animate-on-scroll';
  card.innerHTML = `
    <div class="service-icon"><i class="${service.icon}"></i></div>
    <h3>${service.title}</h3>
    <p>${service.description}</p>
    <ul class="features-list">
      ${service.features.map(f => `<li>${f}</li>`).join('')}
    </ul>
    <button class="btn btn-primary">Learn More</button>
  `;
  return card;
}

function populateServices() {
  const container = document.querySelector('.services-grid');
  servicesData.forEach(service => container?.appendChild(generateServiceCard(service)));
}

function generateTestimonialCard(t) {
  const card = document.createElement('div');
  card.className = 'testimonial-card';
  card.innerHTML = `
    <div class="testimonial-rating">${'⭐'.repeat(t.rating)}</div>
    <div class="testimonial-content"><p>${t.content}</p></div>
    <div class="testimonial-author">
      <img src="${t.image}" alt="${t.author}"/>
      <div class="testimonial-author-info">
        <h4>${t.author}</h4>
        <p>${t.position}</p>
      </div>
    </div>
  `;
  return card;
}

function populateTestimonials() {
  const container = document.querySelector('.testimonials-slider');
  testimonialsData.forEach(t => container?.appendChild(generateTestimonialCard(t)));
}

document.addEventListener('DOMContentLoaded', () => {
  populateServices();
  populateTestimonials();
});

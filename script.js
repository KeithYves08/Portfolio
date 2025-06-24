// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Three.js background
  initThreeJS();
  
  // Initialize smooth scrolling
  initSmoothScrolling();
  
  // Initialize scroll effects
  initScrollEffects();
  
  // Initialize cursor effect
  initCursorEffect();
  
  // Initialize intersection observer for animations
  initAnimations();
  
  // Initialize hamburger menu
  initHamburgerMenu();
});

function initHamburgerMenu() {
    // Add a small delay to ensure DOM is fully loaded
    setTimeout(() => {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('nav ul');
        const body = document.body;

        console.log('Hamburger element:', hamburger);
        console.log('Nav menu element:', navMenu);

        if (!hamburger || !navMenu) {
            console.error('Hamburger menu elements not found');
            console.log('Available elements:', {
                hamburgers: document.querySelectorAll('.hamburger'),
                navMenus: document.querySelectorAll('nav ul')
            });
            return;
        }

        console.log('Hamburger menu initialized successfully');

        // Add click event listener to hamburger
        hamburger.addEventListener('click', (e) => {
            console.log('Hamburger clicked');
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle the 'active' class on both hamburger and nav menu
            const isActive = hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            console.log('Menu is now:', isActive ? 'open' : 'closed');
            
            // Update aria-expanded for accessibility
            hamburger.setAttribute('aria-expanded', isActive.toString());
            
            // Prevent body scroll when menu is open
            if (isActive) {
                body.classList.add('menu-open');
            } else {
                body.classList.remove('menu-open');
            }
        });

        // Close menu when clicking on a nav link
        const navLinks = document.querySelectorAll('nav ul li a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                console.log('Nav link clicked, closing menu');
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                body.classList.remove('menu-open');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                body.classList.remove('menu-open');
            }
        });

        // Close menu on window resize if it's open
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                body.classList.remove('menu-open');
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                body.classList.remove('menu-open');
                hamburger.focus();
            }
        });
    }, 100);
}

// Enhanced Three.js animated background for full page coverage
function initThreeJS() {
  try {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 200);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Create multiple types of geometric shapes for variety
    const geometries = [
      new THREE.IcosahedronGeometry(1, 0),
      new THREE.OctahedronGeometry(1, 0),
      new THREE.TetrahedronGeometry(1, 0),
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.SphereGeometry(0.8, 8, 6)
    ];

    const materials = [
      new THREE.MeshBasicMaterial({ color: 0x667eea, wireframe: true, transparent: true, opacity: 0.15 }),
      new THREE.MeshBasicMaterial({ color: 0xf093fb, wireframe: true, transparent: true, opacity: 0.12 }),
      new THREE.MeshBasicMaterial({ color: 0x4facfe, wireframe: true, transparent: true, opacity: 0.1 }),
      new THREE.MeshBasicMaterial({ color: 0x764ba2, wireframe: true, transparent: true, opacity: 0.08 }),
      new THREE.MeshBasicMaterial({ color: 0x00f2fe, wireframe: true, transparent: true, opacity: 0.13 })
    ];

    const shapes = [];
    
    // Increase number of shapes and distribute them better
    for (let i = 0; i < 75; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = materials[Math.floor(Math.random() * materials.length)];
      const mesh = new THREE.Mesh(geometry, material);
      
      // Better distribution across the entire viewport
      mesh.position.set(
    (Math.random() - 0.5) * 50,
    (Math.random() - 0.5) * 50,
    (Math.random() - 0.5) * 50
    );
      
      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      
      // Random scale for variety
      const scale = 0.5 + Math.random() * 1.5;
      mesh.scale.setScalar(scale);
      
      shapes.push({
        mesh: mesh,
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.002,
          y: (Math.random() - 0.5) * 0.002,
          z: (Math.random() - 0.5) * 0.002
        },
        floatSpeed: 0.0005 + Math.random() * 0.002,
        floatRange: 2 + Math.random() * 4,
        initialY: mesh.position.y
      });
      
      scene.add(mesh);
    }

    // Position camera for better coverage
    camera.position.z = 50;
    camera.position.y = 0;

    // Add subtle camera movement based on scroll
    let scrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      scrollY = window.scrollY;
    });

    function animate() {
      requestAnimationFrame(animate);
      
      const time = Date.now() * 0.001;
      
      // Animate each shape
      shapes.forEach((shapeObj, index) => {
        const { mesh, rotationSpeed, floatSpeed, floatRange, initialY } = shapeObj;
        
        // Rotation
        mesh.rotation.x += rotationSpeed.x;
        mesh.rotation.y += rotationSpeed.y;
        mesh.rotation.z += rotationSpeed.z;
        
        // Floating motion
        mesh.position.y = initialY + Math.sin(time * floatSpeed + index) * floatRange;
        
        // Subtle horizontal drift
        mesh.position.x += Math.sin(time * 0.0003 + index) * 0.01;
        
        // Move shapes based on scroll for parallax effect
        mesh.position.z += scrollY * 0.0001;
        
        // Reset position if too far
        if (mesh.position.z > 100) {
          mesh.position.z = -100;
        }
      });
      
      // Subtle camera movement based on scroll
      camera.position.y = scrollY * -0.025;
      camera.rotation.x = scrollY * 0.001;
      
      renderer.render(scene, camera);
    }
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
    });

    // Add mouse interaction for extra dynamism
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (event) => {
      mouseX = (event.clientX - window.innerWidth / 2) * 0.00005;
      mouseY = (event.clientY - window.innerHeight / 2) * 0.00005;
      
      camera.rotation.y += (mouseX - camera.rotation.y) * 0.05;
      camera.rotation.x += (mouseY - camera.rotation.x) * 0.05;
    });

  } catch (error) {
    console.log('Three.js background could not be initialized:', error);
  }
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// Enhanced header scroll effects
function initScrollEffects() {
  let lastScrollY = window.scrollY;
  
  window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (header) {
      const currentScrollY = window.scrollY;
      
      // Change header appearance based on scroll
      if (currentScrollY > 100) {
        header.style.background = 'rgba(12, 12, 12, 0.95)';
        header.style.borderBottom = '1px solid rgba(103, 126, 234, 0.3)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
      } else {
        header.style.background = 'rgba(12, 12, 12, 0.8)';
        header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        header.style.boxShadow = 'none';
      }
      
      // Hide/show header on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
      
      lastScrollY = currentScrollY;
    }
  });
}

// Enhanced cursor effect
function initCursorEffect() {
  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    background: radial-gradient(circle, rgba(103,126,234,0.8) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.1s ease;
    display: block;
    mix-blend-mode: difference;
  `;
  document.body.appendChild(cursor);

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth cursor following
  function updateCursor() {
    cursorX = mouseX;
    cursorY = mouseY;
    
    cursor.style.left = cursorX - 10 + 'px';
    cursor.style.top = cursorY - 10 + 'px';
    
    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  document.addEventListener('mousedown', () => {
    cursor.style.transform = 'scale(0.8)';
    cursor.style.background = 'radial-gradient(circle, rgba(240,147,251,0.8) 0%, transparent 70%)';
  });

  document.addEventListener('mouseup', () => {
    cursor.style.transform = 'scale(1)';
    cursor.style.background = 'radial-gradient(circle, rgba(103,126,234,0.8) 0%, transparent 70%)';
  });

  // Special effects for interactive elements
  document.querySelectorAll('a, button, .glass-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'scale(1.5)';
      cursor.style.background = 'radial-gradient(circle, rgba(79,172,254,0.9) 0%, transparent 70%)';
    });
    
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'scale(1)';
      cursor.style.background = 'radial-gradient(circle, rgba(103,126,234,0.8) 0%, transparent 70%)';
    });
  });
}

// Enhanced animations with Intersection Observer
function initAnimations() {
  // CSS for enhanced animations
  const style = document.createElement('style');
  style.textContent = `
    .fade-in {
      opacity: 0 !important;
      transform: translateY(50px) !important;
      transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .fade-in.visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }

    .slide-in-left {
      opacity: 0 !important;
      transform: translateX(-50px) !important;
      transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .slide-in-left.visible {
      opacity: 1 !important;
      transform: translateX(0) !important;
    }

    .slide-in-right {
      opacity: 0 !important;
      transform: translateX(50px) !important;
      transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .slide-in-right.visible {
      opacity: 1 !important;
      transform: translateX(0) !important;
    }

    .timeline-item {
      opacity: 0 !important;
      transform: translateY(30px) scale(0.95) !important;
      transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .timeline-item.visible {
      opacity: 1 !important;
      transform: translateY(0) scale(1) !important;
    }
  `;
  document.head.appendChild(style);

  // Apply animation classes to sections
  const sections = document.querySelectorAll('#about, #skills, #projects, #achievements, #contact');
  sections.forEach((section, index) => {
    if (index % 2 === 0) {
      section.classList.add('fade-in');
    } else {
      section.classList.add('slide-in-left');
    }
  });

  // Apply classes to timeline items
  document.querySelectorAll('.timeline-item').forEach(item => {
    item.classList.add('timeline-item');
  });

  // Intersection Observer setup with staggered animations
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -10% 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add delay for staggered effect
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100);
      }
    });
  }, observerOptions);

  // Observe all animated elements
  document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .timeline-item').forEach(el => {
    observer.observe(el);
  });

  // Special observer for skill cards with staggered animation
  const skillCards = document.querySelectorAll('.skill-card');
  skillCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px) scale(0.9)';
    card.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  });

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll('.skill-card');
        cards.forEach((card, index) => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, index * 100);
        });
      }
    });
  }, observerOptions);

  const skillsSection = document.querySelector('#skills');
  if (skillsSection) {
    skillObserver.observe(skillsSection);
  }

  // Fallback: Show all sections after 3 seconds if observer fails
  setTimeout(() => {
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .timeline-item').forEach(el => {
      if (!el.classList.contains('visible')) {
        el.classList.add('visible');
      }
    });
    
    skillCards.forEach(card => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0) scale(1)';
    });
  }, 3000);
}

// Force sections to be visible on page load (additional fallback)
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .timeline-item').forEach(el => {
      el.classList.add('visible');
    });
  }, 200);
});

// Add performance optimization
let ticking = false;
function updateOnScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      // Scroll-based updates can go here
      ticking = false;
    });
    ticking = true;
  }
}

window.addEventListener('scroll', updateOnScroll);
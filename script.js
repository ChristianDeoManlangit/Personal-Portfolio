// Animation functions - Observer for scroll-triggered animations
function initializeScrollAnimations() {
    // Create an Intersection Observer for scroll-triggered animations
    const animateObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible-animate');
                // Only observe once, then unobserve (prevents re-triggering)
                if (!entry.target.hasAttribute('data-continue-observing')) {
                    animateObserver.unobserve(entry.target);
                }
            }
        });
    }, { threshold: 0.15 }); // Trigger when 15% of the element is visible
    
    // Target all elements with the hidden-animate class
    const animateElements = document.querySelectorAll('.hidden-animate');
    animateElements.forEach(el => {
        animateObserver.observe(el);
    });
}

// Counter animation function for stats
function initializeCounterAnimation() {
    // Create an Intersection Observer for counter animations
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Only run once
                counterObserver.unobserve(entry.target);
                
                const currentText = entry.target.textContent.trim();
                const targetNum = parseFloat(entry.target.getAttribute('data-target')) || parseInt(currentText.replace(/\D/g, '')) || 0;
                const duration = 5000; // Duration in milliseconds (5 seconds)
                const step = 50; // Update every 50ms
                let current = 0;
                const increment = targetNum / (duration / step);
                
                // Check for suffixes
                const hasPlusSuffix = currentText.includes('+');
                const hasPercentSuffix = currentText.includes('%');
                const isDecimal = targetNum % 1 !== 0;
                
                const counterTimer = setInterval(() => {
                    current += increment;
                    if (current >= targetNum) {
                        current = targetNum;
                        clearInterval(counterTimer);
                    }
                    
                    // Update the DOM with appropriate formatting
                    if (hasPercentSuffix) {
                        // Handle percentage values (show one decimal place)
                        entry.target.textContent = isDecimal ? current.toFixed(1) + '%' : Math.floor(current) + '%';
                    } else if (hasPlusSuffix) {
                        // Handle numbers with plus sign
                        entry.target.textContent = Math.floor(current) + '+';
                    } else if (isDecimal) {
                        // Handle decimal numbers (show one decimal place)
                        entry.target.textContent = current.toFixed(1);
                    } else {
                        // Handle regular whole numbers
                        entry.target.textContent = Math.floor(current);
                    }
                }, step);
            }
        });
    }, { threshold: 0.7 }); // Trigger when 70% of the element is visible
    
    // Target all elements with counter class
    const counterElements = document.querySelectorAll('.counter-animate');
    counterElements.forEach(el => {
        // Store the target number as a data attribute if not already set
        // The data-target attribute can be set directly in HTML for more control
        if (!el.hasAttribute('data-target')) {
            const currentText = el.textContent.trim();
            // Extract number value, handling both integers and decimals
            const targetNum = parseFloat(currentText.replace(/[^\d.]/g, '')) || 0;
            el.setAttribute('data-target', targetNum);
        }
        
        // Start with 0 value unless we want to keep original text
        if (!el.hasAttribute('data-keep-original')) {
            // Check if it has a suffix to preserve
            const originalText = el.textContent.trim();
            if (originalText.includes('%')) {
                el.textContent = '0%';
            } else if (originalText.includes('+')) {
                el.textContent = '0+';
            } else {
                el.textContent = '0';
            }
        }
        
        counterObserver.observe(el);
    });
}

// Initialize homepage-specific animations
function initializeHomepageAnimations() {
    // Only run on the homepage (index.html)
    if (!document.querySelector('.hero-section')) return;
    
    // Add animation classes to text labels with staggered delays
    const textElements = document.querySelectorAll('.animate-on-load');
    textElements.forEach((el, index) => {
        el.classList.add('animate-slide-up-blur');
        el.classList.add(`stagger-${Math.min(index + 1, 8)}`);
    });
    
    // Add a delayed animation to social media icons
    const socialIcons = document.querySelectorAll('.social-animation');
    socialIcons.forEach((icon, index) => {
        icon.classList.add('animate-fade-in');
        // Add a longer delay for social icons to appear after text
        setTimeout(() => {
            icon.style.animationDelay = `${0.2 * index + 0.8}s`;
            icon.style.animationPlayState = 'running';
        }, 500);
    });
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio website loaded');
    initializeEventListeners();
    
    // Preload important images
    const preloadImages = () => {
        const images = document.querySelectorAll('img[loading="eager"]');
        images.forEach(img => {
            if (img.dataset.src) {
                const newImg = new Image();
                newImg.src = img.dataset.src;
                newImg.onload = () => {
                    img.src = img.dataset.src;
                };
            }
        });
    };
    
    // Initialize intersection observer for lazy loading
    const lazyLoadImages = () => {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    };

    preloadImages();
    lazyLoadImages();
    
    // Initialize carousel on works page if it exists
    if (document.querySelector('.carousel-container')) {
        initializeCarousel();
    }
    
    // Initialize lightbox on project pages if it exists
    if (document.getElementById('lightbox')) {
        initializeLightbox();
    }
    
    // Initialize animations
    initializeScrollAnimations();
    initializeCounterAnimation();
    initializeHomepageAnimations();
    
    // Initialize resume modal functionality
    const resumeModal = document.getElementById('resume-modal');
    const modalContent = document.getElementById('modal-content');
    const resumeButton = document.getElementById('resume-button');
    const closeModal = document.getElementById('close-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    
    if (resumeButton && resumeModal && closeModal && modalOverlay) {
        resumeButton.addEventListener('click', () => {
            resumeModal.classList.remove('hidden');
            // Trigger animation after a brief delay
            setTimeout(() => {
                modalContent.classList.remove('scale-95', 'opacity-0');
                modalContent.classList.add('scale-100', 'opacity-100');
            }, 10);
            document.body.style.overflow = 'hidden';
        });

        const closeModalFunction = () => {
            modalContent.classList.remove('scale-100', 'opacity-100');
            modalContent.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                resumeModal.classList.add('hidden');
                document.body.style.overflow = '';
            }, 300);
        };

        closeModal.addEventListener('click', closeModalFunction);
        modalOverlay.addEventListener('click', closeModalFunction);
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !resumeModal.classList.contains('hidden')) {
                closeModalFunction();
            }
        });
    }
});

// Initialize all event listeners
function initializeEventListeners() {
    // Add event listeners for any interactive elements
    setupNavHighlighting();
    
    // Initialize mobile menu functionality
    initializeMobileMenu();
    
    // Initialize search bar functionality if it exists
    if (document.getElementById('project-search')) {
        initializeProjectSearch();
    }
}

// Initialize project search functionality
function initializeProjectSearch() {
    const searchInput = document.getElementById('project-search');
    const projectCards = document.querySelectorAll('.project-card');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        projectCards.forEach(card => {
            const projectTitle = card.querySelector('h3').textContent.toLowerCase();
            
            if (searchTerm === '' || projectTitle.includes(searchTerm)) {
                // Display the card - parent is the grid item
                card.style.display = 'block';
                card.classList.add('search-match');
                card.classList.remove('search-no-match');
                
                // Add subtle scale animation on match
                card.style.transform = 'scale(1)';
                card.style.opacity = '1';
                card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            } else {
                // Hide the card
                card.style.display = 'none';
                card.classList.remove('search-match');
                card.classList.add('search-no-match');
                
                // Scale down and fade out on no match
                card.style.transform = 'scale(0.95)';
                card.style.opacity = '0.7';
            }
        });
        
        // Show a message if no cards match
        const matchCount = document.querySelectorAll('.search-match').length;
        const noResultsMsg = document.getElementById('no-results-message');
        
        if (matchCount === 0 && searchTerm !== '') {
            // Create "no results" message if it doesn't exist
            if (!noResultsMsg) {
                const msg = document.createElement('div');
                msg.id = 'no-results-message';
                msg.className = 'col-span-2 text-center py-12 text-gray-400';
                msg.innerHTML = 'No projects match your search';
                
                const projectGrid = projectCards[0].parentElement;
                projectGrid.appendChild(msg);
            }
        } else {
            // Remove "no results" message if it exists
            if (noResultsMsg) {
                noResultsMsg.remove();
            }
        }
    });
}

// Initialize featured project carousel
function initializeCarousel() {
    const carouselSlides = document.querySelector('.carousel-slides');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    let slideInterval;
    
    // Update active slide and indicator
    function goToSlide(index) {
        if (index < 0) {
            index = totalSlides - 1;
        } else if (index >= totalSlides) {
            index = 0;
        }
        
        currentIndex = index;
        const translateX = -currentIndex * 100 + '%';
        carouselSlides.style.transform = `translateX(${translateX})`;
        
        // Update active indicator
        indicators.forEach((indicator, i) => {
            if (i === currentIndex) {
                indicator.classList.add('bg-opacity-70');
                indicator.classList.remove('bg-opacity-30');
            } else {
                indicator.classList.add('bg-opacity-30');
                indicator.classList.remove('bg-opacity-70');
            }
        });
        
        // Update the label text based on the current slide
        const carouselLabel = document.getElementById('carousel-label');
        if (carouselLabel) {
            const currentSlide = slides[currentIndex];
            const slideTitle = currentSlide.getAttribute('data-title') || 'Design Portfolio';
            
            // Fade out, change text, fade in animation
            carouselLabel.style.opacity = '0';
            setTimeout(() => {
                carouselLabel.textContent = slideTitle;
                carouselLabel.style.opacity = '1';
            }, 200);
        }
    }
    
    // Initialize with first slide as active
    goToSlide(0);
    
    // Event listeners for next/prev buttons
    prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
        resetInterval();
    });
    
    nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
        resetInterval();
    });
    
    // Event listeners for indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
            resetInterval();
        });
    });
    
    // Auto-slide every 10 seconds
    function startInterval() {
        slideInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 10000);
    }
    
    function resetInterval() {
        clearInterval(slideInterval);
        startInterval();
    }
    
    // Start auto-sliding
    startInterval();
    
    // Pause auto-sliding when hovering over the carousel
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    carouselContainer.addEventListener('mouseleave', () => {
        startInterval();
    });
}

// Highlight the current page in the navigation
function setupNavHighlighting() {
    // Get the current page URL
    const currentUrl = window.location.pathname;
    
    // Find all navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Set active class based on current URL
    navLinks.forEach(link => {
        const linkUrl = link.getAttribute('href');
        if (currentUrl.endsWith(linkUrl)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Function to copy email to clipboard and update button content
function copyEmail() {
    const emailText = 'christiandeomanlangit80@gmail.com';
    
    // Create a temporary input element
    const tempInput = document.createElement('input');
    tempInput.value = emailText;
    document.body.appendChild(tempInput);
    
    // Select and copy the text
    tempInput.select();
    document.execCommand('copy');
    
    // Remove the temporary element
    document.body.removeChild(tempInput);
    
    // Update the button to show "Copied" with check mark
    updateEmailButtonToCopiedState();
    
    // Reset back to original after 2 seconds
    setTimeout(() => {
        resetEmailButton();
    }, 2000);
}

// Update email button to show "Copied" state
function updateEmailButtonToCopiedState() {
    const emailText = document.getElementById('email-text');
    const copyIcon = document.getElementById('copy-icon');
    const copiedText = document.getElementById('copied-text');
    const checkIcon = document.getElementById('check-icon');
    
    if (emailText && copyIcon && copiedText && checkIcon) {
        // Hide the email text and copy icon
        emailText.classList.add('hidden');
        copyIcon.classList.add('hidden');
        
        // Show the "Copied" text and check icon
        copiedText.classList.remove('hidden');
        checkIcon.classList.remove('hidden');
        
        // Add subtle animation
        const button = document.getElementById('email-button');
        if (button) {
            button.classList.add('copied-state');
        }
    }
}

// Reset the email button to original state
function resetEmailButton() {
    const emailText = document.getElementById('email-text');
    const copyIcon = document.getElementById('copy-icon');
    const copiedText = document.getElementById('copied-text');
    const checkIcon = document.getElementById('check-icon');
    
    if (emailText && copyIcon && copiedText && checkIcon) {
        // Show the email text and copy icon
        emailText.classList.remove('hidden');
        copyIcon.classList.remove('hidden');
        
        // Hide the "Copied" text and check icon
        copiedText.classList.add('hidden');
        checkIcon.classList.add('hidden');
        
        // Remove animation class
        const button = document.getElementById('email-button');
        if (button) {
            button.classList.remove('copied-state');
        }
    }
}

// Initialize lightbox functionality with dynamically created overlay
function initializeLightbox() {
    const projectImages = document.querySelectorAll('.project-image');
    
    if (!projectImages.length) return;
    
    // Create the lightbox structure
    const lightboxTemplate = `
        <div id="lightbox" class="fixed inset-0 z-[9999] flex items-center justify-center">
            <div class="absolute inset-0 bg-black bg-opacity-90 backdrop-blur-lg transition-opacity duration-300 ease-in-out"></div>
            
            <div class="relative z-10 w-full max-w-7xl mx-auto px-4 flex items-center justify-center h-full">
                <button id="lightbox-close" class="absolute top-6 right-6 text-white bg-black bg-opacity-60 backdrop-blur-sm hover:bg-opacity-80 rounded-full p-3 transition-all duration-300 z-20 shadow-lg hover:shadow-blue-500/20 hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                <button id="lightbox-prev" class="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-60 backdrop-blur-sm hover:bg-opacity-80 rounded-full p-4 transition-all duration-300 z-20 shadow-lg hover:shadow-blue-500/20 hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button id="lightbox-next" class="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-60 backdrop-blur-sm hover:bg-opacity-80 rounded-full p-4 transition-all duration-300 z-20 shadow-lg hover:shadow-blue-500/20 hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
                
                <div class="glass-panel p-3 rounded-xl bg-opacity-40 backdrop-blur-md shadow-2xl transform transition-all duration-300 w-full max-w-6xl">
                    <img id="lightbox-image" src="" alt="Enlarged project image" class="max-h-[85vh] max-w-full w-auto h-auto mx-auto rounded-lg object-contain transition-all duration-300 ease-in-out" style="opacity: 0; transform: scale(0.9);">
                </div>
            </div>
        </div>
    `;
    
    let currentImageIndex = 0;
    let imageUrls = [];
    let lightbox = null;
    let lightboxImage = null;
    let lightboxClose = null;
    let lightboxPrev = null;
    let lightboxNext = null;
    
    // Collect all image URLs
    projectImages.forEach(img => {
        const imageUrl = img.querySelector('img').src;
        imageUrls.push(imageUrl);
    });
    
    // Add click event to each image
    projectImages.forEach(img => {
        img.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            openLightbox(index);
        });
    });
    
    // Lightbox open function - dynamically creates and injects the lightbox
    function openLightbox(index) {
        currentImageIndex = index;
        
        // Remove any existing lightbox
        const existingLightbox = document.getElementById('lightbox');
        if (existingLightbox) {
            existingLightbox.remove();
        }
        
        // Create and append the new lightbox
        const lightboxElement = document.createElement('div');
        lightboxElement.innerHTML = lightboxTemplate.trim();
        document.body.appendChild(lightboxElement.firstElementChild);
        
        // Get references to the lightbox elements
        lightbox = document.getElementById('lightbox');
        lightboxImage = document.getElementById('lightbox-image');
        lightboxClose = document.getElementById('lightbox-close');
        lightboxPrev = document.getElementById('lightbox-prev');
        lightboxNext = document.getElementById('lightbox-next');
        
        // Setup event listeners
        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }
        
        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', showPrevImage);
        }
        
        if (lightboxNext) {
            lightboxNext.addEventListener('click', showNextImage);
        }
        
        // Close on background click
        if (lightbox) {
            lightbox.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeLightbox();
                }
            });
        }
        
        // Set the image source
        lightboxImage.src = imageUrls[index];
        
        // Prevent scrolling on the body
        document.body.style.overflow = 'hidden';
        
        // Trigger a reflow before starting the animation
        void lightboxImage.offsetWidth;
        
        // Start the animation
        setTimeout(() => {
            lightboxImage.style.opacity = '1';
            lightboxImage.style.transform = 'scale(1)';
        }, 50);
    }
    
    // Lightbox close function with smooth transition and complete removal
    function closeLightbox() {
        if (!lightbox) return;
        
        // Fade out image first
        if (lightboxImage) {
            lightboxImage.style.opacity = '0';
            lightboxImage.style.transform = 'scale(0.9)';
        }
        
        // Fade out the entire lightbox
        const backdrop = lightbox.querySelector('.absolute.inset-0');
        if (backdrop) {
            backdrop.style.opacity = '0';
        }
        
        // Wait for animation to complete before removing from DOM
        setTimeout(() => {
            // Restore scrolling
            document.body.style.overflow = '';
            
            // Completely remove the lightbox from DOM
            lightbox.remove();
            
            // Reset references
            lightbox = null;
            lightboxImage = null;
            lightboxClose = null;
            lightboxPrev = null;
            lightboxNext = null;
        }, 300);
    }
    
    // Navigation functions with smooth transitions
    function showPrevImage() {
        // Fade out current image
        lightboxImage.style.opacity = '0';
        lightboxImage.style.transform = 'scale(0.9) translateX(20px)';
        
        setTimeout(() => {
            // Update image source
            currentImageIndex = (currentImageIndex - 1 + imageUrls.length) % imageUrls.length;
            lightboxImage.src = imageUrls[currentImageIndex];
            
            // Fade in new image with slight delay
            setTimeout(() => {
                lightboxImage.style.opacity = '1';
                lightboxImage.style.transform = 'scale(1) translateX(0)';
            }, 50);
        }, 200);
    }
    
    function showNextImage() {
        // Fade out current image
        lightboxImage.style.opacity = '0';
        lightboxImage.style.transform = 'scale(0.9) translateX(-20px)';
        
        setTimeout(() => {
            // Update image source
            currentImageIndex = (currentImageIndex + 1) % imageUrls.length;
            lightboxImage.src = imageUrls[currentImageIndex];
            
            // Fade in new image with slight delay
            setTimeout(() => {
                lightboxImage.style.opacity = '1';
                lightboxImage.style.transform = 'scale(1) translateX(0)';
            }, 50);
        }, 200);
    }
    
    // Add event listeners
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', showPrevImage);
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', showNextImage);
    }
    
    // Close on background click
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === this) {
                closeLightbox();
            }
        });
    }
    
    // Global keyboard event handler for lightbox navigation
    document.addEventListener('keydown', function(e) {
        // Check if the lightbox exists in the DOM
        if (document.getElementById('lightbox')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            }
        }
    });
}

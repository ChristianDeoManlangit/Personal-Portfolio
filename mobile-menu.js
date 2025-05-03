// Initialize mobile hamburger menu functionality
function initializeMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const closeMobileMenu = document.getElementById('close-mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    if (!mobileMenuButton || !mobileMenuOverlay || !closeMobileMenu) return;
    
    // Function to open the mobile menu
    function openMobileMenu() {
        // Show the overlay
        mobileMenuOverlay.classList.remove('hidden');
        
        // Force a reflow to enable the transition
        mobileMenuOverlay.offsetHeight;
        
        // Add opacity for fade-in effect
        mobileMenuOverlay.classList.add('opacity-100');
        mobileMenuOverlay.classList.remove('opacity-0');
        
        // Disable body scrolling
        document.body.style.overflow = 'hidden';
        
        // Animate the mobile links in with a staggered delay
        mobileNavLinks.forEach((link, index) => {
            link.style.opacity = '0';
            link.style.transform = 'translateY(20px)';
            link.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                link.style.opacity = '1';
                link.style.transform = 'translateY(0)';
            }, 100 + (index * 100)); // Staggered animation
        });
    }
    
    // Function to close the mobile menu
    function closeMobileMenuOverlay() {
        // Start fade-out animation
        mobileMenuOverlay.classList.remove('opacity-100');
        mobileMenuOverlay.classList.add('opacity-0');
        
        // Hide the menu after animation completes
        setTimeout(() => {
            mobileMenuOverlay.classList.add('hidden');
            
            // Reset link animations
            mobileNavLinks.forEach((link) => {
                link.style.opacity = '0';
                link.style.transform = 'translateY(20px)';
            });
            
            // Re-enable body scrolling
            document.body.style.overflow = '';
        }, 300); // Match the transition-duration in CSS
    }
    
    // Event listeners
    mobileMenuButton.addEventListener('click', openMobileMenu);
    
    closeMobileMenu.addEventListener('click', closeMobileMenuOverlay);
    
    // Close menu when clicking a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenuOverlay);
    });
    
    // Close menu when clicking outside content area
    mobileMenuOverlay.addEventListener('click', function(e) {
        if (e.target === mobileMenuOverlay) {
            closeMobileMenuOverlay();
        }
    });
    
    // Close menu on escape key press
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !mobileMenuOverlay.classList.contains('hidden')) {
            closeMobileMenuOverlay();
        }
    });
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeMobileMenu();
});
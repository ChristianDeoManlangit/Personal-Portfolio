document.addEventListener('DOMContentLoaded', function () {
    const images = Array.from(document.querySelectorAll('.project-image img'));
    const imageSources = images.map(img => ({
        src: img.src,
        alt: img.alt
    }));

    const mainContent = document.querySelector('.container.mx-auto.px-4.relative.z-10.pt-20');

    images.forEach((img, idx) => {
        img.parentElement.addEventListener('click', () => openLightbox(idx));
    });

    function openLightbox(startIndex) {
        let currentIndex = startIndex;

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center';
        overlay.style.animation = 'fadeIn 0.2s';

        // Blur background
        if (mainContent) mainContent.classList.add('lightbox-blur');

        overlay.innerHTML = `
            <button class="absolute top-8 right-8 bg-black/60 hover:bg-black/80 backdrop-blur text-white p-2 rounded-full shadow-lg transition z-60" id="lightbox-close" aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <div class="flex flex-col w-full items-center">
                <img src="${imageSources[currentIndex].src}" alt="${imageSources[currentIndex].alt}"
                    class="mx-auto rounded-xl shadow-2xl max-h-[92vh]" id="lightbox-img">
                <div id="lightbox-nav-desktop" class="hidden w-full justify-center items-center mt-4 pointer-events-none">
                    <button class="pointer-events-auto bg-black/60 hover:bg-black/80 backdrop-blur text-white p-2 rounded-full shadow-lg transition z-60 mx-4 absolute left-4 top-1/2 -translate-y-1/2" id="lightbox-prev" aria-label="Previous">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button class="pointer-events-auto bg-black/60 hover:bg-black/80 backdrop-blur text-white p-2 rounded-full shadow-lg transition z-60 mx-4 absolute right-4 top-1/2 -translate-y-1/2" id="lightbox-next" aria-label="Next">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
                <div id="lightbox-nav-mobile" class="flex w-full justify-center items-center mt-4">
                    <button class="bg-black/60 hover:bg-black/80 backdrop-blur text-white p-2 rounded-full shadow-lg transition z-60 mx-8" id="lightbox-prev-mobile" aria-label="Previous">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button class="bg-black/60 hover:bg-black/80 backdrop-blur text-white p-2 rounded-full shadow-lg transition z-60 mx-8" id="lightbox-next-mobile" aria-label="Next">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        function updateImage() {
            const img = overlay.querySelector('#lightbox-img');
            img.src = imageSources[currentIndex].src;
            img.alt = imageSources[currentIndex].alt;
        }

        function closeLightbox() {
            overlay.remove();
            if (mainContent) mainContent.classList.remove('lightbox-blur');
        }

        // Desktop navigation
        const prevBtn = overlay.querySelector('#lightbox-prev');
        const nextBtn = overlay.querySelector('#lightbox-next');
        if (prevBtn && nextBtn) {
            prevBtn.onclick = () => {
                currentIndex = (currentIndex - 1 + imageSources.length) % imageSources.length;
                updateImage();
            };
            nextBtn.onclick = () => {
                currentIndex = (currentIndex + 1) % imageSources.length;
                updateImage();
            };
        }

        // Mobile navigation
        const prevBtnMobile = overlay.querySelector('#lightbox-prev-mobile');
        const nextBtnMobile = overlay.querySelector('#lightbox-next-mobile');
        if (prevBtnMobile && nextBtnMobile) {
            prevBtnMobile.onclick = () => {
                currentIndex = (currentIndex - 1 + imageSources.length) % imageSources.length;
                updateImage();
            };
            nextBtnMobile.onclick = () => {
                currentIndex = (currentIndex + 1) % imageSources.length;
                updateImage();
            };
        }

        overlay.querySelector('#lightbox-close').onclick = closeLightbox;

        // Responsive switch for navigation and image scaling
        function handleNavAndImage() {
            const navDesktop = overlay.querySelector('#lightbox-nav-desktop');
            const navMobile = overlay.querySelector('#lightbox-nav-mobile');
            const img = overlay.querySelector('#lightbox-img');
            // Navigation
            if (window.innerWidth >= 1300) {
                navDesktop.classList.remove('hidden');
                navMobile.classList.add('hidden');
            } else {
                navDesktop.classList.add('hidden');
                navMobile.classList.remove('hidden');
            }
            // Image scaling
            img.classList.remove(
                'max-w-2xl', 'max-w-3xl', 'max-w-6xl', 'max-w-7xl',
                'max-w-[90vw]', 'max-w-[99vw]'
            );
            if (window.innerWidth < 1300 && window.innerWidth > 765) {
                img.classList.add('max-w-[90vw]');
            } else if (window.innerWidth <= 765) {
                img.classList.add('max-w-[99vw]');
            } else {
                img.classList.add('max-w-6xl', 'xl:max-w-7xl');
            }
        }
        handleNavAndImage();
        window.addEventListener('resize', handleNavAndImage);

        // Close on overlay click (not on image or buttons)
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeLightbox();
        });

        // Keyboard navigation
        document.addEventListener('keydown', onKeyDown);
        function onKeyDown(e) {
            if (!document.body.contains(overlay)) {
                document.removeEventListener('keydown', onKeyDown);
                window.removeEventListener('resize', handleNavAndImage);
                return;
            }
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') (window.innerWidth < 1300 ? prevBtnMobile : prevBtn).click();
            if (e.key === 'ArrowRight') (window.innerWidth < 1300 ? nextBtnMobile : nextBtn).click();
        }
    }
});
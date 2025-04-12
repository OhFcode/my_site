// JavaScript for gallery carousel
document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.carousel');

    carousels.forEach(carousel => {
        const slidesContainer = carousel.querySelector('.carousel-slides');
        let slides = carousel.querySelectorAll('.carousel-slide'); // Get original slides
        const prevButton = carousel.querySelector('.carousel-prev');
        const nextButton = carousel.querySelector('.carousel-next');

        // --- Infinite Loop Setup ---
        // 1. Clone first and last slides
        const firstClone = slides[0].cloneNode(true);
        const lastClone = slides[slides.length - 1].cloneNode(true);
        firstClone.classList.add('clone');
        lastClone.classList.add('clone');

        // 2. Add clones to the container
        slidesContainer.appendChild(firstClone);
        slidesContainer.insertBefore(lastClone, slides[0]);

        // 3. Update slides NodeList to include clones
        slides = carousel.querySelectorAll('.carousel-slide');
        const slideCount = slides.length; // Total slides including clones

        let currentIndex = 1; // Start at the first *actual* slide
        let isTransitioning = false; // Flag to prevent spam clicking

        // 4. Initial position without transition
        slidesContainer.style.transition = 'none'; // Disable transition for initial set
        slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        // Force reflow
        void slidesContainer.offsetHeight;
        // Re-enable transitions
        slidesContainer.style.transition = 'transform 0.5s ease-in-out';
        // --- End Infinite Loop Setup ---


        function updateBackground() {
            let realSlideIndex;
            const numRealSlides = slides.length - 2; // Total number of actual slides (excluding clones)

            if (currentIndex === 0) { // Currently showing the last clone (looks like the last real slide)
                realSlideIndex = numRealSlides - 1; // Index of the last real slide (0-based)
            } else if (currentIndex === slideCount - 1) { // Currently showing the first clone (looks like the first real slide)
                realSlideIndex = 0; // Index of the first real slide (0-based)
            } else { // Currently showing a real slide (indices 1 to numRealSlides in the full list)
                realSlideIndex = currentIndex - 1; // Map index 1 to 0, 2 to 1, etc. for the real slides list
            }

            // Get the list of real slides only
            const realSlides = carousel.querySelectorAll('.carousel-slide:not(.clone)');
            // Ensure the calculated index is valid for the real slides list
            realSlideIndex = Math.max(0, Math.min(realSlideIndex, realSlides.length - 1));

            const activeSlide = realSlides[realSlideIndex]; // Get the slide using the calculated 0-based index
            const activeImageSrc = activeSlide?.querySelector('img')?.src;

            if (activeImageSrc) {
                // Apply background with overlay
                document.body.style.backgroundImage = `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url('${activeImageSrc}')`;
                // Ensure other background properties are set correctly
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center center';
                document.body.style.backgroundAttachment = 'fixed';
                document.body.style.backgroundRepeat = 'no-repeat';
            }
        }

        function moveToSlide(newIndex) {
            if (isTransitioning) return;
            isTransitioning = true;

            currentIndex = newIndex;
            slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateBackground(); // Update background based on the target slide index

            // No need for active/prev/next classes with this method
        }

        // Listener for transition end to handle the jump for clones
        slidesContainer.addEventListener('transitionend', (event) => {
            if (event.propertyName === 'transform') {
                if (currentIndex === 0) {
                    slidesContainer.style.transition = 'none';
                    const newIndex = slideCount - 2;
                    currentIndex = newIndex;
                    slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
                    void slidesContainer.offsetHeight;
                    slidesContainer.style.transition = 'transform 0.5s ease-in-out';
                    updateBackground();
                } else if (currentIndex === slideCount - 1) {
                    slidesContainer.style.transition = 'none';
                    const newIndex = 1;
                    currentIndex = newIndex;
                    slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
                    void slidesContainer.offsetHeight;
                    slidesContainer.style.transition = 'transform 0.5s ease-in-out';
                    updateBackground();
                }
                isTransitioning = false;
            }
        });


        prevButton.addEventListener('click', () => {
            if (isTransitioning) return;
            moveToSlide(currentIndex - 1);
        });

        nextButton.addEventListener('click', () => {
             if (isTransitioning) return;
            moveToSlide(currentIndex + 1);
        });

        // Initial background setup
        updateBackground();
    });
});
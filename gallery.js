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
             // Get the *actual* current index (adjusting for clones)
             let actualCurrentIndex = currentIndex - 1; // Adjust for the prepended clone
             if (actualCurrentIndex < 0) { // If on the last clone
                 actualCurrentIndex = slideCount - 2 -1; // Index of the last actual slide
             } else if (actualCurrentIndex >= slideCount - 2) { // If on the first clone
                 actualCurrentIndex = 0; // Index of the first actual slide
             }

            const activeSlide = carousel.querySelectorAll('.carousel-slide:not(.clone)')[actualCurrentIndex]; // Select from non-clones
            const activeImageSrc = activeSlide?.querySelector('img')?.src;
            if (activeImageSrc) {
                document.body.style.backgroundImage = `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url('${activeImageSrc}')`;
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
                } else if (currentIndex === slideCount - 1) {
                    slidesContainer.style.transition = 'none';
                    const newIndex = 1;
                    currentIndex = newIndex;
                    slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
                    void slidesContainer.offsetHeight;
                    slidesContainer.style.transition = 'transform 0.5s ease-in-out';
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
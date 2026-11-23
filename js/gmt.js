//* GMT LIGHTBOX

const galleryItems = document.querySelectorAll('.gmt-gallery .gallery-item');

const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');

const captionText = document.getElementById('caption');
const closeBtn = document.querySelector('.close');


//* ZOOM + DRAG

let zoom = 1;

let positionX = 0;
let positionY = 0;

let isDragging = false;

let startX = 0;
let startY = 0;


//* UPDATE IMAGE

function updateImageTransform() {
    modalImg.style.transform =
        `translate(${positionX}px, ${positionY}px) scale(${zoom})`;
}


//* RESET ZOOM

function resetZoom() {
    zoom = 1;
    positionX = 0;
    positionY = 0;

    updateImageTransform();
}


//* ZOOM

modal.addEventListener('wheel', (e) => {

    e.preventDefault();

    const zoomSpeed = 0.5;

    const rect = modal.getBoundingClientRect();

    // Mouse position relative to modal center
    const mouseX = e.clientX - (rect.left + rect.width / 2);
    const mouseY = e.clientY - (rect.top + rect.height / 2);

    const oldZoom = zoom;

    zoom += e.deltaY < 0 ? zoomSpeed : -zoomSpeed;

    zoom = Math.min(Math.max(1, zoom), 5);

    if (zoom === oldZoom) return;

    // Keep mouse position as zoom focus
    positionX = mouseX - (mouseX - positionX) * (zoom / oldZoom);
    positionY = mouseY - (mouseY - positionY) * (zoom / oldZoom);

    if (zoom === 1) {
        positionX = 0;
        positionY = 0;
    }

    updateImageTransform();

}, { passive: false });


//* PREVENT NATIVE IMAGE DRAG

modalImg.addEventListener('dragstart', (e) => {
    e.preventDefault();
});


//* DRAG

modalImg.addEventListener('pointerdown', (e) => {

    if (zoom === 1) return;

    e.preventDefault();

    isDragging = true;

    startX = e.clientX - positionX;
    startY = e.clientY - positionY;

    modalImg.setPointerCapture(e.pointerId);

    modalImg.style.cursor = 'grabbing';
});


modalImg.addEventListener('pointermove', (e) => {

    if (!isDragging) return;

    positionX = e.clientX - startX;
    positionY = e.clientY - startY;

    updateImageTransform();
});


modalImg.addEventListener('pointerup', () => {

    isDragging = false;

    modalImg.style.cursor = 'grab';
});


modalImg.addEventListener('pointercancel', () => {

    isDragging = false;

    modalImg.style.cursor = 'grab';
});


//* OPEN IMAGE

galleryItems.forEach((item) => {

    const image = item.querySelector('img');

    item.addEventListener('click', () => {

        resetZoom();

        modal.style.display = 'flex';

        modalImg.src = image.src;

        captionText.textContent = image.dataset.title;

    });

});


//* CLOSE

closeBtn.addEventListener('click', () => {

    modal.style.display = 'none';

    resetZoom();

});
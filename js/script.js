//* CONTADOR DE PÁGINAS

const chapters = {
    1: 35,
};

const params = new URLSearchParams(window.location.search);
const chapter = params.get('capitulo');

const gallery = document.getElementById('gallery');
const pageCount = chapters[chapter];

for (let i = 1; i <= pageCount; i++) {

    const item = document.createElement('div');
    item.classList.add('gallery-item');

    const image = document.createElement('img');
    image.src = `Imagenes/Capitulo${chapter}/${i}.png`;

    item.appendChild(image);
    gallery.appendChild(item);
}

//* LIGHTBOX

const galleryItems = document.querySelectorAll('.gallery-item');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const captionText = document.getElementById('caption');
const closeBtn = document.querySelector('.close');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let currentImageIndex = 0;

//* ZOOM + DRAG


let zoom = 1;

let positionX = 0;
let positionY = 0;

let isDragging = false;

let startX = 0;
let startY = 0;


//* ZOOM

modal.addEventListener('wheel', (e) => {

    // Prevent the page behind the modal from scrolling
    e.preventDefault();

    const zoomSpeed = 0.5;

    // Position of the mouse relative to the center of the modal
    const rect = modal.getBoundingClientRect();

    const mouseX = e.clientX - (rect.left + rect.width / 2);
    const mouseY = e.clientY - (rect.top + rect.height / 2);

    // Zoom before changing it
    const oldZoom = zoom;

    // Change zoom
    zoom += e.deltaY < 0 ? zoomSpeed : -zoomSpeed;

    // Minimum and maximum zoom
    zoom = Math.min(Math.max(1, zoom), 5);

    if (zoom === oldZoom) return;

    // Keep the point underneath the mouse in place
    positionX = mouseX - (mouseX - positionX) * (zoom / oldZoom);
    positionY = mouseY - (mouseY - positionY) * (zoom / oldZoom);

    // Return everything to the center at normal size
    if (zoom === 1) {
        positionX = 0;
        positionY = 0;
    }

    updateImageTransform();
});


//* DRAG

modalImg.addEventListener('dragstart', (e) => {
    e.preventDefault();
});

modalImg.addEventListener('mousedown', (e) => {

    // Don't allow dragging when the image isn't zoomed
    if (zoom === 1) return;

    isDragging = true;

    startX = e.clientX - positionX;
    startY = e.clientY - positionY;

    modalImg.style.cursor = 'grabbing';
});


document.addEventListener('mousemove', (e) => {

    if (!isDragging) return;

    positionX = e.clientX - startX;
    positionY = e.clientY - startY;

    updateImageTransform();
});


document.addEventListener('mouseup', () => {

    isDragging = false;
    modalImg.style.cursor = 'grab';
});

//* SUBIR IMAGEN


function updateImageTransform() {

    modalImg.style.transform =
        `translate(${positionX}px, ${positionY}px) scale(${zoom})`;
}

//* RESETEAR PÁGINA
function resetZoom() {

    zoom = 1;
    positionX = 0;
    positionY = 0;

    updateImageTransform();
}

//* ABRIR IMAGEN

galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        modal.style.display = 'flex';
        modalImg.src = item.querySelector('img').src;
        captionText.innerHTML = item.getAttribute('data-title');
        currentImageIndex = index;
    });
});

//* CERRAR

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});


//* ATRÁS
prevBtn.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
    modalImg.src = galleryItems[currentImageIndex].querySelector('img').src;
    captionText.innerHTML = galleryItems[currentImageIndex].getAttribute('data-title');
    resetZoom();
});

//* SIGUIENTE

nextBtn.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1 + galleryItems.length) % galleryItems.length;
    modalImg.src = galleryItems[currentImageIndex].querySelector('img').src;
    captionText.innerHTML = galleryItems[currentImageIndex].getAttribute('data-title');
    resetZoom();
});
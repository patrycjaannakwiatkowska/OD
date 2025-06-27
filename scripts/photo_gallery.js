// Photo Gallery Modal Script
// This script provides functionality for a modal photo gallery, including keyboard navigation, swipe gesture support, accessibility feedback, and event handling for image navigation.

// Initialize the current image index to 0
let currentImageIndex = 0;

// Select the photo gallery element
const gallery = document.querySelector('.photo-gallery');

// Select all images within the photo gallery
const images = gallery.querySelectorAll('img');

/**
 * Sets the display style of the modal element.
 * @param {string} displayStyle - The CSS display value (e.g., 'flex', 'none').
 */
function setModalDisplay(displayStyle) {
  document.getElementById("myModal").style.display = displayStyle;
}

/**
 * Opens the modal and displays the clicked image.
 * Adds swipe listeners for gesture navigation.
 * @param {HTMLImageElement} img - The image element that was clicked.
 */
function openModal(img) {
  document.body.classList.add('no-scroll'); // Block scrolling
  originalOpenModal(img);
  addSwipeListeners();
}

/**
 * Updates the image counter in the modal (div id="image_counter").
 */
function updateImageCounter() {
  const counter = document.getElementById("image_counter");
  if (counter) {
    counter.textContent = `${currentImageIndex + 1} / ${images.length}`;
  }
}

/**
 * The original function to open the modal and set the image preview.
 * @param {HTMLImageElement} img - The image element to display in the modal.
 */
const originalOpenModal = function(img) {
  setModalDisplay("flex"); // Set the modal display to flex
  document.getElementById("image_preview").src = img.src; // Set the source of the image preview to the clicked image's source
  currentImageIndex = Array.from(images).indexOf(img); // Get the index of the clicked image
  updateImageCounter(); // Update the image counter in the modal in div id="image_counter"
};

/**
 * The original function to close the modal.
 */
const originalCloseModal = function() {
  setModalDisplay("none"); // Set the modal display to none
};

/**
 * Closes the modal and removes swipe listeners.
 * Also cleans up ARIA live region and resets swipe state.
 */
function closeModal() {
  document.body.classList.remove('no-scroll'); // Restore scrolling
  removeSwipeListeners();
  cleanupAriaLiveRegion();
  swipeHandled = false;
  activePointerId = null;
  originalCloseModal();
  // Announce modal close for accessibility
  announceToAriaLive('Photo gallery modal closed.');
}

/**
 * The original function to close the modal without swipe function.
function closeModal() {
  originalCloseModal();
}
*/

/**
 * Shows the image at the specified index in the modal preview.
 * Updates the current image index.
 * @param {number} index - The index of the image to display.
 */
function showImage(index) {
  if (index >= 0 && index < images.length) { // Check if the index is within bounds
    document.getElementById("image_preview").src = images[index].src; // Set the source of the image preview to the image at the specified index
    currentImageIndex = index; // Update the current image index
    updateImageCounter(); // Update the image counter in the modal in div id="image_counter"
  }
}

/**
 * Handles keyboard navigation for the modal.
 * Supports Escape (close), ArrowLeft/ArrowRight (prev/next), Home/End (first/last image).
 */
document.addEventListener("keydown", function(event) {
  if (event.key === "Escape") { // If the Escape key is pressed
    closeModal(); // Close the modal
  } else if (event.key === "ArrowLeft") { // If the Left arrow key is pressed
    showImage(currentImageIndex - 1); // Show the previous image
  } else if (event.key === "ArrowRight") { // If the Right arrow key is pressed
    showImage(currentImageIndex + 1); // Show the next image
  } else if (event.key === "Home") { // If the Home key is pressed
    showImage(0); // Show the first image
  } else if (event.key === "End") { // If the End key is pressed
    showImage(images.length - 1); // Show the last image
  }
});

/**
 * Event listener for the previous image button.
 * Navigates to the previous image and prevents modal closure.
 */
document.getElementById("previous_image_button").addEventListener("click", function(event) {
  event.stopPropagation(); // Prevent the modal from closing
  showImage(currentImageIndex - 1); // Show the previous image
});

/**
 * Event listener for the next image button.
 * Navigates to the next image and prevents modal closure.
 */
document.getElementById("next_image_button").addEventListener("click", function(event) {
  event.stopPropagation(); // Prevent the modal from closing
  showImage(currentImageIndex + 1); // Show the next image
});

// ================= Swipe Gesture Support =================

/**
 * Minimum horizontal distance (in pixels) required to trigger a swipe.
 * @constant {number}
 */
const SWIPE_THRESHOLD = 50; // px

// Variables for swipe gesture tracking
let pointerStartX = 0;
let pointerStartY = 0;
let pointerEndX = 0;
let pointerEndY = 0;
let swipeHandled = false;
let activePointerId = null;
let ariaLiveRegion = null;
let pointerDirectionLocked = null; // null, 'horizontal', or 'vertical'

/**
 * Checks if the pointer event type is supported for swipe gestures.
 * @param {PointerEvent} event - The pointer event to check.
 * @returns {boolean} True if supported, false otherwise.
 */
function isPointerTypeSupported(event) {
  return event.pointerType === "touch" || event.pointerType === "pen" || event.pointerType === "mouse";
}

/**
 * Checks if the event target is an interactive element (e.g., button, link, input).
 * @param {EventTarget} target - The event target.
 * @returns {boolean} True if interactive, false otherwise.
 */
function isInteractiveElement(target) {
  return target.closest('button, a, input, textarea, select, [tabindex]');
}

/**
 * Adds swipe gesture event listeners to the modal for navigation.
 * Also creates an ARIA live region for accessibility feedback if not present.
 * Adds pointerleave for swipe state cleanup. Sets touch-action CSS.
 */
function addSwipeListeners() {
  const modal = document.getElementById("myModal");
  if (!modal) return;
  removeSwipeListeners();
  modal.addEventListener("pointerdown", handlePointerDown);
  modal.addEventListener("pointerup", handlePointerUp);
  modal.addEventListener("pointermove", handlePointerMove, { passive: false });
  modal.addEventListener("pointercancel", handlePointerCancel);
  modal.addEventListener("pointerleave", handlePointerLeave);
  // Mouse wheel navigation
  modal.addEventListener("wheel", handleModalWheel, { passive: false });
  // Set touch-action CSS for better swipe experience (only set once)
  if (modal.style.touchAction !== "pan-y") {
    modal.style.touchAction = "pan-y";
  }
  if (!ariaLiveRegion) {
    ariaLiveRegion = document.createElement('div');
    ariaLiveRegion.setAttribute('aria-live', 'polite');
    ariaLiveRegion.setAttribute('role', 'status');
    ariaLiveRegion.style.position = 'absolute';
    ariaLiveRegion.style.left = '-9999px';
    document.body.appendChild(ariaLiveRegion);
  }
  // Announce modal open for accessibility
  announceToAriaLive('Photo gallery modal opened.');
}

/**
 * Removes swipe gesture event listeners from the modal.
 * Also removes pointerleave event.
 * Always resets swipe state on removal for robustness.
 */
function removeSwipeListeners() {
  const modal = document.getElementById("myModal");
  if (!modal) return;
  modal.removeEventListener("pointerdown", handlePointerDown);
  modal.removeEventListener("pointerup", handlePointerUp);
  modal.removeEventListener("pointermove", handlePointerMove);
  modal.removeEventListener("pointercancel", handlePointerCancel);
  modal.removeEventListener("pointerleave", handlePointerLeave);
  modal.removeEventListener("wheel", handleModalWheel);
  swipeHandled = false;
  activePointerId = null;
  pointerDirectionLocked = null;
  // Defensive: cleanup ARIA region if modal is removed unexpectedly
  if (!document.body.contains(modal)) {
    cleanupAriaLiveRegion();
  }
}

/**
 * Handles the pointerdown event to start swipe tracking.
 * Ignores events on interactive elements.
 * Prevents multi-touch interference.
 * Uses pointer capture for robustness.
 * @param {PointerEvent} event - The pointerdown event.
 */
function handlePointerDown(event) {
  if (!isPointerTypeSupported(event)) return;
  if (isInteractiveElement(event.target)) return;
  // Prevent multi-touch interference: only allow one active pointer
  if (activePointerId !== null) return;
  pointerStartX = event.clientX;
  pointerStartY = event.clientY;
  swipeHandled = false;
  activePointerId = event.pointerId;
  event.target.setPointerCapture && event.target.setPointerCapture(event.pointerId);
  // Lock direction after threshold (gesture lock)
  pointerDirectionLocked = null;
}

/**
 * Handles the pointermove event to optionally prevent vertical scrolling during a horizontal swipe.
 * Prevents accidental swipe if vertical movement is significant.
 * @param {PointerEvent} event - The pointermove event.
 */
function handlePointerMove(event) {
  if (swipeHandled) return;
  if (!isPointerTypeSupported(event)) return;
  if (event.pointerId !== activePointerId) return;
  const diffX = event.clientX - pointerStartX;
  const diffY = event.clientY - pointerStartY;
  // Lock direction after a small threshold
  if (!pointerDirectionLocked && (Math.abs(diffX) > 10 || Math.abs(diffY) > 10)) {
    pointerDirectionLocked = Math.abs(diffX) > Math.abs(diffY) ? 'horizontal' : 'vertical';
  }
  // Prevent accidental swipe if vertical movement is significant
  if (pointerDirectionLocked === 'vertical') return;
  if (Math.abs(diffY) > 2 * SWIPE_THRESHOLD) return;
  if (pointerDirectionLocked === 'horizontal' && Math.abs(diffX) > SWIPE_THRESHOLD / 2) {
    event.preventDefault();
  }
}

/**
 * Handles the pointerup event to detect swipe gestures and navigate images.
 * Provides ARIA feedback for accessibility and edge cases.
 * Always resets swipe state after pointerup.
 * Releases pointer capture if set.
 * @param {PointerEvent} event - The pointerup event.
 */
function handlePointerUp(event) {
  if (!isPointerTypeSupported(event)) return;
  if (event.pointerId !== activePointerId) return;
  pointerEndX = event.clientX;
  pointerEndY = event.clientY;
  const diffX = pointerEndX - pointerStartX;
  const diffY = pointerEndY - pointerStartY;
  // Prevent accidental swipe if vertical movement is significant
  if (Math.abs(diffY) > 2 * SWIPE_THRESHOLD) {
    swipeHandled = false;
    activePointerId = null;
    pointerDirectionLocked = null;
    if (event.target && event.target.isConnected && event.target.releasePointerCapture) {
      event.target.releasePointerCapture(event.pointerId);
    }
    return;
  }
  if (!swipeHandled && Math.abs(diffX) > SWIPE_THRESHOLD && Math.abs(diffX) > Math.abs(diffY)) { // Horizontal swipe only
    swipeHandled = true;
    if (diffX < 0) {
      // Swipe left: show next image
      if (currentImageIndex < images.length - 1) {
        showImage(currentImageIndex + 1);
        announceToAriaLive(`Next image (${currentImageIndex + 1} of ${images.length}: ${images[currentImageIndex].alt || ''})`);
      } else {
        announceToAriaLive('This is the last image.');
      }
    } else {
      // Swipe right: show previous image
      if (currentImageIndex > 0) {
        showImage(currentImageIndex - 1);
        announceToAriaLive(`Previous image (${currentImageIndex + 1} of ${images.length}: ${images[currentImageIndex].alt || ''})`);
      } else {
        announceToAriaLive('This is the first image.');
      }
    }
  } else if (Math.abs(diffY) > SWIPE_THRESHOLD && Math.abs(diffY) > Math.abs(diffX)) {
    // Feedback for ignored swipe due to vertical movement
    announceToAriaLive('Swipe ignored: too much vertical movement.');
  }
  // Always reset state after pointerup
  swipeHandled = false;
  activePointerId = null;
  pointerDirectionLocked = null;
  if (event.target && event.target.isConnected && event.target.releasePointerCapture) {
    event.target.releasePointerCapture(event.pointerId);
  }
}

/**
 * Handles the pointercancel event to reset swipe tracking.
 * @param {PointerEvent} event - The pointercancel event.
 */
function handlePointerCancel(event) {
  if (!isPointerTypeSupported(event)) return;
  if (event.pointerId !== activePointerId) return;
  if (event.target && event.target.isConnected && event.target.releasePointerCapture) {
    event.target.releasePointerCapture(event.pointerId);
  }
  activePointerId = null;
  swipeHandled = false;
  pointerDirectionLocked = null;
}

/**
 * Handles the pointerleave event to reset swipe tracking if pointer leaves modal.
 * @param {PointerEvent} event - The pointerleave event.
 */
function handlePointerLeave(event) {
  if (activePointerId !== null && event.target && event.target.isConnected && event.target.releasePointerCapture) {
    event.target.releasePointerCapture(activePointerId);
  }
  swipeHandled = false;
  activePointerId = null;
  pointerDirectionLocked = null;
}

/**
 * Announces a message to the ARIA live region for screen readers.
 * Clears textContent before setting new message to ensure repeated messages are announced.
 * @param {string} message - The message to announce.
 */
function announceToAriaLive(message) {
  if (ariaLiveRegion) {
    // Clear first to ensure repeated messages are announced
    ariaLiveRegion.textContent = '';
    window.requestAnimationFrame(() => {
      ariaLiveRegion.textContent = message;
    });
  }
}

/**
 * Cleans up the ARIA live region from the DOM if it exists.
 * Removes all references for memory leak prevention.
 */
function cleanupAriaLiveRegion() {
  if (ariaLiveRegion && ariaLiveRegion.parentNode) {
    ariaLiveRegion.parentNode.removeChild(ariaLiveRegion);
  }
  ariaLiveRegion = null;
}

/**
 * Handles mouse wheel for image navigation in modal.
 * @param {WheelEvent} event - The wheel event.
 */
function handleModalWheel(event) {
  event.preventDefault();
  if (event.deltaY < 0) {
    // Wheel up: previous image
    showImage(currentImageIndex - 1);
  } else if (event.deltaY > 0) {
    // Wheel down: next image
    showImage(currentImageIndex + 1);
  }
}

/**
 * Adds swipe listeners on DOMContentLoaded for initial setup.
 */
document.addEventListener("DOMContentLoaded", addSwipeListeners);

// Event delegation for image clicks
// (Assuming there is more code here for handling image clicks)
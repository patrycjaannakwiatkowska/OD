// This script is used to update the content of the website dynamically.
// It uses the variables defined in the variables.js file to set the content of the website.

document.addEventListener('DOMContentLoaded', () => {
	// Make script resilient: check for existence of DOM nodes and variables
	try {
		// Set the document title if variable is available
		if (typeof siteTitle !== 'undefined') {
			document.title = siteTitle;
		}

		// Set the site title in the footer
		const siteTitleEl = document.getElementById('site-title');
		if (siteTitleEl) siteTitleEl.textContent = siteTitle || '';

		// Year when the site was published first time.
		const publishFromEl = document.getElementById('publish-year-from');
		if (publishFromEl) publishFromEl.textContent = publishYearFrom || '';

		// Set the current year in the footer
		const currentYearEl = document.getElementById('current-year');
		if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();

		// Update email link dynamically
		const emailElement = document.getElementById("email_link");
		if (emailElement && typeof emailAddress !== 'undefined') {
			emailElement.href = `mailto:${emailAddress}`;
			emailElement.textContent = emailAddress;
		}

		// Update the google maps link (if used)
		const googleMapsElement = document.getElementById("google_maps_link");
		if (googleMapsElement && typeof google_maps_link !== 'undefined') {
			googleMapsElement.href = google_maps_link;
			googleMapsElement.textContent = google_maps_link_button_text || 'Mapa';
		}

		// Update the services link (if used)
		const servicesElement = document.getElementById("services_link");
		if (servicesElement && typeof services_link !== 'undefined') {
			servicesElement.href = services_link;
			servicesElement.textContent = services_link_button_text || 'Usługi';
		}

		// Update the Instagram link (if used)
		const instagramElement = document.getElementById("instagram_link");
		if (instagramElement && typeof instagram_link !== 'undefined') {
			instagramElement.href = instagram_link;
			instagramElement.textContent = instagram_link_button_text || 'Instagram';
		}
	} catch (err) {
		// Don't let one error stop the rest of the page scripts
		console.error('modular_update.js error:', err);
	}
});
// This script is used to update the content of the website dynamically.
// It uses the variables defined in the variables.js file to set the content of the website.

// Set the document title with the help of siteTitle variable from variables.js file (no need to manually enter <title> code on each webpage)
document.title = siteTitle;

// Set the site title in the footer
document.getElementById('site-title').textContent = siteTitle;

// Year when the site was published first time. publishYearFrom is set in the variables.js file
document.getElementById('publish-year-from').textContent = publishYearFrom;

// Set the current year in the footer
document.getElementById('current-year').textContent = new Date().getFullYear();



// Update the email link dynamically
const emailElement = document.getElementById("email_link");
// emailAddress is set in the variables.js file
emailElement.href = `mailto:${emailAddress}`;
emailElement.textContent = emailAddress;

// Update the google maps link (if used)
const googleMapsElement = document.getElementById("google_maps_link");
// google_maps_link and google_maps_link_button_text is set in the variables.js file
googleMapsElement.href = google_maps_link;
googleMapsElement.textContent = google_maps_link_button_text;

// Update the services link (if used)
const servicesElement = document.getElementById("services_link");
// services_link and services_link_button_text is set in the variables.js file
servicesElement.href = services_link;
servicesElement.textContent = services_link_button_text;

// Update the Instagram link (if used)
const instagramElement = document.getElementById("instagram_link");
// instagram_link and instagram_link_button_text is set in the variables.js file
instagramElement.href = instagram_link;
instagramElement.textContent = instagram_link_button_text;
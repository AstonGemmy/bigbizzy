import * as Utils from './utils.js';

const Utility = new Utils.Utility();

//	Includes all html files in corresponding elements
Utility.includeHTML();
//	Loads filter and sort in search result header
Utility.loadRefinementData();

let selected_theme; // Selected visual theme variable
let business_option_id; // Option being selected for view
let preview_HTML_target; // Item being selected for preview
let event_node; // Event delegation target element
let preview_data_object; // preview_data_object object to hold preview data

// Stash out options preview element
const options_preview = Utility.optionsPreview();

// Use ripple effect on all button clicks
Utility.rippleEffect();
	
//	Event delegation block for click event
document.addEventListener('click', function(event) {
	
	// If event has a generated target
	if (event.target) {
		
		// Assign target element
		event_node = event.target;

		//	Items to be considered in the sidebar depending on viewport
		const branding = document.querySelector('.header .branding');	    
		const settings = document.querySelector('.header .settings');	    
		const navLink = document.querySelector('.header .nav-link-container');

		//	Opens sidebar menu on click
		if (event_node.id == "hamburger" || event_node.parentNode.id == 'hamburger') {
									
			//	Sidebar navigate properties for display consideration
			const settings_state = Utility.getCssProperty(settings, 'left');
			const navLink_state = Utility.getCssProperty(navLink, 'left');

			//	If viewport is mobile
			if (Utility.deviceView() == 'mobile') {
				//	If sidebar is hidden, open entire nav link container
				if (navLink_state !== '0px') {
					Utility.showOverlay();
					navLink.classList.remove('hideSettings');
					navLink.classList.add('showSettings');
					branding.classList.remove('hideSettings');
					branding.classList.add('showSettings');
				}
			} else {
				//	If viewport is desktop, open only setting element
				if (settings_state == '-250px') {
					Utility.showOverlay();
					branding.classList.remove('hideSettings');
					branding.classList.add('showSettings');
					settings.classList.remove('hideSettings');
					settings.classList.add('showSettings');
				}
			}
			
			// Close all opened options elements
			Utility.closeOptions({
				preview: 'options-Preview',
				selector: 'options i'
			});

		}

		//	Closes corresponding element and hides overlay on click of any close triggering elements
		if ((event_node.className == "close" || event_node.parentNode.className == "close") || (event_node.id == "overlay") || (event_node.id == "popup-previewClose-btn" || event_node.parentNode.className == "popup-previewClose-btn") || (event_node.className == "overviewClose-btn" || event_node.parentNode.className == "overviewClose-btn")) {
			
			//	If viewport is mobile and .close, #overlay are clicked sidebar is hidden
			//	If viewport is mobile and .overviewClose-btn is clicked, businessOverview-AREA is hidden
			if (Utility.deviceView() == 'mobile') {
				navLink.classList.remove('showSettings');
				navLink.classList.add('hideSettings');
				branding.classList.remove('showSettings');
				branding.classList.add('hideSettings');		
				if (document.querySelector('#businessOverview-AREA')) {
					document.querySelector('#businessOverview-AREA').style.display = 'none';
				}
			} else {
				//	If viewport is desktop and .close, #overlay are clicked sidebar is hidden
				branding.classList.remove('showSettings');
				branding.classList.add('hideSettings');	
				settings.classList.remove('showSettings');
				settings.classList.add('hideSettings');
			}
			
			//	Hides popup-Preview element when any of the selected items are clicked
			document.querySelector('#popup-Preview').style.display = 'none';

			//	Hides overlay
			Utility.hideOverlay();
			
		}

		//	Opens filter or sort elements in mobile viewport
		// This element is only dynamically generated in mobile viewport
		if (event_node.id == 'refine-data-button' || event_node.id == 'refine-data-i' || event_node.id == 'refine-data-span') {
			
			// Remove focus from search field
			document.querySelector('#searchQuery').blur();

			//	Selects the item to be displayed or closed
			const filter_sort = document.querySelector('#filter-sort');

			//	Gets display status of item
			let filter_sort_status = Utility.getCssProperty(filter_sort, 'display');

			//	Display this item
			//	If selected item is hidden, display it
			if (filter_sort_status == 'none') {
				filter_sort.style.display = 'block';
			} else if (filter_sort_status == 'block') {
				filter_sort.style.display = 'none';
			}
			
			// Close all opened options elements
			Utility.closeOptions({
				preview: 'options-Preview',
				selector: 'options i'
			});
			
		}

		//	Focuses on the search input field on click
		if (event_node.className == 'triggerSearch-header' || event_node.parentNode.className == 'triggerSearch-header') {
			//	Focus on search field
			document.querySelector('#searchQuery').focus();
		}
		
		// Triggers fullscreen mode toggle
		if (event_node.className == 'fscreenToggle-header' || event_node.parentNode.className == 'fscreenToggle-header') {
			//	Remove focus from search field
			document.querySelector('#searchQuery').blur();
			//	Toggles fullscreen modes
			Utility.toggleFullScreen();			
		}

		//	Changes theme on preferred theme select
		if (event_node.nodeName.toLowerCase() == 'input') {
			
			if (!Utility.targetAncestor({
				event_node: event_node,
				ancestor_id: 'theme-selector'
			}).length == 0) {
				//	Gets theme name from ID of selected radio button
				selected_theme = event_node.getAttribute('id');
				//	If dark theme
				if (selected_theme == 'theme-dark') {
					//	Sets data-theme attribute to seleted theme value
					document.documentElement.setAttribute('data-theme', 'dark');
					//	Save theme variable to dark in localStorage
					localStorage.setItem('theme', 'dark');
				} else if (selected_theme == 'theme-light') { //	If light theme
					//	Sets data-theme attribute to seleted theme value
					document.documentElement.setAttribute('data-theme', 'light');					
					//	Save theme variable to light in localStorage
					localStorage.setItem('theme', 'light');
				}
				//	Gets current background color of DOM element after theme is set
				const theme_color = Utility.getCssProperty(document.documentElement, 'background-color');				
				//	Sets theme color attribute value of meta element to corresponding background color
				document.querySelector('meta[name="theme-color"]').setAttribute('content', theme_color);				
			}

		}
		
		//	Opens preview area on corresponding button click
		if (event_node.id == 'popup-previewOpen-btn' || event_node.parentNode.id == 'popup-previewOpen-btn') {
			
			if (!Utility.targetAncestor({
				event_node: event_node,
				ancestor_id: 'bis_content'
			}).length == 0) {
				
				//	Returns HTML object for which preview data is fetched from data-attribute
				preview_HTML_target = Utility.targetAncestor({
					event_node: event_node,
					ancestor_id: 'bis_content'
				})[0];

				//	Reset preview data object
				preview_data_object = {};

				//	Extracts preview data from all data attributes of selected preview element append then to preview_data_object object
				for (var i in Utility.dataset({elem: preview_HTML_target})) {
					preview_data_object[i] = Utility.dataset({
						elem: preview_HTML_target
					})[i];
				}				
				
				// Run preview event
				Utility.handlePreview({
					data: preview_data_object, // Preview data object
					loader: document.querySelector('#popup-Preview'), // Preview option id
					modal: document.querySelector('#popup-previewContainer'), // Preview container id
					source: 'index'
				});

			}
			
		}

		// Shows options menu when clicked
		if (event_node.className == 'options' || event_node.parentNode.className == 'options') {

			// Get all options seletors
			const option_selectors = document.querySelectorAll('.options i');
			
			if (event_node.className == 'options') {
				//	Gets ID of item to present options for
				business_option_id = event_node.parentNode.id;
				// Set id of currently selected options to its parent id
				event_node.querySelector('i').setAttribute('id', business_option_id);
			} else if (event_node.parentNode.className == 'options') {
				//	Gets ID of item to present options for
				business_option_id = event_node.parentNode.parentNode.id;
				// Set id of currently selected options to its grandparent id
				event_node.setAttribute('id', business_option_id);
			}
			
			options_preview.setAttribute('id', business_option_id);

			option_selectors.forEach(option_selector => {
				if (option_selector.id !== business_option_id) {
					option_selector.setAttribute('class', 'fa fa-ellipsis-v');
				} else {
					if (!option_selector.className.includes('clicked')) {						
						option_selector.setAttribute('class', 'fa fa-times');
						option_selector.classList.add('clicked');
						if (event_node.className == 'options') {
							//	Append optionsPreview object to clicked item parent
							event_node.parentNode.append(options_preview);
						} else if (event_node.parentNode.className == 'options') {
							//	Append optionsPreview object to clicked item parent
							event_node.parentNode.parentNode.append(options_preview);
						}
					} else {
						option_selector.classList.remove('clicked');
						option_selector.setAttribute('class', 'fa fa-ellipsis-v');
						//	Detach optionsPreview object
						options_preview.remove();
					}
				}
			});

		}

	}

});

// Event delegation block for change event
document.addEventListener('change', function(event) {
	
	// If event has a generated target
	if (event.target) {
		
		// Assign target element
		event_node = event.target;

		//	Hides filter or sort item after selection has been made
		if (event_node.nodeName.toLowerCase() == 'select') {
			
			if (!Utility.targetAncestor({
				event_node: event_node,
				ancestor_id: 'filter-sort'
			}).length == 0) {

				//	If viewport is mobile hide refine-data element on option select 
				if (Utility.deviceView() == 'mobile') {
					//	Simulate a click event to close button element
					document.querySelector('#refine-data-button').click();
				}
				
			}

		}

	}
	
});	


// let bannerNode = document.querySelector('[alt="www.000webhost.com"]').parentNode.parentNode;
// bannerNode.parentNode.removeChild(bannerNode);

document.documentElement.addEventListener('click', function(event) {
	if (event.target.className == 'options' || event.target.parentNode.className == 'options' || event.target.className == 'fa fa-ellipsis-v' || event.target.className == 'fa fa-times') {
		return;
	}		
	// Close all opened options elements
	Utility.closeOptions({
		preview: 'options-Preview',
		selector: 'options i'
	});
});
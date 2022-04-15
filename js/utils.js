let $this;

//	Main reuseable Object for general controls and functionalities
export class Utility {
    
    constructor() {
        $this = this;
	}
	
	//	Triggers hiding and revealing headers and bottom bar sections on mobile when scrolling up or down
	scrollify = {
        
        directionObserver: ({cur_scroll_position, scrolled_record}) => {
            if (cur_scroll_position > scrolled_record) {
                return "down";
            }
            return "up";
        },

	}

	// Adds ripple effect on button click
	rippleEffect = () => {
		
		document.querySelectorAll('button').forEach(button => {
			
			button.addEventListener('mousedown', function(e) {
				
				const target = e.target;
				const rect = target.getBoundingClientRect();
				let ripple = target.querySelector('.ripple');
				
				if (ripple) {
					ripple.remove();
				}
				
				ripple = document.createElement('span');
				ripple.className = 'ripple';

				ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + 'px';
				target.appendChild(ripple);
				const top = e.pageY - rect.top - ripple.offsetHeight / 2 - document.body.scrollTop;
				const left = e.pageX - rect.left - ripple.offsetWidth / 2 - document.body.scrollLeft;

				ripple.style.top = top + 'px';
				ripple.style.left = left + 'px';

				return false;
				
			});

		});

	};

	//	Toggles full screen experience
	toggleFullScreen = () => {
		  
		const doc = window.document;
		const docEl = doc.documentElement;

		var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
		var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

		if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
			requestFullScreen.call(docEl);			
		} else {
			cancelFullScreen.call(doc);
		}

		$this.toggleClass(document.querySelector('.fscreenToggle-header i'), {
			class_one: 'fa-expand',
			class_two: 'fa-compress-arrows-alt'
		});
		
	};
	
	dataset = ({elem}) => {
		let attr, dataset_object = {};
		for (let x = 0; x < elem.attributes.length; x++) {
			attr = elem.attributes[x];

			if (/^data-/.test(attr.nodeName)) {
				// attr.nodeName.replace(/-/, '_');
				dataset_object[attr.nodeName.replace(/^data-/, '').replace('-', '_')] = attr.nodeValue;
			}
		}
		return dataset_object;
	};
	
	//  Checks if the filterData_Object object is empty
	objectIsEmpty = ({object}) => {
		//	Loop through all elements in the object
		for(let key in object) {
			//	If any element exist then filter object is not empty
			if (object.hasOwnProperty(key)) {
				//	Object is not empty
				return false;
			}
		}
		//Else Object is empty
		return true;
	};
	
	//	Tracks scroll position of HTML element
	scrolledRecord = ({elem}) => {
        return document.querySelector(`#${elem}`).scrollTop;
	};

	//	Auto reveal NavBar when triggered
	showNavbar = () => {

		const header = document.querySelector('.header');
		const fetch_header = document.querySelector('.fetchHeader');
		
		if ($this.deviceView() !== "mobile") {
			document.documentElement.scrollTo({
                top: 0,
                behaviour: "smooth"
			});
		} else {
            header.classList.remove('hideNavbar');
            header.classList.add('showNavbar');
            fetch_header.classList.remove('hideFetchHeader');
            fetch_header.classList.add('showFetchHeader');
		}
		
	};

	//	Hide navBar on mobile
	hideNavbar = () => {

		const header = document.querySelector('.header');
		const fetch_header = document.querySelector('.fetchHeader');

        header.classList.remove('showNavbar');
        header.classList.add('hideNavbar');
        fetch_header.classList.remove('showFetchHeader');
		fetch_header.classList.add('hideFetchHeader');
		
	};

	//	Auto reveal NavBar when triggered
	showNavbarHideFetchHeader = () => {
		const header = document.querySelector('.header');
		const fetch_header = document.querySelector('.fetchHeader');
		if ($this.deviceView() !== "mobile") {
			document.documentElement.scrollTo({
                top: 0,
                behaviour: "smooth"
			});
		} else {
			header.classList.remove('hideNavbar');
            header.classList.add('showNavbar');
            fetch_header.classList.remove('showFetchHeader');
            fetch_header.classList.add('hideFetchHeader');
		}		
		fetch_header.style.display = 'none';
	};

	//	Auto reveal NavBar when triggered
	pullNavbar_ShowFetchHeader = () => {
		const fetch_header = document.querySelector('.fetchHeader');
		if ($this.deviceView() !== 'mobile') {
			document.documentElement.scrollTo({
				top: 43,
				behavior: 'smooth'
			});
		} else {
			fetch_header.classList.remove('hideFetchHeader');
            fetch_header.classList.add('showFetchHeader');
		}
		fetch_header.style.display = 'block';
	};
		
	//	Loading items placeholder
	loadingPlaceholder = ({id, css, content}) => {
        const elem = document.createElement("div");
        elem.className = css;
        elem.id = id;
		elem.textContent = content;
		return elem;
	};
	
	//	Feedback placeholder
    feedbackPlaceholder = ({id, css, content}) => {
        const elem = document.createElement("div");
        elem.className = css;
        elem.id = id;
		elem.textContent = content;
		return elem;
    };

	//	Viewport observer	//
	//	Checks if viewport is mobile
	deviceView = () => {
		let viewport_width = document.documentElement.clientWidth;
		if (viewport_width < '702') {
			return "mobile";
		} else {
			return "desktop";
		}
	};

	//	Switches between visual themes
	themeSwitch = () => {
		//	If current theme is not empty
		if ($this.currentTheme()) {
			//	Sets data-theme attribute to current theme value
			document.documentElement.setAttribute('data-theme', $this.currentTheme());			
			//	Gets current background color of DOM element after theme is set
			const theme_color = $this.getCssProperty(document.documentElement, 'background-color');			
			//	If dark theme
			if ($this.currentTheme() === 'dark') {
				//	Set radio button of dark theme in sidebar to selected status
				document.querySelector('#theme-selector #theme-dark').setAttribute('checked', true);
				//	Sets theme color attribute value of meta element to corresponding background color
				document.querySelector('meta[name="theme-color"]').setAttribute('content', theme_color);
			} else if ($this.currentTheme() === 'light') {
				//	Set radio button of light theme in sidebar to selected status
				document.querySelector('#theme-selector #theme-light').setAttribute('checked', true);
				//	Sets theme color attribute value of meta element to corresponding background color
				document.querySelector('meta[name="theme-color"]').setAttribute('content', theme_color);
			}
		} else {
			//	Sets theme to light if currentTheme variable is empty
			document.querySelector('#theme-selector #theme-light').setAttribute('checked', true);
			//	Sets theme color attribute value of meta element to corresponding background color
			document.querySelector('meta[name="theme-color"]').setAttribute('content', '');
		}
  };
	
	//	Theme Section	//
	//	Gets cuurent theme from localStorage
	currentTheme = () => {return localStorage.getItem('theme')};
	
	//	Loaders Section	//
    //	Change loader position using class names
    loader = {
      //	Linear loader object
      linear: ({position}) => {
				const loader_object = document.createElement("div");
				const position_object = $this.loader.position;
				for (let key in position_object) {
					if (key == position) {
						loader_object.className = `loader ${position_object[key]}`;
					}
				}            
			
				loader_object.id = "loader"
				const ann = document.createElement("div");
				const ann1 = document.createElement("div");
				const ann2 = document.createElement("div");
				const ann3 = document.createElement("div");

				ann.id = "ann";
				ann1.id = "ann1";
				ann2.id = "ann2";
				ann3.id = "ann3";

				loader_object.appendChild(ann3);
				loader_object.appendChild(ann2);
				loader_object.appendChild(ann1);
				loader_object.appendChild(ann);

				return loader_object;
      },
      
			//	Rotary loader
      rotary: ({position}) => {
				const loader_object = document.createElement("div");
				const position_object = $this.loader.position;
				for (let key in position_object) {
					if (key == position) {
						loader_object.className = `loader-rotary ${position_object[key]}`;
					}
				}
				
				loader_object.id = "loader-rotary"
        const ann = document.createElement("div");
        const ann1 = document.createElement("div");
        const ann2 = document.createElement("div");
        const ann3 = document.createElement("div");

        ann.id = "r-ann";
        ann1.id = "r-ann1";
        ann2.id = "r-ann2";
        ann3.id = "r-ann3";

        loader_object.appendChild(ann3);
        loader_object.appendChild(ann2);
        loader_object.appendChild(ann1);
        loader_object.appendChild(ann);

        return loader_object;
      },

			position: {
				"top": "loader-v-top",
				"middle": "loader-v-middle",
				"bottom": "loader-v-bottom",
			},

    };

	//	Options Section	//
	//	Holds options preview object for appending and displaying
	optionsPreview = () => {
        const options_preview = document.createElement("div");
		options_preview.className = "options-Preview";
		
        for (let i = 0; i < 6; i++) {
			options_preview.innerHTML += (`Favourite </br>`);
		}		
		return options_preview;
	};

	// Serialize form element to an object
	serializeArray = ({form}) => {		
		let serialize = [];
		Array.prototype.slice.call(form.elements).forEach(function(field) {
			if (!field.name || field.disabled || ['file', 'reset', 'submit', 'button'].indexOf(field.type) > -1 ) {
				return;
			}
			if (field.type === 'select-multiple') {
				Array.prototype.slice.call(field.options).forEach(function(option) {
					if (!option.selected) {
						return;
					}
					serialize.push({
						name: field.name,
						value: field.value
					})
				});
				return;
			}
			if (['checkbox', 'radio'].indexOf(field.type) > -1 && !field.checked) {
				return;
			}
			serialize.push({
				name: field.name,
				value: field.value
			})
		});
		return serialize;
	};
	
	//	Data refinement	//
	//	Fetching and displaying data refinement parameters.
	loadRefinementData = () => {
		// Sending AJAX request and fetches JSON format data		
		fetch('refiners.php', {
            method: 'POST',
			mode: 'same-origin',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json', //	Content type sent
				'Accept': 'application/json',	//	Content type expected
				// 'Authorization': 'Basic ' + btoa(username + ':' + password),	//	Authentication credentials
			},
			// POST data body
			body: {},
		}).then(response => response.json())
        .then(response => {
			
			let category = [], name = [], state = [], region = [];

			for (let x = 0; x < response.category.length; x++) {
				category.push(`<option value="${response.category[x]}">${response.category[x]}</option>`);
			}
			for (let x = 0; x < response.name.length; x++) {
				name.push(`<option value="${response.name[x]}">${response.name[x]}</option>`);
			}
			for (let x = 0; x < response.state.length; x++) {
				state.push(`<option value="${response.state[x]}">${response.state[x]}</option>`);
			}
			for (let x = 0; x < response.region.length; x++) {
				region.push(`<option value="${response.region[x]}">${response.region[x]}</option>`);
			}

			//	Refinement data object
            const refinement_data = `
                <div class="fetchHeader fetchHeader-Mobile" id="fetchHeader">
                    <div class="refine-data" id="refine-data">
                        <div class="refine-data-container" id="refine-data-container">
                            <button class="refine-data-button mobile-only" id="refine-data-button"><i class="fa fa-filter" id="refine-data-i"></i> <span id="refine-data-span">Refine</span></button>
                            <form class="filter-sort" id="filter-sort">
                                <div class="filter-header"><i class="fa fa-filter"></i> <span>Filter</span></div>
								
								<div class="select">					
									<label for="category">By Category</label>
									<select name="category" class="" id="category">
										<option value="">Category</option>
										${category}
									</select>
								</div>

								<div class="select">					
									<label for="business_name">By Business Name</label>						
									<select name="business_name" class="" id="business_name">
										<option value="">Business Name</option>
										${name}
									</select>
								</div>

								<div class="select">					
									<label for="state">By State</label>						
									<select name="state" class="" id="state">
										<option value="">State</option>
										${state}
									</select>
								</div>

								<div class="select">					
									<label for="region">By Region</label>						
									<select name="region" class="" id="region">
										<option value="">Region</option>
										${region}
									</select>
								</div>

                                <div class="sort-header"><i class="fa fa-sort-alpha-up"></i> <span>Sort</span></div>
                                <div class="select">
                                    <label>By Order</label><select name="sort" class="" id="sort">
                                        <option value=""> A - Z </option>
                                        <option value="DESC, id"> Newest </option>
                                        <option value="ASC, id"> Oldest </option>
                                        <option value="ASC, business_name"> Business Name (Ascending) </option>
                                        <option value="DESC, business_name"> Business Name (Descending) </option>
                                        <option value="ASC, business_category"> Category (Ascending) </option>
                                        <option value="DESC, business_category"> Category (Descending) </option>
                                        <option value="ASC, region"> Region (Ascending) </option>
                                        <option value="DESC, region"> Region (Descending) </option>
                                        <option value="ASC, state"> State (Ascending) </option>
                                        <option value="DESC, state"> State (Descending) </option>
                                    </select>
                                </div>
                            </form>
                        </div>
                        <div class="triggerSearch mobile-only" id="triggerSearch">
                            <button class="triggerSearch-header"><i class="fa fa-search"></i> <span>Search</span></button>
                        </div>
                        <div class="fscreenToggle mobile-only" id="fscreenToggle">
                            <button class="fscreenToggle-header"><i class="fa fa-expand"></i> <span>Fullscreen</span></button>
                        </div>
                    </div>
                </div>
            `;
            
			// If viewport is mobile, place filter at the bottom of body element
            if ($this.deviceView == "mobile") {			
                document.documentElement.insertAdjacentHTML('beforeend', refinement_data);
            } else {
                //	If viewport is desktop, place filter in top position of searchBusiness-DATA element	
				document.querySelector('#searchBusiness-DATA').insertAdjacentHTML('afterBegin', refinement_data);
            }

        }).catch(error => {
            console.error('An error occured');
        });

	};
	
	//	Files include Section	//
	//	Loads files into corresponding containers
	includeHTML = () => {
		
		let finder, i, elmnt, file, xhttp;
		/* Loop through a collection of all HTML elements: */
		finder = document.getElementsByTagName("*");
		
		for (i = 0; i < finder.length; i++) {
			elmnt = finder[i];
			/*search for elements with a certain atrribute:*/
			file = elmnt.getAttribute("data-include-html");
			
			//	If element has file to be included to it
			if (file) {
				/* Make an HTTP request using the attribute value as the file name: */
				xhttp = new XMLHttpRequest();
				
				//	When XMLHttpRequest is ready
				xhttp.onreadystatechange = function() {
					if (this.readyState == 4) {
						if (this.status == 200) {

							//	Appends data from fetched file to corresponding element
							elmnt.innerHTML = this.responseText;
							
							//	Gets path of currently open page
							const loc = window.location.pathname;

							//	Gets name of currently opened page(just file name without path)
							const pathName = loc.substring(loc.lastIndexOf('/') + 1);

							//	Gets page name without extension(.html, .php etc) format
							const pageName_Class = pathName.substring(0, pathName.indexOf('.'));

							//	Hides header link with href value equivalent to currently opened page name
							document.querySelectorAll('.header .nav-link a').forEach(anchor => {
								if (anchor.href == pathName) {
									anchor.style.display = 'none';
								}
							});

							//	Finds all pageHeaders class and displays that of currently opened page while hiding others
							document.querySelectorAll('.header #pageHeaders *').forEach(page_header => {
								if (page_header.id !== `${pageName_Class}-page-title`) {
									page_header.style.display = "none";
								}
							});

							//	Switch to last activated theme on page load
							$this.themeSwitch($this.currentTheme());
							
						}
						
						//	If requested file is not found append this error message to corresponding element
						if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
						
						/* Remove the attribute, and call this function once more: */
						elmnt.removeAttribute("data-include-html");
						$this.includeHTML();
					}
				};
				
				//	Opens XMLHttpRequest with GET method
				xhttp.open("GET", file, true);
				//	Sends XMLHttpRequest
				xhttp.send();
				/* Exit the function: */
				return;
			}
		}
	};
	
	//	Hides overlay
	hideOverlay = () => {
		document.querySelector('#overlay').style.display = 'none';
	};
	
	//	Shows overlay
	showOverlay = () => {
		document.querySelector('#overlay').style.display = 'block';
	};

	//	Preview Section
	handlePreview = ({data, loader, modal, source}) => {
		
		// Stash a rotary loader object for use
		let rotary_loader_middle = $this.loader.rotary({position: "middle"});
		
		if (source == 'index') {
			//	Show overlay
			$this.showOverlay();
		} else if (source == 'browser') {
			//	If viewport is mobile, show overlay
			if ($this.deviceView() == 'mobile') {
				$this.showOverlay();
			}	
		}

		//	Prepends loader item to middle position of preview element
		loader.append(rotary_loader_middle);
		loader.style.display = "block";
		
		// Previews images
		function loadPreview() {
			
			//	Initiates timer to 5 seconds delay
			let preview_timer = 5000;
			//	Initiates count of all img tags in preview element
			let images_counter = 0;
			
			//	Empty preview container, hide by visibility with HBV class and then displays preview class with preview_data_object object data elements
			modal.innerHTML = '';
			modal.classList.add('HBV');

			if (source == 'index') {
				modal.innerHTML = (`
					<img src="${data.business_image}" class="busImage" alt="${data.business_image}">
					<div class="busName">${data.business_name}</div>
					<div class="busAddress">${data.business_address}</div>
					<div class="busCategory">${data.business_category}</div>
					<a href="#" class="busProfile">View Business Profile</a>
				`);
			} else if (source == 'browser') {
				modal.innerHTML = (`
					<div class="businessGraphics" id="businessGraphics">
						<img src="${data.business_image}" id="businessImage" width="100%" alt="${data.business_name}" class="businessImage">
						<div class="ceoInfo">
							<img src="${data.ceo_picture}" width="100%" alt="${data.ceo_name}" class="ceoPicture">
							<div class="businessName">${data.ceo_name}</div>
							<div class="businessName">${data.business_name}</div>
							<div class="businessAddress">${data.business_address}</div>
							<div class="businessCategory">${data.business_category}</div>
							
							<div class="businessSocialHandles">
								<i class="fab fa-facebook"></i>
								<i class="fab fa-twitter"></i>
								<i class="fab fa-instagram"></i>
								<i class="fab fa-youtube"></i>
							</div>
						</div>
					</div>
					<div class="businessDescription">${data.business_name}</div>
				`);				
			}
			
			//	Gets all images to be loaded
			let all_images = modal.querySelectorAll('img');
			//	Gets count of all images
			let total_images_count = all_images.length;

			all_images.forEach(this_image => {				
				if (this_image.complete && this_image.naturaHeight !== 0) {
					// Increment imageCount as more images loads
					images_counter++;	
				}
			});

			function isLoaded() {
				// Confirm all images are loaded
				if (images_counter == total_images_count) {
					//	Resets timer if all images are loaded
					clearTimeout(isLoadedCheck);
				}
				//	Loads preview
				preview();
			}

			//	Confirm all images are loads with available timer 
			let isLoadedCheck = setTimeout(isLoaded, preview_timer);
			
		}

		//	Calls loadPreview
		loadPreview();
		
		//	display preview
		function preview() {			
			//	Detach loader
			rotary_loader_middle.remove();
			//	Scroll preview container to top
			modal.scrollTo({
				top: 0,
				behaviour: 'smooth'
			});
			// Show preview data information
			modal.classList.remove('HBV');
		}
		
	};
	
	//	Clear options
	closeOptions = ({preview, selector}) => {
		// All selector elements
		const selectors = document.querySelectorAll(`.${selector}`);	
		// Option preview element to be removed when all options are closed
		const preview_elem = document.querySelector(`.${preview}`);
		if (selectors) {
			//	Set all options class data-clicked attr to false, meaning they have not been clicked		
			selectors.forEach(selector => {	
				//	Reset class name of options selector elements class to normal
				selector.setAttribute('class','fa fa-ellipsis-v');
			});
		}
		// Remove preview element from DOM
		if (preview_elem) {
			preview_elem.remove();
		}
	};

	targetAncestor = ({event_node, ancestor_id}) => {
		let target_ancestor = [];
		while (event_node) {
			if (event_node.id == ancestor_id || event_node.className == ancestor_id) {
				target_ancestor.unshift(event_node);
			}
			event_node = event_node.parentElement
		}
		return target_ancestor;
	};
	
	// Toggles between element's CSS class
	toggleClass = (target, {class_one, class_two}) => {
		if (target.className.includes(class_one)) {
			target.classList.remove(class_one);
			target.classList.add(class_two);
		} else if (target.className.includes(class_two)) {
			target.classList.remove(class_two);
			target.classList.add(class_one);
		}
	};

	getCssProperty = (elem, property) => {
		return window.getComputedStyle(elem, null).getPropertyValue(property);
	};

};
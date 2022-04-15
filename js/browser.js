//	Big Bizzy browser js file
//	@author: Aston Gemmy
//	Date: 8th June, 2020
//	License: MIT(lol)
//	Warning: Ensure to understand any 
//		line of code and its linkages
//		before attempting to edit

// Importing Utility class methods
import * as Utils from './utils.js';
// Instantiating Utility class
const Utility = new Utils.Utility();

// Core elements
// Parent element for search query results
const main_data_container = document.querySelector('#searchBusiness-DATA');
// Search results parent container
const search_data_container = main_data_container.querySelector('#data');
// Search footer element for displaying fetching feedback base on received response
const search_data_footer = main_data_container.querySelector('#fetchFooter');
// Scroll top position of search area during scrolling
let response_scrolled_record = main_data_container.scrollTop;
// Parent element for search query actions and results
const search_result_area = document.querySelector('#searchResults-AREA');
	
// Stash loading placeholder element for appending when scrolled to bottom
const loadingPlaceholder = Utility.loadingPlaceholder({
	id: 'loading-more',
	css: 'loading-more',
	content: 'Loading more items!'
});

// Stash feedback placeholder to alert when no more search results are available
const feedbackPlaceholder = Utility.feedbackPlaceholder({
	id: 'endNote',
	css: 'endNote',
	content: 'No more items to be loaded!'
});

// Stash out progress loaders with different positions
const linear_loader_top = Utility.loader.linear({position: 'top'});
const linear_loader_middle = Utility.loader.linear({position: 'middle'});
const linear_loader_bottom = Utility.loader.linear({position: 'bottom'});

let offset = 0;	// Query offset variable
let search_query_fetch_url; // Query data fetch url variable
let action_flag = 'fetch'; // Default query type to be performed
let response_text = ''; // Response text from fetches
let event_node; // Event delegation target element
let filters; // Stash filter variable
let filter_data_object; // Stash serialized filter object variable
let preview_data_object; // preview_data_object object to hold preview data

// Business id of currently logged user
const business_id = parseInt(document.querySelector('#business_id').value);

// Business data object to be sent to server
let business_data = {
	business_id: business_id,
	limit: 15,
	offset: offset,
	search_query: ''
};

// Scrolls 200px to the left on button click
document.querySelector('#arrow-left').addEventListener('click', function() {
	document.querySelector("#fetchHeader").scrollBy({
		left: 200,
		behavior: 'smooth'
	});
});

// Scrolls 200px to the right on button click
document.querySelector('#arrow-right').addEventListener('click', function() {
	document.querySelector("#fetchHeader").scrollBy({
		left: -200,
		behavior: 'smooth'
	});
});

// Event delegation block for change event
document.addEventListener('click', function(event) {

	// If event has a generated target
	if (event.target) {
		
		// Assign target element
		event_node = event.target;

		//	When a result item is selected for view
		if (event_node.className == 'bis_name') {
			
			//	Reset preview data object
			preview_data_object = {};
			
			//	Extracts preview data from all data attributes of selected preview element append then to preview_data_object object
			for (var i in Utility.dataset({elem: event_node})) {
				preview_data_object[i] = Utility.dataset({
					elem: event_node
				})[i];
			}

			// Run preview event
			Utility.handlePreview({
				data: preview_data_object, // Preview data object
				loader: document.querySelector('#businessOverview-AREA'), // Preview option id
				modal: document.querySelector('#businessOverview'), // Preview container id
				source: 'browser'
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

			// Confirm select element is one of the filter or sort fields
			if (!Utility.targetAncestor({
				event_node: event_node,
				ancestor_id: 'filter-sort'
			}).length == 0) {
				
				// Selects filter form for data serialization
				filters = document.querySelector('#filter-sort');
				
				//	Serialises all select fields name and value attribute pair into a javascript object
				filter_data_object = Utility.serializeArray({
					form: filters
				});

				//	Reset offset value
				offset = 0;					
					
				//	If filter object is empty
				if (Utility.objectIsEmpty({
					object: filter_data_object
				})) {

					//	Action to be performed is fetch
					action_flag = 'fetch';

					//	Business data object to be sent to server
					business_data = {
						business_id: business_id,
						limit: 15,
						offset: offset,
						search_query: ''
					};

				} else {
					
					//	Action to be performed is filter action
					action_flag = 'filter';

					//	Append additional data to business_data object from serialized filter object
					Object.entries(filter_data_object).forEach(([key, value]) => {
						business_data[value.name] = value['value'];
					});

				}

				// Fetch search results with declared parameters
				fetchData({
					data: business_data,
					action: action_flag
				});

			}

		}

	}

});
		
//	Setup frontend elements and initiate a POST API call fetching data
const fetchData = ({data, action}) => {
	
	//	Shows loader on page header container
	// document.querySelector('#browser-Header').append(linear_loader_bottom);
	
	//	Empties search result footer container
	search_data_footer.innerHTML = '';
	
	//	Selects URL to fetch data from depending on action_flag value
	if (action == 'fetch') {
		search_query_fetch_url = 'fetch.php';
	} else if (action == 'filter') {
		search_query_fetch_url = 'refine.php';
	}
	
	// Scrolls parent element container to top before fetching
	main_data_container.scrollTo({
		top: 0,
		behavior: 'smooth'
	});

	// Sending request and fetching JSON format data		
	fetch(search_query_fetch_url, {
		method: 'POST',
		mode: 'same-origin',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json', //	Content type sent
			'Accept': 'application/json',	//	Content type expected
			// 'Authorization': 'Basic ' + btoa(username + ':' + password),	//	Authentication credentials
		},
		body: JSON.stringify(data)

	}).then(response => response.json())
	.then(response => {	
		
		//	Hides loader at bottom of search input field
		// linear_loader_bottom.remove();

		//	Empties search results parent container
		search_data_container.innerHTML = '';
		
		//	If response is empty
		if (response == 'No match found') {
			// Handle empty response event
			emptyResponseHandler();
		} else {
			// Handle non empty response event
			successResponseHandler({
				response: response
			});
		}		

	}).catch(error => {
		console.error('Error while fetching data');
	});
	
}

	

// Handles non empty response event
const successResponseHandler = ({response}) => {

	//	Increment search query offest by 15 to offset scrolling update location
	offset += 15;
		
	//	Counts all returned elements
	let search_data_length = response.length;
	
	//	Appends returned JSON data from server to search results parent container
	for (let i = 0; i < search_data_length; i++) {
		
		search_data_container.innerHTML += (`
			<div class="bis_content">
				<div class="bis_image">
					<img src="${response[i].business_data.business_image}" alt="${response[i].business_data.business_name}" width="100%">
				</div>
				<div class="bis_details">
					<a class="bis_name" href="#" data-business-image="${response[i].business_data.business_image}" data-business-name="${response[i].business_data.business_name}" data-business-address="${response[i].business_data.business_address}" data-business-category="${response[i].business_data.business_category}" data-ceo-name="${response[i].business_data.ceo_name}" data-ceo-picture="${response[i].business_data.ceo_profile_picture}">
						${response[i].business_data.business_name}
					</a>
					<div class="bis_address">
						 <i class="fa fa-map-marker-alt"></i>
						   ${response[i].business_data.business_address}
					</div>
					<div class="bis_category">
						${response[i].business_data.business_category}
					</div>
				</div>
				<div class="bis_minor_info" id="${response[i].business_data.id}">
					<div class="options">
						<i class="fa fa-ellipsis-v"></i>
					</div>
						Apr 19
				</div>
			</div>
		`);		
		
	}
	
};

// Handles empty response event
const emptyResponseHandler = () => {
	//	Append empty response feedback text to search results parent container
	search_data_container.innerHTML = (`
		<span class="alert">
			<span class="alert-container">
				No related results for your query.
				<br/><br/>
				If you are sure of entered search string, we suggest, 
				you recheck your filter values combination.
			</span>
		</span>
	`);
};

// Fetch more search query results on parents element scroll to bottom
main_data_container.addEventListener('scroll', function(){
	
	//	Gets current scroll position of parent element container
	let cur_scroll_position = this.scrollTop;

	//	If viewport is mobile, hide or show header and footer on scroll
	if (Utility.deviceView() == 'mobile') {
		if (Utility.scrollify.directionObserver({
			cur_scroll_position: cur_scroll_position,
			scrolled_record: response_scrolled_record
		}) == 'down') {	// If acroll direction is down
			Utility.hideNavbar();
		} else {	// If scroll direction is up
			Utility.showNavbar();
		}
	}

	// Update scroll position variable
	response_scrolled_record = cur_scroll_position;

	// If this element was scrolled to the bottom
	if ( ((this.scrollTop + this.clientHeight) >= this.scrollHeight - 0.8) ) {		
		
		// If last action flag was fetch
		if (action_flag == 'fetch') {
			
			// Append more data by sending business data object to server for search results updates
			business_data = {
				business_id: business_id,
				limit: 15,
				offset: offset,
				search_query: ''
			};

			// Fetch data route url
			search_query_fetch_url = 'fetch.php';

		} else if (action_flag == 'filter') {

			// Append current filter data to business_data object from serialized filter object
			Object.entries(filter_data_object).forEach(([key, value]) => {
				business_data[value.name] = value['value'];
			});

			// Filter function API url
			search_query_fetch_url = 'refine.php';

		}
		
		// If last response from fetch during scroll was non empty response from server
		if (response_text != 'No match found') {
			
			// Detach/Remove feedback placeholder
			feedbackPlaceholder.remove();
			
			// Append loading placeholder and wait for fetch().then block to be called
			search_data_footer.appendChild(loadingPlaceholder);

			//	Shows loader on page header container
			// document.querySelector('#browser-Header').append(linear_loader_bottom);
			
			// Fetch more results from server
			fetch(search_query_fetch_url, {
				method: 'POST',
				mode: 'same-origin',
				credentials: 'same-origin',
				headers: {
					'Content-Type': 'application/json', //	Content type sent
					'Accept': 'application/json',	//	Content type expected
					// 'Authorization': 'Basic ' + btoa(username + ':' + password),	//	Authentication credentials
				},
				body: JSON.stringify(business_data)
			}).then(response => response.json())
			.then(response => {
				
				// Detache/Remove loader from bottom of search input field
				linear_loader_bottom.remove();

				// Update response_text variable to equal response
				response_text = response;

				// Detach/Remove loading feedback placeholder at bottom of results container
				loadingPlaceholder.remove();
				
				// If non empty response
				if (response !== 'No match found') {
					
					// Handles response data
					successResponseHandler({
						response: response
					});

				} else {

					// Checks if end of response notification has been set
					// This is set once an empty response has been received
					if (search_data_footer.querySelectorAll('#endNote').length != 1) {
						// If not, set end of returned data notification
						search_data_footer.appendChild(feedbackPlaceholder);								
					}

				}
				
			}).catch(error => {
				console.error('Error while fetching data');
			});
		
		} else {
			
			// Reset response_text
			response_text = '';
			
		}
		
	} else {

		// Detach/Remove feedback placeholder
		feedbackPlaceholder.remove();

	}
	
});

// Fetch businesses using provided parameters on page load
fetchData({
	data: business_data,
	action: action_flag
});
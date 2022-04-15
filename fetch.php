<?php
	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//																																																								//
	//	@author: Aston Gemmy | astongemmy@gmail.com | 08103561805																											//
	//	Created: 25th February, 2020																																									//
	//	Description: This document provides get functionality for database resource.																	//
	//	Warning: Do not delete any line of code in this document.																											//
	//																																																								//
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	// Set application content header object
	header("Content-Type: application/json");
	
	// Stash headers content type
	$content_type = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';

	// // Confirm content type is json application
	if ($content_type === "application/json") {		
		//	Imports the user class file
		require_once 'class.functionality.php';
		//	Instantiates the video class
		$fetchInstance = new DATA();
		// Decoded json data
		$decoded_data = json_decode(trim(file_get_contents("php://input")), true);
		if (is_array($decoded_data)) {
			//	This block of code processes and sends business data for display
			if (isset($decoded_data['business_id'], $decoded_data['limit'], $decoded_data['offset'], $decoded_data['search_query'])) {
				$limit = test_input($decoded_data['limit']);
				$offset = test_input($decoded_data['offset']);
				$search_query = test_input($decoded_data['search_query']);
				$business_id = test_input($decoded_data['business_id']);
				
				if ($search_query == '' && $business_id == '') {
					//normal fetchData Query for non logged in users
					$queryString = base64_encode("SELECT * FROM sellers_data ORDER BY id DESC LIMIT {$limit} OFFSET {$offset}");
				} else if ($search_query == '' && $business_id != '') {
					//normal fetchData Query for logged in users
					$queryString = base64_encode("SELECT * FROM sellers_data WHERE id != '{$business_id}' ORDER BY id DESC LIMIT {$limit} OFFSET {$offset}");
				} else if ($search_query != '' && $business_id == '') {
					//search fetchData Query for non logged in users
					$queryString = base64_encode("SELECT * FROM sellers_data WHERE keywords LIKE '%{$search_query}%' OR business_category LIKE '%{$search_query}%' OR business_name LIKE '%{$search_query}%' ORDER BY keywords ASC LIMIT {$limit} OFFSET {$offset}");
				} else if ($search_query != '' && $business_id != '') {
					//search fetchData Query for logged in users
					$queryString = base64_encode("SELECT * FROM sellers_data WHERE id != '{$business_id}' AND keywords LIKE '%{$search_query}%' OR business_category LIKE '%{$search_query}%' OR business_name LIKE '%{$search_query}%' ORDER BY keywords ASC LIMIT {$limit} OFFSET {$offset}");
				}
				
				$fetchInstance->fetchBD($queryString);			
			}
		}
	}
	
	function test_input($data) {
		$data = trim($data);
		$data = stripslashes($data);
		$data = htmlspecialchars($data);
		$data = htmlentities(strip_tags($data), ENT_QUOTES);
		return $data;
	}

?>
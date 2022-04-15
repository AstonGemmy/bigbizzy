<?php
	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//																																																								//
	//	@author: Aston Gemmy | astongemmy@gmail.com | 08103561805																											//
	//	Created: 25th February, 2020																																									//
	//	Description: This document provides filter functionality for database resource.																//
	//	Warning: Do not delete any line of code in this document.																											//
	//																																																								//
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	// Set application content header object
	header("Content-Type: application/json");
	
	// Stash headers content type
	$content_type = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';

	// Confirm content type is json application
	if ($content_type === "application/json") {
		//	Imports the user class file
		require_once 'class.functionality.php';
		//	Instantiates the video class
		$fetchInstance = new DATA();		
		// Decoded json data
		$decoded_data = json_decode(trim(file_get_contents("php://input")), true);

		if (is_array($decoded_data)) {			
			//	This block of code processes and sends business data for display
			if (isset($decoded_data['category'], $decoded_data['business_id'], $decoded_data['business_name'], $decoded_data['state'], $decoded_data['offset'], $decoded_data['limit'], $decoded_data['search_query'], $decoded_data['sort'])) {
				$limit = $decoded_data['limit'];
				$offset	= $decoded_data['offset'];
				$business_id = $decoded_data['business_id'];
				$search_query = $decoded_data['search_query'];
				$sort = $decoded_data['sort'];
				
				if (!empty($sort)) {
					$sort = explode(",", $sort);
					$order = " ORDER BY " .$sort[1]. " " .$sort[0];
				} else {
					$order = " ORDER BY keywords ASC ";
				}
				
				$filter_array = array(				
					"business_category" => $decoded_data['category'],
					"business_name" 	=> $decoded_data['business_name'],
					"state" 			=> $decoded_data['state'],
					"region" 			=> $decoded_data['region'],
				);
				
				foreach ($filter_array as $key => $value) {
					if ($value != '') {
						$non_empty_filters[] = array(
							$key => $value,
						);
					}
				}
				
				if (isset($non_empty_filters)) {					
					$query_string_columns = json_encode($non_empty_filters);					
					$query_string_columns = str_replace(']', "'",
						(str_replace('[', "",
						(str_replace('"', "",
						(str_replace('",', "' AND ",
						(str_replace('}', "",
						(str_replace('{', "",
						(str_replace('":"', " = '",
						$query_string_columns))))))))))))
					);					
					$filter_sort_string = "{$query_string_columns}{$order}";					
					if ($search_query == '' && $business_id == '') {
						$query_string = base64_encode("SELECT * FROM sellers_data WHERE {$filter_sort_string} LIMIT {$limit} OFFSET {$offset}");
					} else if ($search_query =='' && $business_id != '') {
						$query_string = base64_encode("SELECT * FROM sellers_data WHERE id != '{$business_id}' AND {$filter_sort_string} LIMIT {$limit} OFFSET {$offset}");
					} else if ($search_query != '' && $business_id == '') {
						$query_string = base64_encode("SELECT * FROM sellers_data WHERE ( keywords LIKE '%{$search_query}%' AND ( {$query_string_columns} )) OR ( business_category LIKE '%{$search_query}%' AND ( {$query_string_columns} )) OR ( business_name LIKE '%{$search_query}%' AND ( {$query_string_columns} )) {$order} LIMIT {$limit} OFFSET {$offset}");
					} else if ($search_query != '' && $business_id != '') {
						$query_string = base64_encode("SELECT * FROM sellers_data WHERE ( id != '{$business_id}' AND ( (keywords LIKE '%{$search_query}%' AND ( {$query_string_columns} )) OR ( business_category LIKE '%{$search_query}%' AND ( {$query_string_columns} )) OR ( business_name LIKE '%{$search_query}%' AND ( {$query_string_columns} )))) {$order} LIMIT {$limit} OFFSET {$offset}");
					}					
				} else {					
					if ($search_query == '' && $business_id == '') {
						$query_string = base64_encode("SELECT * FROM sellers_data {$order} LIMIT {$limit} OFFSET {$offset}");
					} else if ($search_query =='' && $business_id != '') {
						$query_string = base64_encode("SELECT * FROM sellers_data WHERE id != '{$business_id}' {$order} LIMIT {$limit} OFFSET {$offset}");
					} else if ($search_query != '' && $business_id == '') {
						$query_string = base64_encode("SELECT * FROM sellers_data WHERE (keywords LIKE '%{$search_query}%') OR (business_category LIKE '%{$search_query}%') OR (business_name LIKE '%{$search_query}%') {$order} LIMIT {$limit} OFFSET {$offset}");
					} else if ($search_query != '' && $business_id != '') {
						$query_string = base64_encode("SELECT * FROM sellers_data WHERE ( id != '{$business_id}' AND ( (keywords LIKE '%{$search_query}%') OR (business_category LIKE '%{$search_query}%') OR (business_name LIKE '%{$search_query}%'))) {$order} LIMIT {$limit} OFFSET {$offset}");
					}					
				}
				http_response_code(200);
				$fetchInstance->fetchBD($query_string);				
			} else {
				http_response_code(404);
			}
		} else {
			http_response_code(400);
		}	
	}

	function testInput($data) {
		$data = trim($data);
		$data = stripslashes($data);
		$data = htmlspecialchars($data);
		$data = htmlentities(strip_tags($data), ENT_QUOTES);
		return $data;
	}

?>
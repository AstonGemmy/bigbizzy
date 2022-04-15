<?php
	//	Imports the controller class file
	require_once 'class.functionality.php';
	//	Instantiates the DATA class
	$fetchInstance = new DATA();
	$refinementData = array();
	$refinementData["category"] = $fetchInstance->fetchCategories();				
	$refinementData["name"] = $fetchInstance->fetchBisName();
	$refinementData["state"] = $fetchInstance->fetchStates();
	$refinementData["region"] = $fetchInstance->fetchRegion();
	echo json_encode($refinementData);	
?>
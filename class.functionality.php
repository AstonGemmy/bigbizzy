<?php
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//																																																									//
	//	@author: Aston Gemmy | astongemmy@gmail.com | 08103561805																												//
	//	Created: 5th February, 2020																																											//
	//	Description: This is the functionality class document.																													//
	//		This document contains functions and constructors for making MySQL queries with the database									//
	//		It is the main entry point for running this entire setup and as such, no content here should be changed				//
	//	Warning: Do not delete any line of code in this document.																												//
	//																																																									//
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	//	Imports database connection file for use
	require_once 'dbconfig.php';
	
	//	Main Class
	class DATA {

		private $conn;
		public function __construct() {
			$database = new Database();
			$db = $database->dbConnection();
			$this->conn = $db;
		}
		
		public function runQuery($sql) {			
			$stmt = $this->conn->prepare($sql);
			return $stmt;		
		}
		
		public function lasdID() {			
			$stmt = $this->conn->lastInsertId();
			return $stmt;		
		}
		
		//	UPLOADERS
		//	video upload function
		public function uploadVideo($videoFileSize,$videoTutor,$videoDate,$videoFileTitle,$videoCategory) {			
			try {				
				$stmt = $this->conn->prepare("INSERT INTO tbl_tabe_videos(videoSize,videoTutor,videoDate,videoFileTitle,videoCategory) VALUES(:v_size, :v_tutor, :v_date, :v_file, :v_category)");			
				$stmt->bindparam(":v_category",$videoCategory);
				$stmt->bindparam(":v_size",$videoFileSize);
				$stmt->bindparam(":v_tutor",$videoTutor);
				$stmt->bindparam(":v_date",$videoDate);
				$stmt->bindparam(":v_file",$videoFileTitle);			
				$stmt->execute();				
				return $stmt;				
			} catch(PDOException $ex) {				
				echo $ex->getMessage();			
			}
		
		}
		
		//	EDITORS
		//	Business data editor function
		public function editBD($videoID,$editVideosTitle,$editVideosTutor,$editVideosDate,$editVideosCategory) {			
			try {				
				$stmt = $this->conn->prepare('UPDATE tbl_tabe_videos SET videoTutor=:v_tutor, videoDate=:v_date, videoFileTitle=:v_file, videoCategory=:v_category WHERE videoID=:vid');			
				$stmt->bindparam(':v_category',$editVideosCategory);
				$stmt->bindparam(':v_tutor',$editVideosTutor);
				$stmt->bindparam(':v_date',$editVideosDate);
				$stmt->bindparam(':v_file',$editVideosTitle);
				$stmt->bindparam(':vid',$videoID);
				$stmt->execute();
				return $stmt;				
			} catch(PDOException $ex) {				
				echo $ex->getMessage();			
			}		
		}
		
		//	SELECTOR
		//	All business categories fetching function
		public function fetchCategories() {			
			try {			
				$queryString = "SELECT DISTINCT business_category FROM sellers_data ORDER BY business_category ASC";
				$stmt = $this->conn->prepare($queryString);
				$stmt->execute();
				if (!$stmt->rowCount() == 0) {
					$business_category = array();
					while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
						$business_category[] = $row["business_category"];
					}
					return $business_category;
				}
			} catch(PDOException $ex) {
				echo $ex->getMessage();
			}
		}
		
		//	All business states fetching function
		public function fetchStates() {			
			try {			
				$queryString = "SELECT DISTINCT state FROM sellers_data ORDER BY state ASC";				
				$stmt = $this->conn->prepare($queryString);
				$stmt->execute();				
				if (!$stmt->rowCount() == 0) {					
					$state = array();
					while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
						$state[] = $row["state"];
					}
					return $state;					
				}				
			} catch(PDOException $ex) {			
				echo $ex->getMessage();		
			}
		}
		
		//	All business names fetching function
		public function fetchBisName() {			
			try {
				$queryString = "SELECT DISTINCT business_name FROM sellers_data ORDER BY business_name ASC";				
				$stmt = $this->conn->prepare($queryString);
				$stmt->execute();				
				if (!$stmt->rowCount() == 0) {					
					$business_name = array();
					while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
						$business_name[] = $row["business_name"];
					}
					return $business_name;					
				}				
			} catch(PDOException $ex) {			
				echo $ex->getMessage();
			}			
		}
		
		//	All business regions fetching function
		public function fetchRegion() {
			try {
				$queryString = "SELECT DISTINCT region FROM sellers_data ORDER BY region ASC";				
				$stmt = $this->conn->prepare($queryString);
				$stmt->execute();
				if (!$stmt->rowCount() == 0) {					
					$region = array();
					while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
						$region[] = $row["region"];
					}
					return $region;					
				}				
			} catch(PDOException $ex) {
				echo $ex->getMessage();
			}			
		}
		
		//	All business keywords fetching function
		public function fetchKeywords() {			
			try {			
				$queryString = "SELECT DISTINCT keywords FROM sellers_data ORDER BY keywords ASC";				
				$stmt = $this->conn->prepare($queryString);
				$stmt->execute();				
				if (!$stmt->rowCount() == 0) {					
					// echo "<div class='select'><select name='keywords' class='' id='keywords'>						
					// 	<option value=''>Keywords</option>";
						$keywords = array();
						while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {							
							$keywords[] = $row["keywords"];
							// echo "<option value='{$keywords}'>{$keywords}</option>";							
						}					
					// echo "</select></div>";
					return $keywords;					
				}				
			} catch(PDOException $ex) {			
				echo $ex->getMessage();		
			}			
		}
		
		//	All business keywords fetching function
		public function updateKeywords() {			
			try {			
				$queryString = "SELECT * FROM sellers_data";				
				$stmt = $this->conn->prepare($queryString);
				$stmt->execute();				
				if (!$stmt->rowCount() == 0) {					
					while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {						
						$keywords = ucfirst(trim($row["keywords"]));
						$id = $row["id"];						
						$stmt_keyword = $this->conn->prepare("UPDATE sellers_data SET keywords=:k_word WHERE id='{$id}'");
						$stmt_keyword->bindparam(':k_word',$keywords);
						$stmt_keyword->execute();						
					}					
				}
			} catch(PDOException $ex) {			
				echo $ex->getMessage();		
			}			
		}
		
		//	Business items fetching function
		public function fetchBD($queryString) {			
			try {				
				$queryString = base64_decode($queryString);				
				$stmt = $this->conn->prepare($queryString);
				$stmt->execute();
				if (!$stmt->rowCount() == 0) {					
					while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {						
						$businesses[] = array(						
							"business_data" => array(
								"id" 					=> $row["id"],
								"ceo_name" 				=> $row["ceo_name"],
								"ceo_profile_picture" 	=> $row["ceo_profile_picture"],
								"ceo_phone_no" 			=> $row["ceo_phone_no"],
								"business_name" 		=> $row["business_name"],
								"business_address" 		=> $row["business_address"],
								"business_image" 		=> $row["business_image"],
								"business_overview" 	=> $row["business_overview"],
								"business_email" 		=> $row["business_email"],
								"business_category" 	=> $row["business_category"],
								"state" 				=> $row["state"],
								"website" 				=> $row["website"],
								"keywords" 				=> $row["keywords"],
								"subscription_status" 	=> $row["subscription_status"]
							)							
						);
					}					
					echo json_encode($businesses);					
				} else {					
					echo json_encode('No match found');					
				}
			} catch(PDOException $ex) {				
				echo $ex->getMessage();			
			}		
		}
		
		//	Business profile data fetching function
		public function fetchPD($queryString) {			
			try {				
				$queryString = base64_decode($queryString);				
				$stmt = $this->conn->prepare($queryString);
				$stmt->execute();				
				if (!$stmt->rowCount() == 0) {					
					while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {						
						$profile[] = array(						
							"business_data" => array(
								"id" 					=> $row["id"],
								"ceo_name" 				=> $row["ceo_name"],
								"ceo_profile_picture" 	=> $row["ceo_profile_picture"],
								"ceo_phone_no" 			=> $row["ceo_phone_no"],
								"business_name" 		=> $row["business_name"],
								"business_address" 		=> $row["business_address"],
								"business_image" 		=> $row["business_image"],
								"business_overview" 	=> $row["business_overview"],
								"business_email" 		=> $row["business_email"],
								"business_category" 	=> $row["business_category"],
								"state" 				=> $row["state"],
								"website" 				=> $row["website"],
								"keywords" 				=> $row["keywords"],
								"subscription_status" 	=> $row["subscription_status"],
							)							
						);
					}					
					echo json_encode($profile);					
				}
			} catch(PDOException $ex) {				
				echo $ex->getMessage();			
			}		
		}
		
		//	DELETORY
		//	Business data delete function
		public function deleteBD($deleteID) {			
			try {				
				$deleteStatus = 'Y';
				$deleteID_count = count($deleteID);				
				foreach ($deleteID as $key => $value) {					
					$stmt = $this->conn->prepare('UPDATE sellers_data SET isDeleted=:b_delete_status WHERE id=:bid');					
					$stmt->bindparam(':b_delete_status',$deleteStatus);
					$stmt->bindparam(':bid',$value);					
					$stmt->execute();					
				}				
				if ($deleteID_count > 1) {
					echo "<div class='text-green'> {$deleteID_count} items deleted Successfully</div>";
				} else {
					echo "<div class='text-green'> {$deleteID_count} item deleted Successfully</div>";
				}
			} catch(PDOException $ex) {
				echo $ex->getMessage();
			}
		}
	}
	
?>
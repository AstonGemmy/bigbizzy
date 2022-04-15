<?php
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//																																																									//
	//	@author: Aston Gemmy | astongemmy@gmail.com | 08103561805																												//
	//	Created: 25th February, 2020																																										//
	//	Description: This is the MySQL database connection document.																										//
	//		This document contains function and construct for establishing connection to MySQL database										//
	//	Warning: Do not delete any line of code in this document																												//
	//																																																									//
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	//	Database class
	class Database {		
		//	Database connection variables
		private $host = "localhost";
		private $db_name = "bigbizzy";
		private $username = "root";
		private $password = "@kleezpass01";
		public $conn;		
		//	Database connection function
		public function dbConnection() {
			$this->conn = null;
			try	{				
				$this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
				$this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);			
			} catch(PDOException $exception) {				
				echo "Connection error: " . $exception->getMessage();			
			}			
			return $this->conn;			
		}		
	}	
?>
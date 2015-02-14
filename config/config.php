<?php
/*
*	Database credentials -- store in safe spot
*/


function getConnection(){
	$dbhost = "localhost";
	$dbuser = "root";
	$dbpass = "root";
	$dbname = "city-demo";
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
}
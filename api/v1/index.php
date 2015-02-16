<?php



require '../../vendor/autoload.php';
require '../../config/config.php';

getConnection();

$app = new \Slim\Slim();


$app->get('/states/:id', 'getStateCities');
$app->get('/states/:id/cities', 'getCitiesCentiRadius');

$app->get('/users', 'getUsers');
$app->get('/users/:id/visits', 'getUserVisits');
$app->post('/users/:id/visits', 'postUserVisits');

$app->run();


function getStateCities($id) {

    $db = getConnection();

    $cities = $db->prepare("SELECT id, name, state
        FROM  cities
        WHERE state = :state
        ORDER BY name
    ");

    $cities->bindValue(':state', $id);

    try {
        $cities->execute();
        $cities_result = $cities->fetchAll(PDO::FETCH_OBJ);
         echo json_encode($cities_result);
    } catch(PDOException $e)
    {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getCitiesCentiRadius($id) {

    $db = getConnection();

    $city =  $db->prepare("SELECT latitude, longitude
        FROM cities
        WHERE id = :id");

    $city->bindValue(':id', $id);

    try {
        $city->execute();
        $city_result = $city->fetch();
    } catch (PDOException $e) {
        die($e->getMessage());
    }

    $lat = $city_result['latitude'];
    $lon = $city_result['longitude'];
    
    $sf = 3.14159 / 180; // scaling factor
    $er = 6350; // earth radius in miles, approximate
    $mr = 100; // max radius
    $near = $db->prepare("SELECT name, id
        FROM cities 
        WHERE $mr >= $er * ACOS(SIN(latitude*$sf)*SIN($lat*$sf) + COS(latitude*$sf)*COS($lat*$sf)*COS((longitude-$lon)*$sf))
        ORDER BY ACOS(SIN(latitude*$sf)*SIN($lat*$sf) + COS(latitude*$sf)*COS($lat*$sf)*COS((longitude-$lon)*$sf))");
 
    try {
        $near->execute();
        $near_result = $near->fetchAll(PDO::FETCH_OBJ);
        echo json_encode($near_result);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getUsers() {

    $db = getConnection();

    $users = $db->prepare("SELECT id, first_name, last_name
        FROM users
        ORDER BY id
    ");

    try {
        $users->execute();
        $users_result = $users->fetchAll(PDO::FETCH_OBJ);
        echo json_encode($users_result);
    }
    catch(PDOException $e)
    {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getUserVisits($id) {

    $db = getConnection();
    $user = $db->prepare("SELECT name
        FROM `users`, `cities`, `user_visits`
        WHERE `users`.`id` = :user_id
        AND `user_visits`.`user_id_fk` = `users`.`id`
        AND `user_visits`.`city_id_fk` = `cities`.`id`
    ");
    $user->bindValue(':user_id', $id);
    try {
        $user->execute();
        $user_result = $user->fetchAll(PDO::FETCH_OBJ);
        echo json_encode($user_result);
    } catch(PDOException $e)
    {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    } 
}


function postUserVisits($id) {

    $request = \Slim\Slim::getInstance()->request()->post();

    $city_id = json_decode($request['cityid']);

    $sql = "INSERT INTO user_visits (user_id_fk, city_id_fk) 
    VALUES (:user_id_fk, :city_id_fk)";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam(":user_id_fk", $id);
        $stmt->bindParam(":city_id_fk", $city_id);
        $stmt->execute();
        $db = null;
        
    } catch(PDOException $e) {
        header('HTTP/1.0 404 Not Found');
        echo '{"error":{"text":'. $e->getMessage() .'}}';
        exit();
    }
}
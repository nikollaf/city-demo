<?php



require '../../vendor/autoload.php';
require '../../config/config.php';

getConnection();

$app = new \Slim\Slim();


$app->get('/states/:id', 'getStateCities');
$app->get('/state/:id/cities', 'getCitiesCentiRadius');

$app->get('/users', 'getUsers');
$app->get('/users/:id/visits', 'getUserVisits');
// $app->post('/users/:id/visits', 'postUserVisits');

$app->run();


function getStateCities($id) {

    $db = getConnection();

    $cities = $db->prepare("SELECT id, name, state
        FROM  cities
        WHERE state = :state
        ORDER BY name
    ");


    $cities->bindValue(':state', $id);

    try
    {
        $cities->execute();
        $cities_result = $cities->fetchAll(PDO::FETCH_OBJ);
    }
    catch(PDOException $e)
    {
        die($e->getMessage());
    }

    echo json_encode($cities_result);
}

function getCitiesCentiRadius($id) {

    $db = getConnection();

    $city =  $db->prepare("SELECT latitude, longitude
        FROM cities
        WHERE id = :id");

    $city->bindValue(':id', $id);

    try{
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
    $near = $db->prepare("SELECT * 
        FROM cities 
        WHERE $mr >= $er * ACOS(SIN(latitude*$sf)*SIN($lat*$sf) + COS(latitude*$sf)*COS($lat*$sf)*COS((longitude-$lon)*$sf))
        ORDER BY ACOS(SIN(latitude*$sf)*SIN($lat*$sf) + COS(latitude*$sf)*COS($lat*$sf)*COS((longitude-$lon)*$sf))");
 
    try{
        $near->execute();
        $near_result = $near->fetchAll(PDO::FETCH_OBJ);
    } catch(PDOException $e) {
        die($e->getMessage());
    }

    echo json_encode($near_result);
}

function getUsers() {

    $db = getConnection();

    $users = $db->prepare("SELECT id, first_name, last_name
        FROM users
        ORDER BY id
    ");

    try
    {
        $users->execute();
        $users_result = $users->fetchAll(PDO::FETCH_OBJ);
    }
    catch(PDOException $e)
    {
        die($e->getMessage());
    }

    echo json_encode($users_result);

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
    try
    {
        $user->execute();
        $user_result = $user->fetchAll(PDO::FETCH_OBJ);
    }
    catch(PDOException $e)
    {
        die($e->getMessage());
    }

    echo json_encode($user_result);
}
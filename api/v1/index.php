<?php



require '../../vendor/autoload.php';
require '../../config/config.php';

getConnection();

$app = new \Slim\Slim();


$app->get('/states/:id', 'getStateCities');
// $app->get('/state/:id/cities?radius=100', 'getCitiesCentiRadius');

$app->get('/', 'getStateCities');


// $app->get('/users/:id/visits', 'getUserVisits');
// $app->post('/users/:id/visits', 'postUserVisits');

$app->run();


function getStateCities($id) {

    $db = getConnection();

    $cities = $db->prepare("SELECT *
        FROM 
            cities
        WHERE state = :state
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
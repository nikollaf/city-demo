
if (window.location.host  == 'localhost') {
    var rootURL = window.location.protocol + '//' + window.location.host + "/city-demo/api/v1/";
} else {
    var rootURL = window.location.protocol + '//' + window.location.host + "/api/v1/";
}

console.log(rootURL);

function findCitiesByState(id) {

	$.ajax({
		type: 'GET',
		url: rootURL + 'states/' + id,
        contentType: 'application/json',
		dataType: "json",
		success: function(data){
            $(data).each(function(index, object) {
                 $('#city-list')
                     .append('<a href="city.php?id=' + object.id + '" title="View cities within a 100 mile radius" class="list-group-item">' + object.name + '</a>');
            })

            $('#city-list').quickPagination({
                pageSize: 15
            });
		},
        error: function(jqXHR, textStatus, errorThrown){
            alert('There is an error with the servers. Please try again later');
        }
	});
}

function findNearCities() {

    var id = getParameterByName('id');

    $.ajax({
        type: 'GET',
        url: rootURL + 'states/' + id + '/cities',
        contentType: 'application/json',
        dataType: "json",
        success: function(data){
            $(data).each(function(index, object) {
                 $('#near-cities')
                     .append('<button title="Have you visited this city?" value="' + object.id + '" id="visitedcity" class="list-group-item">' + object.name + '<span class="label label-success">Visited</span></button>');
            })

            $('#near-cities').quickPagination({
                pageSize: 20
            });
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('There is an error with the servers. Please try again later');
        }
    });
}


function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// find which cities the user has visited

function findUserVisits(id) {

    $.ajax({
        type: 'GET',
        url: rootURL + 'users/' + id + '/visits',
        contentType: 'application/json',
        dataType: "json",
        success: function(data){
            $(data).each(function(index, object) {

                var count = index + 1;
                $('#visit-list')
                    .append('<ol title="View cities within a 100 mile radius">' + '<strong>' + count + '</strong>. ' + object.name + '</ol>');
            })

            $('#visit-list').quickPagination({
                pageSize: 20
            });
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('There is an error with the servers. Please try again later');
        }
    });
}

// call all users

function getUsers(){
    $.ajax({
        type: 'GET',
        url: rootURL + 'users',
        contentType: 'application/json',
        dataType: "json",
        success: function(data){
            $(data).each(function(index, object) {
                $('#user-list')
                    .append('<li><button value="' + object.id +  '" title="View the cities this user has visited" class="list-group-item">' + object.first_name + ' ' + object.last_name + '</button></li>');
            })
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('There is an error with the servers. Please try again later');
        }
    });
}

// post user visits

function postUserVisit(cityId){

    // your user id, normally this will be a SESSION id
    var id = 1;

    var cityid = JSON.stringify(cityId);

    $.ajax({
        type: 'POST',
        url: rootURL + 'users/' + id + '/visits',   
        data: { cityid: cityid },
        success: function(){
            alert('Great! Your post has been submitted!');
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('You have already visited this city!');
        }
    });
}

$(document).ready(function() {

    if($('#user-page').length > 0) {
        getUsers();
    }

    if ($('#near-city-page').length > 0) {
        findNearCities();
    }
    

    $('#states li button').on('click', function() {

        // clear previous data
        $('#city-list').html('');
        $('#cities h1 span').html('');

        // call ajax function
        findCitiesByState($(this).val());

        // show state
        $('#cities h1 span').append($(this).val());
    });

    
    $('#user-page').on('click', '#user-list li button',function() {
      
        // clear previous data
        $('#visit-list').html('');

        // call ajax function
        findUserVisits($(this).val());

    });

    // allows user to click which city he has visited
    $('#near-city-page').on('click', '#visitedcity', function(e) {
        
        postUserVisit($(this).val());
    });
    

});


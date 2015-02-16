
var rootURL = "http://localhost:8888/city-demo/api/v1/";



function findCitiesByState(id) {

	$.ajax({
		type: 'GET',
		url: rootURL + 'states/' + id,
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
        url: rootURL + 'state/' + id + '/cities',
        dataType: "json",
        success: function(data){
            $(data).each(function(index, object) {
                 $('#near-cities')
                     .append('<a href="city.php?id=' + object.id + '" title="View cities within a 100 mile radius" class="list-group-item">' + object.name + '</a>');
            })

            $('#near-cities').quickPagination({
                pageSize: 30
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
        dataType: "json",
        success: function(data){
            $(data).each(function(index, object) {

                var count = index + 1;
                $('#visit-list')
                    .append('<li title="View cities within a 100 mile radius" class="list-group-item">' + '<strong>' + count + '</strong>. ' + object.name + '</li>');
            })

            console.log(data);

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
        console.log('clicked');
        // clear previous data
        $('#visit-list').html('');

        // call ajax function
        findUserVisits($(this).val());

        // show state
        //$('#cities h1 span').append($(this).val());
    });
    

});


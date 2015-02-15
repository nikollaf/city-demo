
var rootURL = "http://localhost/city-demo/api/v1/";



function findCitiesByState(id) {

	$.ajax({
		type: 'GET',
		url: rootURL + 'states/' + id,
		dataType: "json",
		success: function(data){
            $(data).each(function(index, object) {
                 $('#city-list')
                     .append('<li title="View cities within a 100 mile radius" class="list-group-item">' + object.name + '</li>');
            })

            $('#city-list').quickPagination({
                pageSize: 15
            });
		},
        error: function(jqXHR, textStatus, errorThrown){
            //alert('There is an error with the servers. Please try again later');
        }
	});
}

function findUserVisits(id) {

    $.ajax({
        type: 'GET',
        url: rootURL + 'users/' + id + '/visits',
        dataType: "json",
        success: function(data){
            $(data).each(function(index, object) {
                $('#visit-list')
                    .append('<li title="View cities within a 100 mile radius" class="list-group-item">' + object.name + '</li>');
            })

            $('#visit-list').quickPagination({
                pageSize: 15
            });
        },
        error: function(jqXHR, textStatus, errorThrown){
            //alert('There is an error with the servers. Please try again later');
        }
    });
}

function getUsers(){
    $.ajax({
        type: 'GET',
        url: rootURL + 'users',
        dataType: "json",
        success: function(data){
            $(data).each(function(index, object) {
                $('#user-list')
                    .append('<button value="' + object.id +  '" title="View the cities this user has visited" class="list-group-item">' + object.first_name + ' ' + object.last_name + '</li>');
            })
        },
        error: function(jqXHR, textStatus, errorThrown){
            //alert('There is an error with the servers. Please try again later');
        }
    });
}

$(function() {

    getUsers();

    $('#states li button').on('click', function() {

        // clear previous data
        $('#city-list').html('');
        $('#cities h1 span').html('');

        // call ajax function
        findCitiesByState($(this).val());

        // show state
        $('#cities h1 span').append($(this).val());
    });


});

//$('#states button').each(function(e){
//    $(this).on("click", function(){
//        findCitiesByState($('#states li button').val());
//    });
//})

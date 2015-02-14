
var rootURL = "http://localhost:8888/city-demo/api/v1/";

function findCitiesByState(id) {
	console.log('findById: ' + id);
	$.ajax({
		type: 'GET',
		url: rootURL + 'states/' + id,
		dataType: "json",
		success: function(data){
			
			console.log('findById success: ' + data.name);
			
		}
	});
}

findCitiesByState('IL');
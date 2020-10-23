$(document).ready(function () {
	
	let uri = 'https://www.nbrb.by/API/ExRates/Rates/';
	let uri2 = 'https://www.nbrb.by/API/ExRates/Rates/Dynamics/';
	let EUR = 292, USD = 145, RUR = 298;
	let min, max, min_id, max_id;
let d = new Date();

let start_date, end_date;

let ed = new Date();
ed.setDate(d.getDate() - 6);
let data = ed.toLocaleDateString();
let date = data.split('.');
start_date = date[2] +'-'+ date[1] +'-'+ date[0];
let sd = new Date();
sd.setDate(d.getDate());
data = sd.toLocaleDateString();
date = data.split('.');
end_date = date[2] +'-'+ date[1] +'-'+ date[0];

for(let i = 6; i >= 0; i--){
	
		let pd = new Date();
		pd.setDate(d.getDate() - i);
		let data = pd.toLocaleDateString();
		let date = data.split('.');
		let newDate = date[0] +'/'+ date[1] +'/'+ date[2].substring(2, 4);
		$("tr:nth-child(1) td:nth-child("+ (8-i) +")").html(newDate);
		let normDate = date[2] +'-'+ date[1] +'-'+ date[0];

		$.ajax({
			url: uri + EUR,
			async: false,
			dataType: 'json',
			data: { 'onDate': normDate},
			success: function(data) {
				$("tr:nth-child(2) td:nth-child("+ (8-i) +")").html(data.Cur_OfficialRate);
				
			}
		});
		$.ajax({
			url: uri + USD,
			async: false,
			dataType: 'json',
			data: { 'onDate': normDate},
			success: function(data) {
				$("tr:nth-child(3) td:nth-child("+ (8-i) +")").html(data.Cur_OfficialRate);
			}
		});
		$.ajax({
			url: uri + RUR,
			async: false,
			dataType: 'json',
			data: { 'onDate': normDate},
			success: function(data) {
				$("tr:nth-child(4) td:nth-child("+ (8-i) +")").html(data.Cur_OfficialRate);
			}
		});
}

let arr = [];
for(let i = 0; i < $('tr').length; i++){
	arr[i] = [];
	for(let j = 0; j < $('tr:nth-child(1) td').length; j++){
		arr[i][j] = $("tr:nth-child("+ (i+1) +") td:nth-child("+ (j+1) +")").html();
	}
}

function min_max(){
	for(let i = 2; i <= arr.length; i++){
		min = $("tr:nth-child(" + i + ") td:nth-child(2)").html();
		min_id = 2;
		max = $("tr:nth-child(" + i + ") td:nth-child(2)").html();
		max_id = 2;
		for(let j = 3; j <= $('tr:nth-child(1) td').length; j++){
			if( $("tr:nth-child("+ i + ") td:nth-child("+ j +")").html() < min){
				min = $("tr:nth-child("+ i + ") td:nth-child("+ j +")").html();
				min_id = j;
			}
			if( $("tr:nth-child("+ i + ") td:nth-child("+ j +")").html() > max){
				max = $("tr:nth-child("+ i + ") td:nth-child("+ j +")").html();
				max_id = j;
				console.log(max_id);
			}
		}
		$("tr:nth-child("+ i +") td:nth-child("+ min_id +")").addClass('min');
		$("tr:nth-child("+ i +") td:nth-child("+ max_id +")").addClass('max');
		for(let j = 3; j <= $('tr:nth-child(1) td').length; j++){
			if( $("tr:nth-child("+ i + ") td:nth-child("+ j +")").html() == min){
				$("tr:nth-child("+ i +") td:nth-child("+ j +")").addClass('min');
			}
			if( $("tr:nth-child("+ i + ") td:nth-child("+ j +")").html() == max){
				$("tr:nth-child("+ i +") td:nth-child("+ j +")").addClass('max');
			}
		}
	}
}
min_max();

$('.search').on('input', function(){
	var str = $('.search').val();
	str = str.replace(/\s|[^a-zа-яё0-9]/ig, '');
	var row = $('tr').length;
	var k = 2;
	for(i = row; i > 1; i--){
		$("tr:nth-child("+ i +")").remove();
	}
	for(i = 1; i < arr.length; i++){
		if(arr[i][0].replace(/\s|[^a-zа-яё0-9]/ig, '').search(new RegExp('(' + str + ')','i')) != -1){
			$("table").append('<tr></tr>');
			for(j = 0; j < arr[0].length; j++){
				$("tr:nth-child(" + k + ")").append('<td>'+ arr[i][j] +'</td>');
			}
			k++;
		}
	}
});

function from_to(){
	for(let i = 0; i < $('tr').length; i++){
		arr[i] = [];
		arr[0][0] = '';
		arr[1][0] = 'EUR';
		arr[2][0] = 'USD';
		arr[3][0] = 'RUR';
	}
	$("table tr").remove();
	$.ajax({
		url: uri2 + EUR,
		async: false,
		dataType: 'json',
		data: { 'startDate': start_date, 'endDate': end_date },
		success: function(data) {
			let i = 1;
				$.each(data, function (_key, item) {
					let date = item.Date.substring(0, 10).split('-');
					let newDate = date[2] +'/'+ date[1] +'/'+ date[0].substring(2, 4);
					arr[0][i] = newDate;
					
					arr[1][i] = item.Cur_OfficialRate;
					i++;
				});
		}
	});
	$.ajax({
		url: uri2 + USD,
		async: false,
		dataType: 'json',
		data: { 'startDate': start_date, 'endDate': end_date },
		success: function(data) {
			let i = 1;
				$.each(data, function (_key, item) {
					arr[2][i] = item.Cur_OfficialRate;
					i++;
				});
		}
	});
	$.ajax({
		url: uri2 + RUR,
		async: false,
		dataType: 'json',
		data: { 'startDate': start_date, 'endDate': end_date },
		success: function(data) {
			let i = 1;
				$.each(data, function (_key, item) {
					arr[3][i] = item.Cur_OfficialRate;
					i++;
				});
		}
	});
	for(let i = 0; i < arr.length; i++){
		$("table").append('<tr></tr>');
		for(let j = 0; j < arr[0].length; j++){
			$("tr:nth-child(" + (i+1) + ")").append('<td>'+ arr[i][j] +'</td>');
		}
	}
	min_max();
}

$('.start_date').on('input', function(){
	start_date = $('.start_date').val();
	from_to();
});
$('.end_date').on('input', function(){
	end_date = $('.end_date').val();
	from_to();
});


var chart_namber = 1;

$('select').on('input', function(){
	chart_namber = $("select").val();
	var chart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: arr[0].slice(1),
			datasets: [{
				label: 'rate',
				borderColor: '#673ab7',
				data: arr[chart_namber].slice(1)
			}]
		},
		options: {}
	});
});

var ctx = document.getElementById('myChart').getContext('2d');
var chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: arr[0].slice(1),
        datasets: [{
            label: 'rate',
            borderColor: '#673ab7',
            data: arr[chart_namber].slice(1)
        }]
    },
    options: {}
});

});
$(document).ready(function() {
	let url = 'https://api.github.com/repos/thomasdavis/backbonetutorials/contributors';
	$.getJSON(url, function(data) {
			function generateTable(table, data) {
				let headers = document.querySelectorAll('th');
				let keys = [];
				Array.prototype.forEach.call(headers, function(header) {
					keys.push(header.dataset.key)
				});
			  	for (let element of data) {
			    	let row = table.insertRow();
			    	for (let key of keys) {
			      		let cell = row.insertCell();
			      		let text = document.createTextNode(element[key]);
			      		cell.appendChild(text);
			    }
			  }
			}
			let table = document.querySelector("table");
			generateTable(table, data);
	});
});
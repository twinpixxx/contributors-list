$(document).ready(function() {
	let url = 'https://api.github.com/repos/thomasdavis/backbonetutorials/contributors';
	$.getJSON(url, function(data) {
			function additionalInfo(data) {
				for (let element of data) {
			    	let additionalUrl = `https://api.github.com/users/${element.login}`;
					$.getJSON(additionalUrl, function(data) {
					
					});
				}
			}
			function generateTable(table, data) {
				let headers = document.querySelectorAll('th');
				let keys = [];
				Array.prototype.forEach.call(headers, function(header) {
					keys.push(header.dataset.key)
				});
				additionalInfo(data);
				// data.push(additionalInfo(data));
			  	for (let element of data) {
			    	let row = table.insertRow();
			    	row.setAttribute('class', 'contributor__tr');
			    	for (let key of keys) {
			    		let cell = row.insertCell();
			    		switch (key) {
			    			case 'avatar_url':
			    				let contributorAccountImage = document.createElement('img');
			    				contributorAccountImage.setAttribute('class', 'contributor__account-image');
			    				contributorAccountImage.setAttribute('src', element[key]);
			    				cell.appendChild(contributorAccountImage);
			    				cell.setAttribute('class', 'contributor__td contributor__td-image');
			    				break;
			    			case 'login':
			    				let contributorLogin = document.createTextNode(element[key]);
			    				cell.appendChild(contributorLogin);
			    				cell.setAttribute('class', 'contributor__login contributor__td');
			    				break;
			    			case 'id':
			    				let contributorId = document.createTextNode(element[key]);
			    				cell.appendChild(contributorId);
			    				cell.setAttribute('class', 'contributor__id contributor__td');
			    				break;
			    			case 'html_url':
			    				let contributorAccountLink = document.createElement('a');
			    				contributorAccountLink.setAttribute('class', 'contributor__account-url');
			    				contributorAccountLink.setAttribute('href', element[key]);
			    				contributorAccountLink.textContent += `${element.login}'s account`;
			    				cell.appendChild(contributorAccountLink);
			    				cell.setAttribute('class', 'contributor__td');
			    				break;
			    			case 'contributions':
			    				let numberOfContributions = document.createTextNode(element[key]);
			    				cell.appendChild(numberOfContributions);
			    				cell.setAttribute('class', 'contributor__contributions contributor__td');
			    				break;
			    			default:
			    				let contributorInfo = document.createTextNode(element[key]);
			    				cell.appendChild(contributorInfo);
			    				cell.setAttribute('class', 'contributor__td');
			    				break;
			    		}
			    }
			  }
			}
			let table = document.querySelector("table tbody");
			generateTable(table, data);
	});
});
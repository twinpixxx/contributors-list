function generateTable(table, data) {
			let headers = document.querySelectorAll('th');
			let keys = [];
			Array.prototype.forEach.call(headers, function(header) {
				keys.push(header.dataset.key)
			});
			for (let element of data) {
				let row = table.insertRow();
				row.setAttribute('class', 'contributor__tr');
				// let userData;
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
							if (element[key] < 5) {
								cell.setAttribute('class', 'contributor__contributions contributor__td contributor__contributions-bronze');
							} else if ((element[key] > 5) && (element[key] < 20)) {
								cell.setAttribute('class', 'contributor__contributions contributor__td contributor__contributions-silver');
							} else if ((element[key] >= 20)) {
								cell.setAttribute('class', 'contributor__contributions contributor__td contributor__contributions-gold');
							}
							break;
						case 'company':
						case 'location':
						case 'email':
							let additionalUrl = `https://api.github.com/users/${element.login}`;
							// if (userData) {
							// 	let info = userData[element[key]];
							// 	let text = document.createTextNode(info);
							// 	cell.appendChild(text);
							// 	cell.setAttribute('class', 'contributor__td');
							// }
							$.getJSON(additionalUrl, function(data1) {
								// userData = data1;
								let info = data1[key];
								let text = document.createTextNode(info);
								cell.appendChild(text);
								cell.setAttribute('class', 'contributor__td');
							});
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


$(document).ready(function() {
	let url = 'https://api.github.com/repos/thomasdavis/backbonetutorials/contributors';
	$.getJSON(url, function(data) {
		let table = document.querySelector("table tbody");
		generateTable(table, data);
	});
});
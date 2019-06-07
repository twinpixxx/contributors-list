function generateTable(table, data, keys) {
	for (let element of data) {
		let row = table.insertRow();
		row.classList.add('contributors__tr');
		// let userData;
		if (keys.has('avatar_url')) {
			let cell = row.insertCell();
			let contributorAccountImage = document.createElement('img');
			contributorAccountImage.classList.add('contributors__account-image');
			contributorAccountImage.setAttribute('src', element['avatar_url']);
			cell.appendChild(contributorAccountImage);
			cell.classList.add('contributors__td', 'contributors__td-image');
		}
		if (keys.has('login')) {
			let cell = row.insertCell();
			let contributorLogin = document.createTextNode(element['login']);
			cell.appendChild(contributorLogin);
			cell.classList.add('contributors__login', 'contributors__td');
		}
		if (keys.has('id')) {
			let cell = row.insertCell();
			let contributorId = document.createTextNode(element['id']);
			cell.appendChild(contributorId);
			cell.classList.add('contributors__id', 'contributors__td');
		}
		if (keys.has('html_url')) {
			let cell = row.insertCell();
			let contributorAccountLink = document.createElement('a');
			contributorAccountLink.classList.add('contributors__account-url');
			contributorAccountLink.setAttribute('href', element['html_url']);
			contributorAccountLink.textContent += `${element.login}'s account`;
			cell.appendChild(contributorAccountLink);
			cell.classList.add('contributors__td');
		}
		if (keys.has('contributions')) {
			let cell = row.insertCell();
			let numberOfContributions = document.createTextNode(element['contributions']);
			cell.appendChild(numberOfContributions);
			cell.classList.add('contributors__contributions', 'contributors__td');
			if (element['contributions'] < 5) {
				row.classList.add('contributors__contributions_bronze');
			} else if ((element['contributions'] > 5) && (element['contributions'] < 20)) {
				row.classList.add('contributors__contributions_silver');
			} else if ((element['contributions'] >= 20)) {
				row.classList.add('contributors__contributions_gold');
			}		
		}
		if (keys.has('company')) {
			let cell = row.insertCell();	
			cell.classList.add('contributors__company', 'contributors__td');
		}
		if (keys.has('location')) {
			let cell = row.insertCell();	
			cell.classList.add('contributors__location', 'contributors__td');
		}
		if (keys.has('email')) {
			let cell = row.insertCell();	
			cell.classList.add('contributors__email', 'contributors__td');
		}
	}
}

//fix: bug with @kubetz and @monkyz 's profiles
function getAdditionalInfo(table, keys) {
	let rows = table.querySelectorAll('tr');
	for (let row of rows) {
		let contributorLogin = row.getElementsByClassName('contributors__login')[0].innerText;
		let additionalUrl = 'https://api.github.com/users/'+contributorLogin;
		$.ajax({
	        url: additionalUrl,
	        type: "GET",
	        data: 'json',
	        success: function(additionalData){
				if (keys.has('company')) {
					let cell = row.querySelector('.contributors__company');
					let contributorCompany = additionalData['company'];
					if (contributorCompany) {
						cell.innerHTML = contributorCompany;
					} else {
						cell.innerHTML = '&mdash;';
						cell.classList.add('contributors__location_undef');
					}
				}
				if (keys.has('location')) {
					let cell = row.querySelector('.contributors__location');
					let contributorLocation = additionalData['location'];
					if (contributorLocation) {
						cell.innerHTML = contributorLocation;
					} else {
						cell.innerHTML = '&mdash;';
						cell.classList.add('contributors__location_undef');
					}
				}
				if (keys.has('email')) {
					let cell = row.querySelector('.contributors__email');
					let contributorEmail = additionalData['email'];
					if (contributorEmail) {
						cell.innerHTML = contributorEmail;
					} else {
						cell.innerHTML = '&mdash;';
						cell.classList.add('contributors__email_undef');
					}
				}
			},
	        error: function (xhr, ajaxOptions, thrownError) {
	        	alert(xhr.responseText);
	      	}
    	});
	}
}


function groupContributors(table, group) {
		if (group == 'Bronze') {
			table.classList.add('contributors_filtered_bronze');
			table.classList.remove('contributors_filtered_gold', 'contributors_filtered_silver');
		} else if (group == 'Silver') {
			table.classList.add('contributors_filtered_silver');
			table.classList.remove('contributors_filtered_gold', 'contributors_filtered_bronze');
		} else if (group == 'Gold') {
			table.classList.add('contributors_filtered_gold');
			table.classList.remove('contributors_filtered_bronze', 'contributors_filtered_silver');
		} else {
			table.classList.remove('contributors_filtered_gold', 'contributors_filtered_silver', 'contributors_filtered_bronze');
		}
}


function sortRows(rows, order) {
	let tbody = rows[0].closest('tbody');
	rows.sort((row1, row2) => {
		let firstContributor = row1.getElementsByClassName('contributors__login')[0].innerText.toLowerCase();
		let secondContributor = row2.getElementsByClassName('contributors__login')[0].innerText.toLowerCase();
		if (firstContributor > secondContributor) {
			return 1;
		} else {
			return -1;
		}
	});
	if (order == 'asc') {
		rows.forEach(row => tbody.appendChild(row));
	} else {
		rows.reverse().forEach(row => tbody.appendChild(row));
	}
}


$(document).ready(function() {
	const url = 'https://api.github.com/repos/thomasdavis/backbonetutorials/contributors';
	//fix: table should be tbody
	let table = document.getElementById('contributors__list');
	let headers = document.querySelectorAll('th');
	let groupSelector = document.getElementById('contributors__groupper');
	let sortSelector = document.getElementById('contributors__sort');
	let keys = new Set();
	//rewrite with array.set
	Array.prototype.forEach.call(headers, function(header) {
		keys.add(header.dataset.key);
	});
	$.ajax({
        url: url,
        type: "GET",
        data: 'json',
        success: function (data) {
           	generateTable(table, data, keys);
           	getAdditionalInfo(table, keys);
           	groupSelector.removeAttribute('disabled');
           	sortSelector.removeAttribute('disabled');
        },
        error: function (xhr) {
        	alert(xhr.responseText);
      }
    });
    // use another way to navigate to table in groupSelector
    // and to table in sortSelector
	groupSelector.addEventListener('input', function(){
		groupContributors(table, groupSelector.selectedOptions[0].value)
	});
	sortSelector.addEventListener('input', function() {
		let rows = [...table.querySelectorAll('tr')];
		sortRows(rows, sortSelector.selectedOptions[0].value);
	});
});
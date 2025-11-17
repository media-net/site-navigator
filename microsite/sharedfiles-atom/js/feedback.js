var selectedReasons = [];
var formstate = true;
var payload = null;
var checkboxes = [
	{
		id: 'opt1',
		label: 'The extension is harmful to my computer',
	},
	{
		id: 'opt2',
		label: 'I didn’t install the extension and don’t know how it got added',
	},
	{
		id: 'opt3',
		label: 'I don’t need this extension anymore',
	},
	{
		id: 'opt4',
		label: 'I’m not sure how to use this product',
	},
	{
		id: 'opt5',
		label: 'I expected the extension to have more features',
	},
	{
		id: 'opt6',
		label: 'I’m concerned about my privacy',
	},
	{
		id: 'opt7',
		label: 'The extension is not working',
	},
	{
		id: 'opt8',
		label: 'I’m unhappy with the change in the search provider',
	},
	{
		id: 'other',
		label: 'Other',
	},
];

function resetForm() {
	selectedReasons = [];
	document.querySelectorAll('.checkboxElem').forEach(function (elem) {
		elem.removeAttribute('checked');
	});
	document.querySelector('.submit-btn').disabled = true;
	document.getElementById('others-text').value = '';
}

document.querySelectorAll('.checkboxElem').forEach(function (elem) {
	elem.addEventListener('click', function (event) {
		if (formstate) {
			event.preventDefault();
			selectedReasons = [];
			document.getElementsByClassName('success-msg')[0].style.display = 'none';
			if (event.currentTarget.getAttribute('checked')) {
				event.currentTarget.removeAttribute('checked');
			} else {
				event.currentTarget.setAttribute('checked', 'true');
			}

			selectedReasons = checkboxes.filter(function (checkbox) {
				var checkboxElement = document.getElementById(checkbox.id);
				return checkboxElement.getAttribute('checked') == 'true';
			});

			if (selectedReasons.length > 0) {
				document.querySelector('.submit-btn').disabled = false;
			} else {
				document.querySelector('.submit-btn').disabled = true;
			}
		}
	});
});

document.getElementById('uninstallForm').addEventListener('submit', function (event) {
	event.preventDefault();
	if (selectedReasons.length > 0 || document.getElementById('others-text').value.length > 1) {
		var othersText = document.getElementById('others-text').value;
		formstate = false;
		document.getElementsByClassName('success-msg')[0].style.display = 'flex';
		setTimeout(function () {
			resetForm();
			formstate = true;
		}, 8000);

		payload = {
			reason: selectedReasons.map(function (reason) {
				return reason.label;
			}),
			details: othersText,
		};

		fetch('/api/feedback', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		})
			.then(response => response.json())
			.then(data => {
				console.log(data);
			})
			.catch(error => {
				Sentry.captureMessage(`Error fetching API ${error}`);
				console.error('Error:', error);
			});
	}
});

document.getElementById('others-text').onkeydown = function (elem) {
	if (formstate) {
		if (this.value.length > 0) {
			document.getElementsByClassName('success-msg')[0].style.display = 'none';
			document.querySelector('.submit-btn').disabled = false;
		} else if (selectedReasons.length > 0) {
			document.querySelector('.submit-btn').disabled = false;
		} else if (selectedReasons.length <= 0 || this.value.length <= 0) {
			document.querySelector('.submit-btn').disabled = true;
		}
	}
	if (elem.keyCode == 13 && !elem.shiftKey) {
		elem.preventDefault();
		return false;
	}
};

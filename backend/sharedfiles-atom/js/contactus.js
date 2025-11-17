const contactForm = document.getElementById('contactUs');

let firstName = document.getElementById('fname');
let lastName = document.getElementById('lname');
let email = document.getElementById('email');
let message = document.getElementById('message');

contactForm.addEventListener('submit', e => {
	e.preventDefault();
	var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	if (email.value.match(mailformat)) {
		let payload = {
			subject: `Contact Us - ${window.location.hostname}`,
			text: `First Name: ${firstName.value} \nLast Name: ${lastName.value} \nEmail: ${email.value} \nMessage: ${message.value}`,
		};

		fetch('/api/contactUs', {
			method: 'POST',
			body: JSON.stringify(payload),
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(response => response.json())
			.then(data => {
				if (data.success) {
					alert('Your query is sent successfully');
					fname.value = '';
					lname.value = '';
					email.value = '';
					message.value = '';
				} else {
					alert('Some error occurred. \nPlease retry!');
				}
			})
			.catch(error => {
				Sentry.captureMessage(`Error fetching API ${error}`);
				console.error(error);
			});
	} else {
		alert('You have entered an invalid email address!');
		return false;
	}
});

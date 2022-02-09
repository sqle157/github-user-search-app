let toggle = document.getElementById("toggle");
let toggle_text = document.getElementsByClassName("toggle-text")[0];
let form = document.getElementById("form");

// All the variables we need to get the user's data
// Location
let location_title = document.getElementsByClassName("location")[0];
let location_icon = document.getElementsByClassName("location-icon")[0];

// Website
let website_link = document.getElementsByClassName("website-link")[0];
let website = document.getElementsByClassName("website")[0];
let website_icon = document.getElementsByClassName("website-icon")[0];

// Twitter
let twitter = document.getElementsByClassName("twitter")[0];
let twitter_icon = document.getElementsByClassName("twitter-icon")[0];

// Company
let company = document.getElementsByClassName("company")[0];
let company_icon = document.getElementsByClassName("company-icon")[0];

// Toggle Icon
let moon_icon = document.getElementsByClassName("moon-icon")[0];
let sun_icon = document.getElementsByClassName("sun-icon")[0];

// Helper function to remove text from an element
let removeText = (e) => {
	e.classList.remove("text-lynch");
};

let addText = (e) => {
	e.classList.add("text-lynch");
};

// Helper function to change the color of the contact icons
let changeContactColor = (e, e_icon, mode) => {
	// console.log(checkAvailability(e));
	// console.log(mode);
	e_icon.setAttribute(
		"fill",
		!checkAvailability(e) ? (mode === "Light" ? "#4b6a9b" : "#fefefe") : "#697c9a"
	);

	e.style.color = !checkAvailability(e)
		? mode === "Light"
			? "#4b6a9b"
			: "#fefefe"
		: "#697c9a";
};

// Helper function to check if an element is available
let checkAvailability = (e) => {
	return e.innerHTML === "Not available";
};

// Helper function to change the color of the document
let changeColor = (mode) => {
	if (mode === "Light") {
		document.body.style.backgroundColor = "#f6f8ff";
		document.body.style.color = "#000";

		addText(toggle_text);
		addText(document.getElementsByClassName("user-bio")[0]);
		addText(document.getElementsByClassName("date-joined")[0]);

		// Change the background
		document.getElementsByClassName("card")[0].style.background =
			document.getElementsByClassName("form-group")[0].style.background =
			document.getElementsByClassName("input-container")[0].style.background =
				"#fefefe";

		document.getElementsByClassName("search-bar")[0].classList.remove("input-placeholder");
		document.getElementsByClassName("user-stats")[0].style.background = "#f6f8ff";

		// Change box-shadow
		document.getElementsByClassName("card")[0].style.boxShadow =
			document.getElementsByClassName("form-group")[0].style.boxShadow =
				"0px 20px 20px #e2e5f7";

		// Change contact color
		changeContactColor(location_title, location_icon, mode);
		changeContactColor(website, website_icon, mode);
		changeContactColor(twitter, twitter_icon, mode);
		changeContactColor(company, company_icon, mode);
	} else {
		document.body.style.backgroundColor = "#141d2f";
		document.body.style.color = "#fff";

		removeText(toggle_text);
		removeText(document.getElementsByClassName("user-bio")[0]);
		removeText(document.getElementsByClassName("date-joined")[0]);

		document.getElementsByClassName("card")[0].style.background =
			document.getElementsByClassName("form-group")[0].style.background =
			document.getElementsByClassName("input-container")[0].style.background =
				"#1e2a47";

		document.getElementsByClassName("search-bar")[0].classList.add("input-placeholder");

		document.getElementsByClassName("user-stats")[0].style.background = "#141d2f";

		document.getElementsByClassName("card")[0].style.boxShadow =
			document.getElementsByClassName("form-group")[0].style.boxShadow = "none";

		// Change contact color
		changeContactColor(location_title, location_icon, mode);
		changeContactColor(website, website_icon, mode);
		changeContactColor(twitter, twitter_icon, mode);
		changeContactColor(company, company_icon, mode);
	}
};

// Helper function to change the contact info
let changeContactInfo = (data, type, mode) => {
	switch (type) {
		// Change location
		case "location":
			location_title.innerHTML = data.location ? data.location : "Not available";
			changeContactColor(location_title, location_icon, mode);
			break;

		// Change website
		case "website":
			website_link.setAttribute("href", data.blog ? "https://" + data.blog : "");
			website.innerHTML = data.blog ? data.blog : "Not available";
			changeContactColor(website, website_icon, mode);
			break;

		// Change twitter
		case "twitter":
			twitter.innerHTML = data.twitter_username
				? "@" + data.twitter_username
				: "Not available";
			changeContactColor(twitter, twitter_icon, mode);
			break;

		// Change company
		case "company":
			company.innerHTML = data.company ? data.company : "Not available";
			changeContactColor(company, company_icon, mode);
			break;
	}
};

// Add event listeners to the form
form.addEventListener("submit", (e) => {
	e.preventDefault();

	let user = document.getElementById("input-search").value;

	fetch("https://api.github.com/users/" + user).then((res) => {
		// If search is successful, return the user's data
		if (res.ok) {
			document.getElementsByClassName("error-mess")[0].style.display = "none";
			res.json().then((data) => {
				console.log(data);

				let date = new Date(data.created_at);
				const month = [
					"Jan",
					"Feb",
					"Mar",
					"Apr",
					"May",
					"Jun",
					"Jul",
					"Aug",
					"Sep",
					"Oct",
					"Nov",
					"Dec",
				];

				// Change all the element accordingly
				// Change the avatar
				document.getElementsByClassName("user-profile-img")[0].src = data.avatar_url;

				// Change the name
				document.getElementsByClassName("full-name")[0].innerHTML = data.name
					? data.name
					: data.login;
				// Change the username
				document.getElementsByClassName("username")[0].innerHTML = data.login;

				// Change the date joined
				document.getElementsByClassName("date-joined")[0].innerHTML =
					"Joined " + date.getDate() + " " + month[date.getMonth()] + " " + date.getFullYear();

				// Change the bio
				document.getElementsByClassName("user-bio")[0].innerHTML = data.bio
					? data.bio
					: "This profile has no bio";

				// Change the stats (number of followers, following, repositories)
				document.getElementsByClassName("repo")[0].innerHTML = data.public_repos;
				document.getElementsByClassName("followers")[0].innerHTML = data.followers;
				document.getElementsByClassName("followings")[0].innerHTML = data.following;

				// Change the location
				changeContactInfo(data, "location", toggle_text.innerHTML);
				// Change the website
				changeContactInfo(data, "website", toggle_text.innerHTML);
				// Change the twitter
				changeContactInfo(data, "twitter", toggle_text.innerHTML);
				// Change the company
				changeContactInfo(data, "company", toggle_text.innerHTML);
			});
		} else {
			// If search is unsuccessful, return the error message
			document.getElementsByClassName("error-mess")[0].style.display = "block";
		}
	});
});

// Add event listener to the toggle button
toggle.addEventListener("click", (e) => {
	console.log(e.target.innerHTML);
	changeColor(toggle.innerHTML);

	// Change Mode
	toggle.innerHTML = e.target.innerHTML === "Dark" ? "Light" : "Dark";
	moon_icon.style.display = e.target.innerHTML === "Light" ? "none" : "block";
	sun_icon.style.display = e.target.innerHTML === "Light" ? "block" : "none";
});

// Initialize the page
if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
	let mode = "Dark";
	toggle_text.innerHTML = "Light";
	moon_icon.style.display = "none";
	sun_icon.style.display = "block";
	changeColor(mode);
} else {
	let mode = "Light";
	toggle_text.innerHTML = "Dark";
	moon_icon.style.display = "block";
	sun_icon.style.display = "none";
	changeColor(mode);
}

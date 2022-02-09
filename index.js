let toggle = document.getElementById("toggle");
let form = document.getElementById("form");
let body = document.getElementsByClassName("body")[0];

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

// Helper function to call the update contact color function
let updateContactColorHelper = (mode) => {
	updateContactColor(location_title, location_icon, mode);
	updateContactColor(website, website_icon, mode);
	updateContactColor(twitter, twitter_icon, mode);
	updateContactColor(company, company_icon, mode);
};

// Helper function to call the update contact info function
let updateContactInfoHelper = (data, mode) => {
	// Update the location
	updateContactInfo(data, "location", mode);
	// Update the website
	updateContactInfo(data, "website", mode);
	// Update the twitter
	updateContactInfo(data, "twitter", mode);
	// Update the company
	updateContactInfo(data, "company", mode);
};

// Helper function to update the color of the contact icons
let updateContactColor = (e, e_icon, mode) => {
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

// Helper function to update the contact info
let updateContactInfo = (data, type, mode) => {
	switch (type) {
		// Change location
		case "location":
			location_title.innerHTML = data.location ? data.location : "Not available";
			updateContactColor(location_title, location_icon, mode);
			break;

		// Change website
		case "website":
			website_link.setAttribute("href", data.blog ? "https://" + data.blog : "");
			website.innerHTML = data.blog ? data.blog : "Not available";
			updateContactColor(website, website_icon, mode);
			break;

		// Change twitter
		case "twitter":
			twitter.innerHTML = data.twitter_username
				? "@" + data.twitter_username
				: "Not available";
			updateContactColor(twitter, twitter_icon, mode);
			break;

		// Change company
		case "company":
			company.innerHTML = data.company ? data.company : "Not available";
			updateContactColor(company, company_icon, mode);
			break;
	}
};

// Add event listeners to the form
form.addEventListener("submit", (e) => {
	e.preventDefault();

	let user = document.getElementById("input-search").value;

	// fetch the data
	fetch("https://api.github.com/users/" + user).then((res) => {
		// If search is successful, return the user's data
		if (res.ok) {
			document.getElementsByClassName("error-mess")[0].style.display = "none";
			res.json().then((data) => {
				console.log(data);

				let date = new Date(data.created_at);
				let mode = toggle.innerHTML === "Light" ? "Dark" : "Light";

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

				// Update all the element accordingly
				// Update the avatar
				document.getElementsByClassName("user-profile-img")[0].src = data.avatar_url;

				// Update the name
				document.getElementsByClassName("full-name")[0].innerHTML = data.name
					? data.name
					: data.login;
				// Update the username
				document.getElementsByClassName("username")[0].innerHTML = "@" + data.login;

				// Update the date joined
				document.getElementsByClassName("date-joined")[0].innerHTML =
					"Joined " + date.getDate() + " " + month[date.getMonth()] + " " + date.getFullYear();

				// Update the bio
				document.getElementsByClassName("user-bio")[0].innerHTML = data.bio
					? data.bio
					: "This profile has no bio";

				// Update the stats (number of followers, following, repositories)
				document.getElementsByClassName("repo")[0].innerHTML = data.public_repos;
				document.getElementsByClassName("followers")[0].innerHTML = data.followers;
				document.getElementsByClassName("followings")[0].innerHTML = data.following;

				// Update the contact info
				updateContactInfoHelper(data, mode);
			});
		} else {
			// If search is unsuccessful, return the error message
			document.getElementsByClassName("error-mess")[0].style.display = "block";
		}
	});
});

// Add event listener to the toggle button
toggle.addEventListener("click", (e) => {
	// console.log(e.target.innerHTML);
	body.classList.toggle("dark");

	// Change Mode
	toggle.innerHTML = e.target.innerHTML === "Dark" ? "Light" : "Dark";
	let mode = toggle.innerHTML === "Dark" ? "Light" : "Dark";

	// Change contact color
	updateContactColorHelper(mode);
});

// Initialize the page with user preference
if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
	body.classList.add("dark");
	toggle.innerHTML = "Light";
	updateContactColorHelper("Dark");
} else {
	body.classList.remove("dark");
	toggle.innerHTML = "Dark";
	updateContactColorHelper("Light");
}

let urlBase = "https://api.spacexdata.com/v4/";
let launchHistory = `${urlBase}launches/past`;

const section = document.getElementById("results");
const select = document.querySelector("select");
const inputForm = document.querySelector('form');

let missionDataLength;

// Event listener for form submission
inputForm.addEventListener('submit', getData);

async function getData(e) {
    e.preventDefault();
    while (section.firstChild) {
        section.removeChild(section.firstChild);
    }
    fetch(launchHistory)
  .then((result) => {
    return result.json();
  })
  .then((data) => {
    missionDataLength = data.length;
    // console.log(missionDataLength);
  })
  .catch((err) => console.log(err));

  for (let i = missionDataLength - 1; i >= missionDataLength - select.value; i--) {
    // First, call the Mission API
    await fetch(launchHistory)
      .then((result) => {
        return result.json();
      })
      .then((data) => {
        missionData = data;
        console.log(missionData);
        let launchpadId = missionData[i].launchpad;
        let launchpadQueryById = `${urlBase}launchpads/${launchpadId}`;

        return fetch(launchpadQueryById); // then, grab the launchpad ID and make a call to the launchpads API with the specific ID
      })
      .then((result) => {
        return result.json();
      })
      .then((launchpadData) => {
        //console.log(missionData, launchpadData);
        displayResults(missionData, launchpadData);
      })
      .catch((err) => console.log(err));

    function displayResults(missionData, launchpadData) {
      let div = document.createElement("div"); 
      let heading = document.createElement("h4");
      let link = document.createElement("a");
      let description = document.createElement("p");
      let img = document.createElement("img");
      let hr = document.createElement("hr");
      let date = document.createElement("p");
      let launch = document.createElement("p");

      link.href = missionData[i].links.article;
      link.textContent = missionData[i].name;
      link.setAttribute("target", "_blank");

      description.innerText = missionData[i].details;

      img.src = missionData[i].links.flickr.original[0];
      img.setAttribute("class", "img-fluid");

      // convert unix time to readable
      const unixTimestamp = missionData[i].date_unix;
      const milliseconds = unixTimestamp * 1000;
      const dateObject = new Date(milliseconds);
      const humanDateFormat = dateObject.toLocaleString();
      const justDate = humanDateFormat.split(",");

      date.innerText = justDate[0];
      date.setAttribute("id", "date");

      launch.innerText = `Launched from: ${launchpadData.full_name}`;
      launch.style.fontWeight = "bold";

      div.appendChild(heading);
      heading.appendChild(link);
      div.appendChild(date);
      div.appendChild(launch);
      div.appendChild(description);
      div.appendChild(img);
      div.appendChild(hr);
      section.appendChild(div);
    }
  }
}

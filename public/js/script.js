// get time with hour, minutes & seconds
const getTimeString = (time) => {
  const years = Math.floor(time / 31536000);
  let remainingSeconds = time % 31536000;

  const months = Math.floor(remainingSeconds / 2592000);
  remainingSeconds %= 2592000;

  const weeks = Math.floor(remainingSeconds / 604800);
  remainingSeconds %= 604800;

  const days = Math.floor(remainingSeconds / 86400);
  remainingSeconds %= 86400;

  const hours = Math.floor(remainingSeconds / 3600);
  remainingSeconds %= 3600;

  const minutes = Math.floor(remainingSeconds / 60);
  remainingSeconds %= 60;

  if (years > 1) {
    return `${years} years ago`;
  } else if (years === 1) {
    return `${years} year ${months} months ago`;
  } else if (months > 0) {
    return `${months} months ${weeks} weeks ago`;
  } else if (weeks > 0) {
    return `${weeks} weeks ${days} days ago`;
  } else if (days > 0) {
    return `${days} days ${hours} hours ago`;
  } else if (hours > 0) {
    return `${hours} hours ${minutes} minutes ago`;
  } else if (minutes > 0) {
    return `${minutes} minutes ${remainingSeconds} seconds ago`;
  } else {
    return `${remainingSeconds} seconds ago`;
  }
};

//1 - Fetch,  Load and  Show Categories on html

const loadCategories = async () => {
  const url = "https://openapi.programming-hero.com/api/phero-tube/categories";
  try {
    //fetch the data
    const res = await fetch(url);
    const data = await res.json();
    displayCategories(data.categories);
  } catch (error) {
    console.error("Error", error);
  }
};

const loadVideos = async (searchText = "") => {
  const url = `https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`;
  try {
    //fetch the data
    const res = await fetch(url);
    const data = await res.json();
    displayVideos(data.videos);
  } catch (error) {
    console.error("Error", error);
  }
};

const loadCategoryVideos = async (categoryID) => {
  const url = `https://openapi.programming-hero.com/api/phero-tube/category/${categoryID}`;
  try {
    //fetch the data
    const res = await fetch(url);
    const data = await res.json();

    // disable active button
    const buttons = document.getElementsByTagName("button");
    for (const button of buttons) {
      button.classList.remove("bg-red-500", "text-white");
    }

    // enable active button
    const activeBtn = document.getElementById(`btn-${categoryID}`);
    activeBtn.classList.add("bg-red-500", "text-white");

    displayVideos(data.category);
  } catch (error) {
    console.error("Error", error);
  }
};

const loadDetails = async (videoId) => {
  const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
  try {
    //fetch the data
    const res = await fetch(url);
    const data = await res.json();
    displayDetails(data.video);
  } catch (error) {
    console.error("Error", error);
  }
};

// Search input
document.getElementById("search-input").addEventListener("keyup", (e) => {
  loadVideos(e.target.value);
});

// Create Display Details
const displayDetails = (video) => {
  const modalContainer = document.getElementById("modal-container");
  const showModal = document.getElementById("modal");

  // show modal
  showModal.innerHTML = `
  <img class="w-full" src="${video.thumbnail}"/>
  <p class="text-stone-600 text-lg my-5">${video.description}</p>
  <div class="text-right w-full">
  <button onclick="closeModal()" class="btn px-5 bg-red-500 rounded-md border-none text-lg text-white hover:text-gray-700" > Close </button>
  </div>
  `;
  modalContainer.appendChild(showModal);
  modalContainer.classList.remove("hidden");
  console.log(video.video_id);
};

//  close modal function
const closeModal = () => {
  const modalContainer = document.getElementById("modal-container");
  modalContainer.classList.add("hidden");
};

// close modal on window click
window.addEventListener("click", function (event) {
  const modalContainer = document.getElementById("modal-container");
  if (event.target === modalContainer) {
    modalContainer.classList.add("hidden");
  }
});
// Create display categories
const displayCategories = (categories) => {
  const categoryContainer = document.getElementById("category-container");

  categories.forEach((item) => {
    //create a button
    const buttonContainer = document.createElement("button");
    buttonContainer.innerHTML = `
    <button onclick="loadCategoryVideos(${item.category_id})" id="btn-${item.category_id}" class="btn rounded-md font-normal text-lg">${item.category}</button>
    `;
    categoryContainer.appendChild(buttonContainer);
  });
};

// Create Display Videos
const displayVideos = (videos) => {
  const videoContainer = document.getElementById("video-container");
  videoContainer.innerHTML = "";

  if (videos.length == 0) {
    videoContainer.innerHTML = `<div class="col-span-12 py-20 flex flex-col justify-center items-center">
      <img src="./public/img/icon.png"/>
      <h2 class="text-center text-xl font-bold mt-5"> No Content Here in this Category </h2> 
      </div>
      `;
  }

  videos.forEach((video) => {
    const videoCard = document.createElement("div");
    videoCard.classList = "col-span-3 flex flex-col gap-4";
    videoCard.innerHTML = `<div class="relative">
            <img
              src="${video.thumbnail}"
              alt=""
              class="w-full h-60 object-cover rounded-md"
            />
            ${
              video.others?.posted_date
                ? `<span class="absolute right-2 bottom-2 bg-black bg-opacity-70 text-white px-3 ">
                  ${getTimeString(video?.others?.posted_date)}
                </span>`
                : ""
            }
            
            <button onclick="loadDetails('${
              video.video_id
            }')" class="absolute inset-0 flex justify-center items-center text-white text-5xl cursor-pointer"><i class="fa-regular fa-circle-play"></i></button>
            </div>
            
            <div class="flex justify-between gap-5">
              <img
                src="${video.authors[0].profile_picture}"
                class="w-10 h-10 rounded-full object-cover"
              />
              <div class="w-4/5">
                <h2 class="text-xl font-semibold">
                  ${video.title}
                </h2>
                <p class="flex gap-2 text-stone-500">
                  <span> ${video.authors[0].profile_name}</span>
                  ${
                    video.authors[0].verified === true
                      ? '<img class="w-5 h-5" src="https://img.icons8.com/skeuomorphism/32/verified-badge.png" alt="" />'
                      : ""
                  }
                </p>
                
                <p class=" text-stone-500">${video.others.views} views</p>
                
              </div>
            </div>
    `;

    videoContainer.appendChild(videoCard);
  });
};

loadCategories();
loadVideos();

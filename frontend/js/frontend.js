const siteTitle = "Komik Roehana Koeddoes";
const routeURL = false;
let currentHash = window.location.hash;
let comicsPage = document.querySelector(".main-comics");

/********************* element variables ************************/
const firstButton = document.querySelector(".end-of-page-first");
const prevButton = document.querySelector(".end-of-page-prev");
const nextButton = document.querySelector(".end-of-page-next");
const lastButton = document.querySelector(".end-of-page-last");
const selectButton = document.querySelector(".end-of-page-select");
const loadingBlock = document.getElementById("loading");
const listOfAllPages = document.querySelectorAll(".pagesList");
const contentsAboutClose = document.querySelectorAll(".contents-about-close");
const frontendJS = document.getElementById("frontendJS");
let interactionsJS;

/********************* check URL function ************************/
let currentPage = listOfAllPages[0].value;

// let currentPage_old = selectButton.children[0].value;

window.addEventListener("keydown", (event) => {
  if (event.key == "ArrowLeft") {
    event.preventDefault();
    prevButton.click();
  }

  if (event.key == "ArrowRight") {
    event.preventDefault();
    nextButton.click();
  }

  if (event.key == "Home") {
    event.preventDefault();
    firstButton.click();
  }

  if (event.key == "End") {
    event.preventDefault();
    lastButton.click();
  }
});

/********************* (parallax) misc function ************************/
function between(x, min, max) {
  return x >= min && x <= max;
}

function waitForElement(selector) {
  return new Promise((resolve) => {
    if (selector) {
      return resolve(selector);
    }

    const observer = new MutationObserver((mutations) => {
      if (selector) {
        observer.disconnect();
        resolve(selector);
      }
    });

    // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

/********************* fetch page function ************************/

// function disableFirstandPrev() {
//   firstButton.classList.add("disabledButton");
//   prevButton.classList.add("disabledButton");
// }

// function disableLastandNext() {
//   lastButton.classList.add("disabledButton");
//   nextButton.classList.add("disabledButton");
// }

// loading
function showLoading() {
  loadingBlock.classList.toggle("hide");
  loadingBlock.classList.add("fadeIn_05s");
  loadingBlock.classList.remove("fadeOut_05s");
}

function hideLoading() {
  loadingBlock.classList.remove("fadeIn_05s");
  loadingBlock.classList.add("fadeOut_05s");
  delay(500).then(() => {
    loadingBlock.classList.toggle("hide");
  });
}

// fetch
function fetchPage(pageURL) {
  // showLoading();
  fetch(window.location.origin + "/" + pageURL)
    .then((res) => res.text())
    .then((data) => {
      //   document.write(data);
      console.log(data);
      // hideLoading();
    });
}

/********************* initializing contents ************************/

let specialPanels = {};
let specialPanelsOpt = {};
let specialPanelsScenes = [];

let currentPageNumber = 0;

function disableNavigationButton() {
  console.log(currentPageNumber);
  if (currentPageNumber === 0) {
    lastButton.classList.remove("disabledButton");
    nextButton.classList.remove("disabledButton");
    firstButton.classList.add("disabledButton");
    prevButton.classList.add("disabledButton");
  } else if (currentPageNumber === listOfAllPages.length - 1) {
    firstButton.classList.remove("disabledButton");
    prevButton.classList.remove("disabledButton");
    lastButton.classList.add("disabledButton");
    nextButton.classList.add("disabledButton");
  } else {
    firstButton.classList.remove("disabledButton");
    prevButton.classList.remove("disabledButton");
    lastButton.classList.remove("disabledButton");
    nextButton.classList.remove("disabledButton");
  }
}

const error404 =
  '<div class="chapter-title">(404) konten tidak ditemukan / belum ada.</div>';

function detectPageNumber(hash) {
  return [...listOfAllPages].findIndex(
    (pages) => pages.value === hash.replace("#", "")
  );
}

// first page
if (!currentHash) {
  disableNavigationButton();
  // mulai insert page
  showLoading();
  selectButton.children[0].value = "prolog_1";
  fetch("/comics/prolog_1.html")
    .then((res) => res.text())
    .then((data) => {
      // parse html data
      let comicPageHTML = new DOMParser().parseFromString(
        data,
        "text/html"
      ).body;

      // add childs from comics file
      for (let index = 0; index < comicPageHTML.childNodes.length; index++) {
        let element = comicPageHTML.childNodes[index];
        // console.log(element);

        comicsPage.appendChild(element);
      }

      comicsPage.addEventListener("onload", function (e) {
        console.log("loaded");
      });

      // add interactions scripts
      let interactionsScript = document.createElement("script");
      interactionsScript.src = "comics/interactions.js";
      interactionsScript.id = "interactionsJS";
      frontendJS.insertAdjacentElement("afterend", interactionsScript);
      interactionsJS = document.getElementById("interactionsJS");

      // selesai insert page
      specialPanels = {};
      specialPanelsOpt = {};

      hideLoading();
    });
}

// all pages
else {
  currentPageNumber = detectPageNumber(currentHash);
  disableNavigationButton();
  currentPage = window.location.hash.replace("#", "");

  // mulai insert page
  showLoading();
  selectButton.children[0].value = window.location.hash.replace("#", "");
  fetch("/comics/" + window.location.hash.replace("#", "") + ".html")
    .then((res) => {
      if (res.status === 200) return res.text();
      if (res.status === 404) return (res = error404);
    })
    .then((data) => {
      // parse html data
      let comicPageHTML = new DOMParser().parseFromString(
        data,
        "text/html"
      ).body;

      // console.log("----");
      // console.log(comicPageHTML.children[0]);

      // add childs from comics file
      for (let index = 0; index < comicPageHTML.childNodes.length; index++) {
        let element = comicPageHTML.childNodes[index];
        // console.log(element);
        comicsPage.appendChild(element);
      }

      // add interactions scripts
      let interactionsScript = document.createElement("script");
      interactionsScript.src = "comics/interactions.js";
      interactionsScript.id = "interactionsJS";
      frontendJS.insertAdjacentElement("afterend", interactionsScript);
      interactionsJS = document.getElementById("interactionsJS");

      // selesai insert page
      specialPanels = {};
      specialPanelsOpt = {};
      // waitForElement(comicsPage).then((elm) => {
      //   console.log("all element load successfully");
      //   hideLoading();
      // });

      hideLoading();
    });
}

/********************* url hash change listener ************************/

let scrollMagicController = new ScrollMagic.Controller();

function deleteAllScene() {
  for (let index = 0; index < specialPanelsScenes.length; index++) {
    // console.log(specialPanelsScenes[index]);
    // specialPanelsScenes[index].remove();
    specialPanelsScenes[index].destroy();
    specialPanelsScenes[index].remove();
  }
  specialPanelsScenes = [];
}

window.addEventListener("hashchange", (e) => {
  disableNavigationButton();
  // console.log(specialPanelsScenes);

  // specialPanelsScenes.forEach((scene) => {
  //   console.log(scene);

  //   scene.remove();
  //   scene.destroy();
  //   specialPanelsScenes.shift();
  // });

  deleteAllScene();

  // check current url
  if (!window.location.hash) {
    selectButton.children[0].value = "prolog_1";
    window.location.hash = "prolog_1";
    currentPage = "prolog_1";
  } else {
    const getPageNumberFromHash = listOfAllPages[currentPageNumber].innerText;
    selectButton.children[0].value = window.location.hash.replace("#", "");
    document.getElementsByTagName("title")[0].innerText =
      siteTitle + " / " + getPageNumberFromHash;
    currentPage = getPageNumberFromHash;
  }

  // showLoading();

  fetch("/comics/" + window.location.hash.replace("#", "") + ".html")
    .then((res) => {
      if (res.status === 200) return res.text();
      if (res.status === 404) return (res = error404);
    })
    .then((data) => {
      // console.log(data);
      // parse html data
      let comicPageHTML = new DOMParser().parseFromString(
        data,
        "text/html"
      ).body;

      // clear all existing childs
      while (comicsPage.firstChild) {
        comicsPage.firstChild.remove();
      }

      // clear interactionsJS
      interactionsJS.remove();

      // add childs from comics file
      for (let index = 0; index < comicPageHTML.childNodes.length; index++) {
        let element = comicPageHTML.childNodes[index];
        // console.log(element);
        comicsPage.appendChild(element);
      }

      // add interactions scripts
      let interactionsScript = document.createElement("script");
      interactionsScript.src = "comics/interactions.js";
      interactionsScript.id = "interactionsJS";
      frontendJS.insertAdjacentElement("afterend", interactionsScript);
      interactionsJS = document.getElementById("interactionsJS");

      // window.location.reload();

      // selesai insert page
      // comicsPage.scrollIntoView();
      bodyScroll.scrollTo("top", { duration: 0 });
      specialPanels = {};
      specialPanelsOpt = {};
      // waitForElement(comicsPage).then((elm) => {
      //   console.log("all element load successfully");
      //   hideLoading();
      // });
    });
});

/********************* delay function ************************/
function delay(time) {
  // in ms
  return new Promise((resolve) => setTimeout(resolve, time));
}

/********************* page navigation listener ************************/
// goto first page
firstButton.addEventListener("click", (e) => {
  if (currentPageNumber === 0) return console.log("already on the first page");

  currentPageNumber = 0;
  const firstPage = listOfAllPages[0];
  window.location.hash = firstPage.value;
  //   console.log("first");
});

// goto last page
lastButton.addEventListener("click", (e) => {
  if (currentPageNumber === listOfAllPages.length - 1)
    return console.log("already on the end page");

  currentPageNumber = listOfAllPages.length - 1;
  const lastPage = listOfAllPages[listOfAllPages.length - 1];
  window.location.hash = lastPage.value;
});

// goto next page
nextButton.addEventListener("click", (e) => {
  if (currentPageNumber === listOfAllPages.length - 1)
    return console.log("already on the end page");

  currentPageNumber = currentPageNumber + 1;
  const nextPage = listOfAllPages[currentPageNumber];
  window.location.hash = nextPage.value;

  //   goTo(nextPage.value);
});

// goto prev page
prevButton.addEventListener("click", (e) => {
  if (currentPageNumber === 0) return console.log("already on the first page");

  currentPageNumber = currentPageNumber - 1;
  const prevPage = listOfAllPages[currentPageNumber];
  window.location.hash = prevPage.value;
});

//
selectButton.addEventListener("click", (e) => {
  allPagesToggle();
});

// goto selected page
selectButton.children[0].addEventListener("change", (e) => {
  //
  currentPageNumber = detectPageNumber(e.target.value);
  window.location.hash = e.target.value;
  //   goTo(e.target.value);
  //
});

/********************* sound aboutcomic aboutauthors ************************/
const leftButtons = document.getElementsByClassName(
  "left-navigation-buttons"
)[0].children;

// sounds
let soundsStatus = true;
function soundsToggle() {
  if (soundsStatus) {
    soundsStatus = false;
    alert("suara dimatikan.");
  } else {
    soundsStatus = true;
    alert("suara dinyalakan.");
  }
}
leftButtons[0].addEventListener("click", soundsToggle);

// about comic
const aboutComicPage = document.getElementById("contents-aboutComics");

function aboutComicToggle() {
  if (aboutComicPage.classList.contains("hide")) {
    aboutComicPage.classList.add("animate__slideInLeft");
    aboutComicPage.classList.remove("animate__slideOutLeft");
    aboutComicPage.classList.toggle("hide");
    document.body.style.overflowY = "hidden";
  } else {
    aboutComicPage.classList.remove("animate__slideInLeft");
    aboutComicPage.classList.add("animate__slideOutLeft");
    document.body.style.overflowY = "scroll";
    delay(700).then(() => {
      aboutComicPage.classList.toggle("hide");
    });
  }
}

leftButtons[1].addEventListener("click", aboutComicToggle);
contentsAboutClose[0].addEventListener("click", () => {
  aboutComicToggle();
});

// about authors
const aboutAuthorsPage = document.getElementById("contents-aboutAuthors");
function aboutAuthorsToggle() {
  if (aboutAuthorsPage.classList.contains("hide")) {
    aboutAuthorsPage.classList.add("animate__slideInLeft");
    aboutAuthorsPage.classList.remove("animate__slideOutLeft");
    aboutAuthorsPage.classList.toggle("hide");
    document.body.style.overflowY = "hidden";
  } else {
    aboutAuthorsPage.classList.remove("animate__slideInLeft");
    aboutAuthorsPage.classList.add("animate__slideOutLeft");
    document.body.style.overflowY = "scroll";
    delay(700).then(() => {
      aboutAuthorsPage.classList.toggle("hide");
    });
  }
}
leftButtons[2].addEventListener("click", aboutAuthorsToggle);
contentsAboutClose[1].addEventListener("click", () => {
  aboutAuthorsToggle();
});

// pages list

const allPagesList = document.getElementById("contents-allPages");
function allPagesToggle(close) {
  let scrollToWhere = "top";
  if (close === "close") {
    scrollToWhere = "bottom";
  }

  if (allPagesList.classList.contains("hide")) {
    allPagesList.classList.add("animate__slideInUp");
    allPagesList.classList.remove("animate__slideOutDown");
    allPagesList.classList.toggle("hide");
    document.body.style.overflowY = "hidden";
  } else {
    allPagesList.classList.remove("animate__slideInUp");
    allPagesList.classList.add("animate__slideOutDown");
    document.body.style.overflowY = "scroll";
    bodyScroll.scrollTo(scrollToWhere, { duration: 0 });
    delay(700).then(() => {
      allPagesList.classList.toggle("hide");
    });
  }
}

document.querySelector(".allPagesList-Close").addEventListener("click", () => {
  allPagesToggle("close");
});

const allPagesContainer = document.getElementById("contents-allPages");

allPagesContainer.addEventListener("click", (e) => {
  if (e.target.dataset.id) {
    currentPageNumber = detectPageNumber(e.target.dataset.id);
    window.location.hash = e.target.dataset.id;

    allPagesList.classList.add("animate__slideInUp");
    allPagesList.classList.remove("animate__slideOutDown");
    allPagesList.classList.toggle("hide");
    document.body.style.overflowY = "scroll";
  }
});

const bodyScroll = new Lenis({
  wrapper: window,
  content: document.getElementById("contents"),
  wheelMultiplier: 0.5,
  touchMultiplier: 0.1,
  touchInertiaMultiplier: 1,
  // syncTouch: true,
  // lerp: 0,
  duration: 5,
});

const pagesListScroll = new Lenis({
  wrapper: document.getElementById("contents-allPages"),
  // syncTouch: true,
  duration: 1,
});

// lenis.on("scroll", (e) => {
//   // console.log(e);
// });

function raf(time) {
  bodyScroll.raf(time);
  pagesListScroll.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

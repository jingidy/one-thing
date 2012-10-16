var mantras = [
"Love everyone.",
"Hesitate less.",
"Carry less.",
"Move more.",
"Want less.",
"Worry less.",
"Experience more.",
"Smile.",
"Laugh more.",
"Forgive more.",
"Listen more.",
"Fear less.",
"Be grateful for something.",
"Breath.",
"Enjoy the journey.",
"Brighten someone's day.",
"Relax"
];

var M = {
  eventMapping: {
    "WebkitTransition": "webkitTransitionEnd",
    "MozTransition": "transitionend",
    "OTransition": "oTransitionEnd",
    "msTransition": "MSTransitionEnd",
    "transition": "transitionEnd",

    "WebkitAnimation": "webkitAnimationEnd",
    "MozAnimation": "animationend",
    "OAnimation": "oAnimationEnd",
    "msAnimation": "MSAnimationEnd",
    "transition": "animationend"
  },
  
  prefixed: function (property) {
    if (property === "transitionEnd")
      return M.eventMapping[Modernizr.prefixed("transition")];
    if (property === "animationEnd")
      return M.eventMapping[Modernizr.prefixed("animation")];
    return Modernizr.prefixed(property);
  }
};

// Determine the max # of characters allowed the lazy way.
var letterWidth = 50;

var colorClasses = ["Blue", "Pink", "Green", "Orange", "Cyan"];
var currentColorIndex = 0;

// Init.
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("aboutButton").clickHandler(showAbout);
  document.getElementById("refreshButton").clickHandler(refresh);
  document.getElementById("text").clickHandler(startEditing);

  // Wait for transition complete to set the Finished class.
  var about = document.getElementById("about");
  about.addEventListener(M.prefixed("transitionEnd"), function () {
    if(!document.body.classList.contains("About"))
      about.style.display = "none";
    document.body.classList.add("Finished");
  });
  var field = document.getElementById("field");
  field.addEventListener(M.prefixed("transitionEnd"), function () {
    if(!document.body.classList.contains("Edit")) {
      field.style.display = "none";
      field.value = "";
    }
    document.body.classList.add("Finished");
  });

  field.addEventListener("blur", finishEditing);

  var savedText = Modernizr.localstorage ? localStorage["mantra"] : null;
  if (savedText)
    setText(savedText);
  else
    setRandomText();

  about.style.display = "none";
  field.style.display = "none";

  // prefix-free takes a while to process, and we don't wanna show the page until it's done.
  // But Safari does some weird stuff where it shows contents of body before drawing the background,
  // so just wait a hella long time to display the page instead of trying to be smart about it.
  setTimeout(function () {
    if (!parseFloat(getComputedStyle(document.body)[M.prefixed("transitionDuration")]))
      return;
    document.body.classList.add("Initialized"); 
  }, 1000);
});

function startEditing () {
  function finishEditingIfAppropriate(e) {
    if (e.keyCode !== 13)
      return;
    finishEditing();
    e.preventDefault();
    e.stopPropagation();
  }

  var field = document.getElementById("field");
  field.addEventListener("keypress", finishEditingIfAppropriate);
  field.style.display = "";
  setTimeout(function () {
    field.setAttribute("maxlength", Math.floor(document.getElementById("mainStuffz").offsetWidth / letterWidth));
    document.body.classList.remove("Finished");
    document.body.classList.add("Edit");
    field.focus();
  }, 0);
}

function finishEditing () {
  var field = document.getElementById("field");
  field.removeEventListener("keypress");
  var text = field.value;

  document.body.classList.remove("Finished");
  document.body.classList.remove("Edit");

  // Process text.
  setText(text);
}

function setText(text) {
  text = text.replace(/\s\s+/g, " ");
  if (!text.length)
    return;

  document.getElementById("text").innerHTML = text;

  // Store text so it's always the same.
  if (Modernizr.localstorage)
    localStorage["mantra"] = text;
  // Randomize background color everytime text changes.
  var randomColor = Math.floor(Math.random() * colorClasses.length);
  if (randomColor === currentColorIndex)
    randomColor = (randomColor + 1) % colorClasses.length;
  document.body.classList.remove(colorClasses[currentColorIndex]);
  document.body.classList.add(colorClasses[randomColor]);
  currentColorIndex = randomColor;
}

function setRandomText() {
  setText(mantras[Math.floor(Math.random() * mantras.length)]);
}

function refresh() {
  var text = document.getElementById("text");
  text.style.opacity = 0;
  // FIXME: for some reason I'm getting 2 transitionEnds, so just use a timer.
  setTimeout(function () {
    setRandomText();
    text.style.opacity = 1;    
  }, 500);
}

function showAbout() {
  var about = document.getElementById("about");
  about.style.display = "";

  // Wait for styles to be recalced
  setTimeout(function () {
    document.body.classList.remove("Finished");
    document.body.classList.add("About");

    // Dismiss if clicked outside of about.
    document.body.clickHandler(hideAbout);
    document.getElementById("blurb").clickHandler(function (e) {
      e.stopPropagation();
    })
  }, 0);
}

function hideAbout() {
  var about = document.getElementById("about");
  document.body.classList.remove("Finished");
  document.body.classList.remove("About");
  document.body.clickHandler();
  document.getElementById("blurb").clickHandler();
}

Element.prototype.clickHandler = function (func) {
  var thatFunc = func;

  function makeActive(e) {
    e.target.classList.add("Active");
  }
  function makeInactive(e) {
    e.target.classList.remove("Active");
    e.target.classList.remove("Hover");
  }
  function makeHover(e) {
    e.target.classList.add("Hover");
  }
  function execute(e) {
    func(e);
    makeInactive(e);
  }

  if ("ontouchend" in this) {
    if (!func) {
      this.removeEventListener("touchstart", makeActive);
      this.removeEventListener("touchend", makeInactive);
      this.removeEventListener("touchcancel", execute);
      return;
    }
    this.addEventListener("touchstart", makeActive);
    this.addEventListener("touchcancel", makeInactive);
    this.addEventListener("touchend", execute);
  } else {
    if (!func) {
      this.removeEventListener("mouseover", makeHover);
      this.removeEventListener("mouseout", makeInactive);
      this.removeEventListener("mousedown", makeActive);
      this.removeEventListener("mouseup", makeInactive);
      this.removeEventListener("click", execute(e));
      return;
    }
    this.addEventListener("mouseover", makeHover);
    this.addEventListener("mouseout", makeInactive);
    this.addEventListener("mousedown", makeActive);
    this.addEventListener("mouseup", makeInactive);
    this.addEventListener("click", execute);
  }
}

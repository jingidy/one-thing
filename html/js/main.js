// Init.
document.addEventListener("DOMContentLoaded", function () {
  
  document.getElementById("aboutButton").clickHandler(showAbout);
  document.getElementById("text").clickHandler(startEditing);

  // Wait for transition complete to set the Finished class.
  var about = document.getElementById("about");
  about.addEventListener("webkitTransitionEnd", function () {
    if(!document.body.classList.contains("About"))
      about.style.display = "none";
    document.body.classList.add("Finished");
  });
  var field = document.getElementById("field");
  field.addEventListener("webkitTransitionEnd", function () {
    if(!document.body.classList.contains("Edit")) {
      field.style.display = "none";
      field.value = "";
    }
    document.body.classList.add("Finished");
  });

  field.addEventListener("blur", finishEditing);

  setText("Enjoy the show.");

  about.style.display = "none";
  field.style.display = "none";

  document.body.classList.add("Initialized");
});

function startEditing () {
  var field = document.getElementById("field");
  field.style.display = "";
  setTimeout(function () {
    document.body.classList.remove("Finished");
    document.body.classList.add("Edit");
    field.focus();
  }, 0);
}

function finishEditing () {
  var field = document.getElementById("field");
  var text = field.value;

  document.body.classList.remove("Finished");
  document.body.classList.remove("Edit");

  // Process text.
  setText(text);
}

function setText(text) {
  function noOp () {}

  text = text.replace(/(\S)/g, "<span>$1</span>");
  if (!text.length)
    return;

  document.getElementById("text").innerHTML = text;
  var letters = document.querySelectorAll("#text > span");
  for (var i = 0; i < letters.length; i++)
    letters.item(i).clickHandler(noOp);
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

  if ("ontouchend" in this) {
    if (!func) {
      this.removeEventListener("touchstart");
      this.removeEventListener("touchend");
      this.removeEventListener("touchcancel");
      return;
    }
    this.addEventListener("touchstart", makeActive);
    this.addEventListener("touchcancel", makeInactive);
    this.addEventListener("touchend", function (e) {
      func(e);
      makeInactive(e);
    });
  } else {
    if (!func) {
      this.removeEventListener("mouseover");
      this.removeEventListener("mouseout");
      this.removeEventListener("mousedown");
      this.removeEventListener("mouseup");
      this.removeEventListener("click");
      return;
    }
    this.addEventListener("mouseover", makeHover);
    this.addEventListener("mouseout", makeInactive);
    this.addEventListener("mousedown", makeActive);
    this.addEventListener("mouseup", makeInactive);
    this.addEventListener("click", function (e) {
      func(e);
      makeInactive(e);
    });
  }
}

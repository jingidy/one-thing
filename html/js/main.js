// Init.
document.addEventListener("DOMContentLoaded", function () {
  
  document.getElementById("aboutButton").clickHandler(showAbout);

  // Wait for transition complete to set the Finished class.
  var about = document.getElementById("about");
  about.addEventListener("webkitTransitionEnd", function () {
    if(!document.body.classList.contains("About"))
      about.style.display = "none";
    document.body.classList.add("Finished");
  });

  document.getElementById("editButton").clickHandler(function (e) {
    // edit.
  });

  // Hide about
  document.getElementById("about").style.display = "none";

  document.body.classList.add("Initialized");
});

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

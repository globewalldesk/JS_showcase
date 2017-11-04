// GLOBALS
var code_lines = [];
var present_file_loadable = true;
var this_file = [];

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DISPLAY FUNCTIONS TO USER

function load_present_file_for_code_reporter() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET","javascript/showcase.js");
  xhr.send(null);
  xhr.onreadystatechange = function(){
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        this_file = xhr.responseText.match(/[^\r?\n]+/g);
      } else {
        present_file_loadable = false;
      }
    }
  };
}

// Return an array containing the text of the input function.
function load_function_text(funShun) {
  // Iterate through the present JS file's text.
  var line_num = 0; // Track line num so you can grab the previous line.
  var current_function = [];
  var copying_lines = false;
  this_file.forEach(function(line) {
    // Start copying when 'function funShun' is spotted. (Start pushing from previous line.)
    if (line.match("function " + funShun)) {
      current_function.push(this_file[line_num - 1]);
      current_function.push(line);
      copying_lines = true;
      line_num += 1;
    // Stop copying and return when '}' by itself is spotted.
    } else if (copying_lines && line === "}") {
      // Add this line.
      current_function.push(line);
      // Stop copying when end of function is reached.
      copying_lines = false;
    } else {
      // Omits the lines that call codeReporter(); pushes all others.
      if (copying_lines && !line.match(/codeReporter\("/)) current_function.push(line);
      line_num += 1;
    }
  });
  return current_function;
}

function display_function_modal(funShun) {
  alert(load_function_text(funShun.name).join('\n'));
}

// First, check if XHR is supported by the browser.
if (window.XMLHttpRequest) {
  load_present_file_for_code_reporter();
} else {
  support_for_File_API = false;
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EVENT AND CODE BOX HANDLERS
// Fills in the event-box.
function eventReporter(e) {
  if (e.type !== "keypress") e.preventDefault();
  var display = ''; // Text to display in event box.
  display += ("<li>Event type: <code>" + e.type + "</code></li>");
  var target_box = ($(e.target).attr('id') ? $(e.target).attr('id') : $(e.target).parent().attr('id'));
  display += ("<li>Target box: <code>" + target_box + "</code></li>");
  $("#event-box-content").html(display);
}

// Fills in the code-box.
function codeReporter(fun) {
  less_fun = fun.replace(/\(\)/, '');
  // Convert line to HTML.
  line = "<li>" + code_lines.length + "<code>" + fun + "</code>" +
         "<span class='code_modal_link'><a href='#' onclick='display_function_modal(" + less_fun +
         ")'>view</a></span></li>";
  // Add line to (global) code_lines.
  code_lines.unshift(line);
  // Recreate contents of code-box.
  $("#code-box-content").html(code_lines.slice(0,5));
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EDIT BOX HANDLERS
// Adds box-darkening on mouseover.
function darkenBox(e) {
  e.preventDefault();
  var target_box = ($(e.target).attr('id') ? $(e.target) : $(e.target).parent());
  $(target_box).css("border", "gray 1px solid");
}

// Removes box-darkening when leaving.
function removeHighlights() {
  $(".edit-box, .edit-box > p").css({
    "border": ""
  });
}

// Opens a text box for editing.
function openForEditing(box) {
  codeReporter("openForEditing()");
  // Save old text to variable.
  var old_text = $(box).text();
  old_text = old_text.replace(/\s+/g, " ").trim(); // The saved text needs extra whitespace to be stripped.
  // Hide old text so that the box is the correct size.
  $(box).text("");
  $(box).css({
    height: "100%",
    backgroundColor: "lightgray"
  });
  // Create a hidden div so that the size of the textarea is correct.
  var hidden_div = $("<div>").text(old_text).css({
    visibility: "hidden"
  });
  // Create box for editing.
  var edit_box = $("<textarea>")
    .attr({
      type: "text",
      spellcheck: "false",
      autofocus: "autofocus"
    })
    .css({
      position: "absolute", // Handily shares the space with the hidden_div.
      width: "95%",
      height: "95%",
      resize: "none"
    })
    .val(old_text);
  // Create save and cancel buttons.
  // Append new items to .edit-box
  edit_box.appendTo(box);
  hidden_div.appendTo(box);
  // Need to set autofocus separately with jQuery so it works in Firefox.
  if (! document.createElement("input").autofocus) {
    $(edit_box).focus();
  }
}

// After user saves edit, display in red in lower right: "Saved."
function flash_saved(box) {
  codeReporter("flash_saved()");
  // load_function_text("flash_saved");
  var flash = $("<span>").text("Saved.").css({
    color: "red",
    textAlign: "right"
  });
  flash.appendTo(box);
  setTimeout(function() {
    flash.remove();
  }, 1000);
}

// Save textbox when enter is pressed.
function saveOnEnter(e) {
  codeReporter("saveOnEnter()");
  e.preventDefault();
  var box = ($(e.target).attr('id') ? $(e.target) : $(e.target).parent());
  // Grab the current value of the textarea.
  var new_text = box.find("textarea").val();
  // Empty the current contents of the box.
  box.empty();
  // Write the new text to the box.
  box.css("background-color", "white");
  box.text(new_text);
  flash_saved(box);
}

// Handles clicking inside edit box.
function handleClickInBox(e) {
  codeReporter("handleClickInBox()");
  e.preventDefault();
  var box = ($(e.target).attr('id') ? $(e.target) : $(e.target).parent());
  // Open for editing only if not already open for editing.
  if ($(box).find("textarea").length === 0) openForEditing(box);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BOX MANIPULATION (DRAG-AND-DROP, NEW, AND DELETE
//
function dragEditBox(e) {
  console.log(typeof e);
  console.log("I'm draggin!");
  e.preventDefault();
  e.dataTransfer.setData("text", e.target);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// WIKIPEDIA INTERFACE METHODS
// Accepts search term from user, searches Wikipedia API, and returns data from API.
function executeWikipediaSearch(userSearch) {
  codeReporter("executeWikipediaSearch()");
  var searchQuery = wikifySearchTerm(userSearch);
  $(document).ready(function(){
    $.ajax({
      type: "GET",
      url: "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + searchQuery + "&callback=?",
      dataType: "json",
      success: function(data) {
        console.log(JSON.stringify(data, null, 2));
        // var response = JSON.parse(data);
        if (!data.error) {
          displayWikipediaData(data.parse.text["*"]);
        } else {
          handleWikipediaAPIError(data);
        }
      }
    });
  });
}

// For now, just adds "_" in place of " " to search terms.
function wikifySearchTerm(userSearch) {
  codeReporter("wikifySearchTerm()");
  return userSearch.replace(" ", "_")
}

// Inserts the WP data (already in HTML form, a little formatting needed), with a light line on top.
function displayWikipediaData(data) {
  codeReporter("displayWikipediaData()");
  $("#wikipedia-article").css({
    borderTop: "1px lightgray solid",
    paddingTop: "20px"
  }).html(data);
}

// Error message if Wikipedia article isn't fetched.
function handleWikipediaAPIError(data) {
  codeReporter("handleWikipediaAPIError()");
  if (data.error.code === "invalidtitle") data.error.info = "The title couldn't be found. Can't be blank."
  $("#wikipedia-article").html("<p class='alert alert-danger text-center'><b>" + data.error.info +
    "</b> <small>(" + data.error.code + ")</small></p>");
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EVENT LISTENERS
// Event listeners for edit boxes.
$(".edit-box")
  .click(function(e) {
                      eventReporter(e);
                      handleClickInBox(e);
}).mouseover(function(e) {
                      eventReporter(e);
                      darkenBox(e);
}).mouseleave(function(e) {
                      eventReporter(e);
                      removeHighlights();
}).keypress(function(e) {
                      eventReporter(e);
                      if (e.key === "Enter") saveOnEnter(e);
}).draggable({
                      dragstart: dragEditBox
});

// Event listeners (in plain JS, for practice) for dragging edit boxes.
var editBoxes = document.querySelectorAll(".edit-box");
for (var i = 0; i < editBoxes.length; i++) {
  editBoxes[i].addEventListener("dragstart", dragEditBox);
}
//////////// NEXT NEXT NEXT!!!!! Look at p. 328; set up dragEditBox(), which actually drags the box;
// change "click" to call editing function only if dragging *didn't* happen (will probably have to be a global
// that is set after every drag, and cleared after every click (but *not* before preventing editing from being called).
// In other words, dragging will set a "dragged" variable to true; dropping will fire a click event, which (in that
// case) will simply set the "dragged" variable to false; and then if you click (without dragging) any editable div,
// *then* it will open the editing dialogue.
// For dragover, if one edit-box drags over another, then essentially first takes the place of the second, which
// moves to the left if it has a lower rank, or to the right if it has a higher rank. This means the divs will have
// to "know" what rank they have. So if they're in order 1, 2, 3, then if you drag 1 onto 2, then they immediately
// (before drop) reorder to 2, _, 3, leaving 1 where it is on the user's mouse. Similarly, if you drag 3 onto 2, then
// it looks like 1, _, 2. Dropping doesn't happen if 3 isn't actually on target.
// Probably what needs to happen is that all this calculation is done in the background. If the order is 1, 2, 3, 4, 5,
// then basically, when you move any one of them onto any other, you'll have to calculate which direction they all
// move in, then redraw the divs, leaving a space for the slot most recently touched.
// Since you want to be able to create as many divs as possible (there will be a "new" function), you'll have to
// actually use jQuery to reconstruct the whole edit-box area whenever the target touches a different edit-box.
// Looks like this whole thing will take several hours.

// Event listeners for Wikipedia fetch elements.
$("#wp-search-input")
  .click(eventReporter)
  .keypress(function(e) {
                      eventReporter(e);
                      if (e.key === "Enter") {
                        executeWikipediaSearch($("#wp-search-input").val());
                      }
  });
$("#wp-search-button")
  .click( function(e) {
                      eventReporter(e);
                      executeWikipediaSearch($("#wp-search-input").val());
  });
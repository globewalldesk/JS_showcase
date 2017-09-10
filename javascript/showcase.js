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
        // What line ending to split on depends on the OS.
        if (navigator.appVersion.indexOf("Win") !== -1) {
          this_file = xhr.responseText.split("\r\n");
        } else {
          this_file = xhr.responseText.split("\n");
        }
      } else {
        present_file_loadable = false;
      }
    }
  };
}
// Tester
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
    } else if (copying_lines && line == "}") {
      // Add this line.
      current_function.push(line);
      // Stop copying when end of function is reached.
      copying_lines = false;
    } else {
      if (copying_lines) current_function.push(line);
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
// EVENT BOX HANDLERS
// Fills in the event-box.
function eventReporter(e) {
  if (e.type !== "keypress") e.preventDefault();
  var display = ''; // Text to display in event box.
  display += ("<li>Event type: <code>" + e.type + "</code></li>");
  var target_box = ($(e.target).attr('id') ? $(e.target).attr('id') : $(e.target).parent().attr('id'));
  display += ("<li>Target box: <code>" + target_box + "</code></li>");
  $("#event-box").html(display);
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
  $("#code-box").html(code_lines.slice(0,5));
}

// Adds box-darkening on mouseover.
function darkenBox(e) {
  // codeReporter("darkenBox()");
  e.preventDefault();
  var target_box = ($(e.target).attr('id') ? $(e.target) : $(e.target).parent());
  $(target_box).css("border", "gray 1px solid");
}

// Removes box-darkening when leaving.
function removeHighlights() {
  // codeReporter("removeHiglights()");
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
  $(box).css("height", "100%");
  // Create a hidden div so that the size of the textarea is correct.
  var hidden_div = $("<div>").text(old_text).css({
    visibility: "hidden"
  });
  // Create box for editing.
  var edit_box = $("<textarea>")
    .attr({
      type: "text",
      spellcheck: "false"
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
  $(edit_box).focus(); // Need to set autofocus separately with jQuery so it works in Firefox.
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
  }, 2000);
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
// EVENT LISTENERS FOR event-box.
// Set-up for event listeners for event-box.
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
});

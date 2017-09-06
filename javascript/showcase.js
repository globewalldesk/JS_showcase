// GLOBALS
var code_lines = [];

// EVENT BOX LISTENERS
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
function codeReporter(line, e) {
  // Convert line to HTML.
  line = "<li>" + code_lines.length + "<code>" + line + "</code></li>";
  // Add line to (global) code_lines.
  code_lines.push(line);
  // Recreate contents of code-box.
  $("#code-box").html(code_lines);
}

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
  // Save old text to variable.
  var old_text = $(box).text();
  codeReporter('var old_text = $(box).text();');
  old_text = old_text.replace(/\s+/g, " ").trim(); // The saved text needs extra whitespace to be stripped.
  // Hide old text so that the box is the correct size.
  $(box).text("");
  codeReporter('$(box).text(""); // Hide old text.');
  $(box).css("height", "100%");
  codeReporter('$(box).css("height", "100%"); // Make text box full height.');
  // Create a hidden div so that the size of the textarea is correct.
  var hidden_div = $("<div>").text(old_text).css({
    visibility: "hidden"
  });
  codeReporter('var hidden_div = $("&lt;div&gt;").text(old_text).css({visibility: "hidden"});');
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
  codeReporter('var edit_box = $("&lt;textarea&gt;").attr(...).css(...).val(old_text);');
  // Create save and cancel buttons.
  // Append new items to .edit-box
  edit_box.appendTo(box);
  codeReporter('edit_box.appendTo(box)');
  hidden_div.appendTo(box);
  codeReporter('hidden_div.appendTo(box);');
  $(edit_box).focus(); // Need to set autofocus separately with jQuery so it works in Firefox.
  code_lines = [];
}

function flash_saved(box) {
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
  e.preventDefault();
  var box = ($(e.target).attr('id') ? $(e.target) : $(e.target).parent());
  codeReporter("var box = ($(e.target).attr('id');");
  // Grab the current value of the textarea.
  var new_text = box.find("textarea").val();
  codeReporter('var new_text = box.find("textarea").val();');
  // Empty the current contents of the box.
  box.empty();
  codeReporter('box.empty(); // Empty the box.');
  // Write the new text to the box.
  box.text(new_text);
  codeReporter('box.text(new_text); // Write new text.');
  code_lines = [];
  flash_saved(box);
}

// Handles clicking inside edit box.
function handleClickInBox(e) {
  e.preventDefault();
  var box = ($(e.target).attr('id') ? $(e.target) : $(e.target).parent());
  // Open for editing only if not already open for editing.
  if ($(box).find("textarea").length === 0) openForEditing(box);
}

// Set-up for event listeners for event-box.
$(".edit-box").on("click", function(e) {
  eventReporter(e);
  handleClickInBox(e);
}).on("mouseover", function(e) {
  eventReporter(e);
  darkenBox(e);
}).on("mouseleave", function(e) {
  eventReporter(e);
  removeHighlights();
}).on("keypress", function(e) {
  eventReporter(e);
  if (e.key === "Enter") saveOnEnter(e);
});

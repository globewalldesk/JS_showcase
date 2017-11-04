# BASIC FEATURES

- DONE Create an "event reporting" box, the content of which automatically changes depending what the user is doing.
  Not too much information. Just the stuff that matters: a few event types; the target of each event; cursor coords; 
  drag-related events (dragstart, dragover, drop); mouseover vs. mouseout. Perhaps these events are reported only
  with respect to the current, highlighted box.
- NEEDS STYLING Create a "how'd you do that?" box, the content of which give specific code you use (mostly jQuery; 
  consider adding equivalent plain JavaScript, but that might be a bad idea).
- Label the widgets clearly.
- Let users input some CSS values to see what will do what; then show resulting code in "how'd you do that?".
- Consider using cookies and storage to save the page state (if that is really feasible; probably isn't).
- Show/hide version/location of jQuery upon button press.
- Basically, you futz with the contents of the "how'd you do that?" box _within the operational method itself_.

# DRAGGING AND STYLING:

- Create a number of widgets (boxes with random quotes) that can be dragged around and reordered.
- Write a method that detects what object was dragged onto, and inserts the before that object. But see below, under 
  append().
- Create buttons that control a few styling elements of the items. Put them in an "edit" button.
- DONE: Also allow the text itself to be edited via the "edit" interface.
- Highlighting widgets allows illustration of arrow keypress 
- append() - need to let users do this to widgets. Basically, you should be able to append if the whole (really, the
  middle) of the widget is selected. If the target is in between, then it doesn't append but goes in between.
- Let user create new widgets.

# SPECIAL JQUERY METHODS TO ILLUSTRATE UNIQUELY
- toggleClass() - "Toggle class" button illustrates what this does.
- addClass() and removeClass()
- remove() - delete a whole element. (Allow it to be gotten back somehow?)
- empty() - to show difference
- attr()...misc futzing.
- 

# IFRAMES

- Give users a selection of links.
- Clicking on them opens them up in an iframe.
- Give users the option to close the window.
- Display some corresponding info in a div, such as location.href, etc.

# XHR

- DONE: Eventually, create some sort of feature, illustrating XHR, that returns definitions from a simple dictionary 
  app. (Done, with Wikipedia.)
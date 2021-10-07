* add a setting for string format (e.g. rgb(0,0,0) vs rgb(0, 0, 0)) ("add spaces" vs "strip spaces") (or make this a command)
* maybe a setting or command for lowercase vs uppercase hex
* setting for how to round hsl (the h; and the s & l)
* do individual commands, e.g. "Convert Color: to rgb"
* write tests
  * select nothing and run command
  * select invalid color and run command
  * select multiple colors, one or more is invalid, and run command
  * select multiple colors, one or more is empty, and run command
  * unit tests
  * test the different commands
  * test setting(s)
* what's the difference between registerCommand and registerTextEditorCommand?
* fancify it
  * make a gif for the readme
* if the first selected line isn't a color, still provide a preview conversion in the menu
* figure out why the tests need waits, and remove them

DONE
* convert rgba array to string
* add an input box in extension - to get hex from user
* perhaps instead of taking an input, it should use the selected text
* perhaps have the command palette just be "convert color" and then once that's selected, have a menu pop up with each option to convert to and display a preview of what the first selected item will change to (although this requires more typing from user, so might not be as good?)
* keep watching the video https://www.youtube.com/watch?v=q5V4T3o3CXE&list=WL&index=2
* write tests
  * select one color and run command
  * select multiple colors and run command
  * unit tests
  * upper vs lower case for hex

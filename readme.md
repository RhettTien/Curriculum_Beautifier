# Curriculum Beautifier

> Curriculum Beautifier , a tool to help you beautify your curriculum, building by love.



<a href="https://rhetttien.github.io/Curriculum_Beautifier/website/index.html">website demo</a>



<img src=".\website\screen\screen_shot.png" alt="screen_shot" style="zoom: 50%;" />

---

It all started with an internet stroll where I was browsing a social media post that contained a photo of this class schedule (Figure 2). It likely came from an official college website, but I didn't ask the person who posted it. I envisioned a day when I could implement a page with the same effect myself through HTML technology, and today is that day!

<img src=".\website\screen\web.jpg" alt="web" style="zoom:67%;" />

This little toy project allowed me to learn more about web front-end and JavaScript technologies, which is great.

---

**Be sure to check the type you want to use before you use it!**

The page will not automatically save the data, if necessary, click Export JSON file can be saved to the hard disk.

JSON template files can be imported and exported, importing JSON files will automatically refresh, supports the setting of a single 'item' (item means a label), as well as multiple 'items' at a time, using `?` Split can be , the following is an example:

day of week:

`1?1?1?2?3`

lessons:

`1?2?5?2?3`

course name:

`Math?Japanese?Art?Lunch?English`

The example represents adding the 1st, 2nd, and 5th sessions of the first day, the second session of the second day, and the third session of the third day.

Ensure that characters are entered in each input box and that the number of divisions is the same for each input box.

'time' and 'location' I'm omitting here, if you don't need this field, **it's mandatory to use a non-space character for the placeholder as well**.

---

**It's a pain in the ass to set up, so it's more recommended to use JSON file editing.**

**notice:**

Do not change the number contained in 'lesson' !

Select the desired style type before exporting the JSON template, then follow the order of your real table to modify it.

If you want 'lesson1' not to be displayed on the page, leave the first quote of the 'lesson1' array empty, then put any character in the third quote to avoid displaying the exception.

Here's the saved image (screen capture may give better image results):

<img src=".\website\screen\snipaste.png" alt="web" style="zoom:33%;" />

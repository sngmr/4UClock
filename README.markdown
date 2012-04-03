4UClock
=======

What's this app?
----------------
Welcome to 4UClock.

This application is showing beauties once a minutes from "4u beauty image bookmarking" (<http://4u-beautyimg.com/>) for iPhone, iPad.

![ScreenShot](https://github.com/sngmr/4UClock/raw/master/_assets/github_images/screenshot.png)

Function
---------------------
+ Showing Japanese beauties (not every, but almost!!) 
+ Swipe the screen, execute "Emergency Mode" I named. If you notice that your boss, girl you like and wife is coming in. No worries. Just swipe the screen, as soon as this app change screen to just showing clock. Swipe again, start showing beauties, again.

How to compile
--------------
This application made for Titanium Mobile. You need to install it on your OSX via http://www.appcelerator.com, and prepare for iOS application development, like install Xcode, etc.

How to clone
------------
Clone this project

    git clone git@github.com:sngmr/4UClock.git

Clone submodules. This projects require "jasmin-titanium" and "jasmine".

    cd 4UClock
    git submodule init
    git submodule update
    cd Resources/vendor/jasmine-titanium/
    git submodule init
    git submodule update
    
How to run unit test
--------------------
Run terminal and execute command below.

    cd (ProjectFolder)/Resources
    ./specs.py
    
**Sorry, unit test code is under construction :P**

License
-------
Check "LICENSE.txt"

Developer
---------
[@sngmr] (http://twitter.com/sngmr)(<http://d.hatena.ne.jp/sngmr>)
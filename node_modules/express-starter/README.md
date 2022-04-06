## express-starter

A very simple boilerplate to get [express.js](http://expressjs.com) projects off the ground quickly.

Features:

* Uses Mustache for templating (via Consolidate.js)
* Uses assets folder to serve static files to a folder at the root.
	* /assets/css/file.css would be served to htp://localhost:port/css/file.css
* Logs 404 errors to the console (Disable this for production environments.)
* Logs all other errors to the console. (You may or may not want to disable this in production.)
* Skeleton CSS
* LESS setup
* Minification of assets
	* Enabled for LESS
	* Other assets *not yet implemented*

---

### Requirements

```
npm install
```

The above command should grab all the dependencies for you.

However, the boilerplate currently uses these packages:

* node.js
* express.js
* consolidate.js
* express-less.js
* mustache

---

### Configure

Via NPM:

```
cd myNewProject
npm install express-starter
```

From repo:

```
git clone https://github.com/shakna-israel/express-starter.git
cd express-starter
npm install
```

The above set of commands will grab you the repository, and install all the dependencies.

### Folder Structure

The default file and folder structure is as follows:

* README.md
* app.js
* package.json
* assets
    * css
        * Any CSS Files
    * img
        * Any Image Files
    * js
        * Any Client-side JS files
    * less
        * skeleton.less
* views
    * index.html
    * error.html
    * partials
        * head.html
        
The rendered file structure would be similar to:

* /
* /css/skeleton.css
* /img/someImageFile.png
* /js/someClientJS.js

### Run

Running the app is as simple as:

```
node app.js
```

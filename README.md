my2cents
============

**[my2cents](http://my2cents-app.azurewebsites.net)** Take a moment and register your 2 cents. Company. Self. In one simple click. Change the course of leadership decisions, bring power to the people....without needing a picket line.


The idea was born from the realization that corporations either don’t value employee engagement enough to measure it, or are using ineffective methods for today’s rapidly changing economy.

<p align="center">
  <img src="http://i.imgur.com/4nde7PN.png"/>
</p>

**[my2cents](http://my2cents-app.azurewebsites.net)** is a mobile-optimized web application, built using the MEAN stack, and is currently deployed at **[http://my2cents-app.azurewebsites.net](http://my2cents-app.azurewebsites.net)**.


Instructions to get started
==============================

You may demo the application by  **[visiting my2cents](http://my2cents-app.azurewebsites.net)**  at the url above.

To run the application locally, see the *Running my2cents locally* section below.


Walkthrough
==================

### For Employees

my2cents allows you and your co-workers to anonymously broadcast your sentiments about the workplace in real-time. Employees can submit their opinion once per day with a simple touch and hold interface.

<p align="center">
  <img src="http://i.imgur.com/ulrAk1W.png"/>
</p>


### For Employers / Executives

View the sentiment of the employees at your company.  Track results over time and compare data to changes in HR policy to monitor how the choices you make affect the overall happiness of your employees.

![Imgur](http://i.imgur.com/L6XUqA6.png)


Technology stack
============


* **[MongoDB](http://neo4j.org)** *Schema-less NoSQL Database*

* **[express](http://expressjs.com)** *Web application framework wrapping node*

* **[angular](http://angularjs.org)** *HTML/JS application framework*

* **[node](http://nodejs.org)** *Server-side JS*

* **[d3.js](http://d3js.org)** *Data-visualization framework*

* **[Morris.js](http://morrisjs.github.io/morris.js/index.html)** *Charting library* 

* **[Grunt](http://gruntjs.com/)** *Javascript task runner*

* **[mocha](http://visionmedia.github.io/mocha/)** *Testing framework, used to run tests*

* **[supertest](https://www.npmjs.org/package/supertest)** *HTTP-request assertion library used with mocha* 


Challenges
==================

* Integrating a decent size d3.js codebase with Angular.js
* Responsive web-design, to ensure a clear and adaptable layout on both mobile and desktop platforms


The Team
==================

[Marco Au](https://github.com/marcoau), [Vin Halbwachs](https://github.com/vhalbhwachs), [Omkar Vedpathak](https://github.com/omkarv)


Configuring **my2cents** on your own machine
==================

## Setting environment variables

### Client side

*More information coming soon!*

### Server side

*Server side variables are set through the shell, and accessed using* `process.env.VAR_NAME` *in* **node**. *An actual deployment may need these to be configured in a deployment script, the format of which is dependant on your hosting service.*

 If you are running the server from a local machine (`http://localhost:8000`), this can be skipped.


## Bootstrapping

You'll need to use **grunt** and a local instance of **Mongo DB**.

#### Installing **grunt**

* npm install -g grunt-cli

#### Installing **MongoDB**

* If you use **[Homebrew](http://brew.sh/)**, `brew install mongodb`

* If you're not using **[Homebrew](http://brew.sh/)**, follow the instructions on the [**Mongo DB** site](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/), following the directions under the section titled *Installing MongoDB Manually*

* Once installed, start up the database with either `mongod`, or `sudo mongod` if you don't have the appropriate permissions when using the former command

### Bootstrapping a client

*More information coming soon!*

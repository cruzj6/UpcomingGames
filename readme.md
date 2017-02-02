#Upcoming Games WebApp
A web app for tracking info about upcoming video games, your favorite video games and more!

###Track Info on upcoming, and currently released Games
<img src="https://raw.githubusercontent.com/cruzj6/UpcomingGames/master/webapp/media/ss_tracked.png" width="750"><br/>

###Search for Games To Track
<img src="https://raw.githubusercontent.com/cruzj6/UpcomingGames/master/webapp/media/ss_search.png" width="750"><br/>

###Advanced Games Search
<img src="https://raw.githubusercontent.com/cruzj6/UpcomingGames/master/webapp/media/ss_advanced.png" width="750"><br/>

###View Most Tracked Games
<img src="https://raw.githubusercontent.com/cruzj6/UpcomingGames/master/webapp/media/ss_top.png" width="750"><br/>

###Mobile Friendly
<img src="https://raw.githubusercontent.com/cruzj6/UpcomingGames/master/webapp/media/ss_mobile.png" width="750"><br/>

###To Build Locally
PreReqs:
npm installed
gulp installed

First you need to create a .env file at the root of the project with the following template (Copy and paste and replace place holders):
```
BING_KEY=<Bing API key>
DATABASE_URL=<postgres databse url>
GB_KEY=<GiantBomb API key>
STEAM_API_KEY=<Steam API key>
HOME_URL=<{protocol}://{host}:{port}>
PGSSLMODE=require
```
Next run
```
npm install
```
to install node modules

Finally run (requires angular-cli installed):
```
ng build --watch
```
to begin watching for code changes

Run to start the express server:
```
npm start
```

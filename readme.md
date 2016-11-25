#Upcoming Games WebApp
A web app for tracking info about upcoming video games, your favorite video games and more!

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

Next run (requires gulp installed):
```
gulp
```
to begin watching for code changes

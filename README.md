# Uber Frontend Challenge

![alt tag](http://www.mbenedetto.com/wp-content/uploads/2016/03/Screen-Shot-2016-03-24-at-23.55.18-1024x563.png)


**Objective:** Create an interactive experience, based on a dataset of filming locations in San Francisco.

**How to run:** 
```
$ git clone [this Repo]
$ npm install
$ npm start
```

**Tech stack:** 
- Both the frontend and the backend are written on ES6, and transpiled with Babel. 
- The static view is rendered with Jade, all the dynamic HTML by React.
- The map is rendered by Leaftlet, and the styling is done with LessCSS.
- The backend is a NodeJS application, powered by Express.
- The persistence layer uses a single JSON file
- The static assets are being handled by Grunt. And all the JS modules are being bundled by browserify.
- Tested on IE 9+, Chrome, FF


**Preprocessing the dataset:**   
Before starting to work on the application, it was necessary to preprocess the dataset, in order to normalize the existing data, and also to add more data coming from different open APIs.
In particular, the locations' data has been geocoded with Google Maps and Google Street View. On the other hand, every movie has been matched with data coming from the IMDB api. 

- First, we started storing unique IDs for every entity (movies, locations, people involved on the movies). 
- Different entities are related by these IDs, as 'foreign keys', if we were working with a relational database. However, as the whole dataset is lighter than 500kb, we keep it in a .json file.
- As the locations data was quite messy, we had to try different variants to get good geocoding information from Google. For instance, an address like "Epic Roasthouse (399 Embarcadero)". If we request data for the whole address, plus ", San Francisco" we get the geocoding for the city of San Francisco. 
So, we had to identify patters, and test three variants in this case:    
     *Epic Roasthouse (399 Embarcadero), San Francisco*   
     *Epic Roasthouse, San Francisco*   
     *399 Embarcadero, San Francisco*   
- Once we get the results for the three variants, we check each level of accuracy of each, and pick the best response.


**Architecture**   
Due to the small size of the dataset, I decided not to use a database and keep the data in memory in the Express application. This gave me the excuse also, to do filtering by myself with functional programing techniques.

On the frontend, however, the way we treat information, is like we would with a much bigger dataset. The only data we're caching on the frontend is the one for districts, wich is only an array of 60 elements. All the rest is lazy loaded, when required.

The flow of the data in the frontend uses a "flux-like" approach. As the views are rendered by React, these call actions on the action creators. These "action creators" are encharged of communicating with the server and trigger actions which modify the stated of the "stores".   
Between actions and stores, the dispatcher sends events, to whichever store wants to listen. For the scope of this app, we didn't need all the overhead of the Facebook's dispatcher, and ended up using Node's standard Pub/Sub module.    

As the app has two big regions, with mostly separated scopes (the sidebar and the map) it made sense to create analogue stores and action creator for these two regions.

However, as one map library was needed, I included Leaflet, for it's ability to allow html and css styling in its overlays. Leaflet modifies the dom without interacting with React, so we had to handle this situation accordingly. In some cases, to create popups we render React markup to a text representation, and then inject that html into the leaflet components.


**UX / Interactions:**  
The idea of the project was to provide the users with the possibility of filtering their favourites movies, and check where they've been filmed.
That's why we allow to do filtering by name of the movie, actors, location and district. In order to find the item youre looking for you can start typing and the app will update your results. We only load batches of 30 results, and when the user scolls down, we load more...     

Every interaction refreshes the marker on the map. If not filters have been applied and the zoom is not big enough, we render the marker for every district, rather than the individual locations markers. This way we can visualizae the areas fo the city were most movies have been filmed.
If the user wants more information about a location or a movie, he can click either on the sidebar's items, or the locations popups, and will get a new section coming from the bottom of the page with a Street View block, or the details about the selected movie.


**What could be improved**
- Sometimes google and Imdb are not so happy about me hotlinking their resources and they return a 403. It's ok guys, I know it's not personal :)  However, the app looks so much better when the images load... 
- For the sake of simplicity, I printed English texts, where we usually would include variables that could be easily internationalized. 
- The JS and CSS bundles are only one, when tipycally I would create one bundle for the app, and another for libraries  (which change less frequently). That way we could take more advantage of the browser's cache. 

- Of course, we are lacking tests. 


I hope you enjoy it, guys! I had a lot of fun coding it...
Cheers!

[Link: http://uber-challenge-mbenedetto.herokuapp.com/](http://uber-challenge-mbenedetto.herokuapp.com/)








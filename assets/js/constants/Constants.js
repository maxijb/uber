/* ----------- Apis Configuration --------------------- */

export const mapboxApiKey 			 = "pk.eyJ1IjoibWJlbmVkZXR0byIsImEiOiJnUWxUS0MwIn0.SiA0N-P9Bdn_KltM8D_V_w";
export const googleApiKey			 = 'AIzaSyCwet2EyOpO1Fz4wRu9tF3YGFS43zbQft4';
export const googleResponseDefaultSF = {
		lat: 37.77493,
		lng: -122.419416,
		place_id : "ChIJIQBpAG2ahYAR_6128GcTUEo",
		zoom: 13
	};

export const LeafletImagesPath = '/static/images/';
export const LeafletMapTilesPath = 'https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=';
export const defaultImgPlaceholder = "/static/images/default-placeholder.png";



/* ----------- Actions and events --------------------- */

export const actions = {
	appLoad: 'appLoad',
	changeItemsType: 'changeItemsType',
	removeFilter: 'removeFilter',
	addFilter: 'addFilter',
	removeFilter: 'removeFilter',
	openHighlight: 'openHighlight',
	closeHighlight: 'closeHighlight',

	moviesLoaded: 'moviesLoaded',
	locationsLoaded: 'locationsLoaded',
	districtsLoaded: 'districtsLoaded',

	setSidebarItems: 'setSidebarItems',
	addSidebarItems: 'addSidebarItems',

	sidebarStateChange: 'sidebarStateChange',
	sidebarItemsWillBeSet: 'sidebarItemsWillBeSet',
	sidebarItemsWillBeAdded: 'sidebarItemsWillBeAdded',

	locationDetailsLoaded: 'locationDetailsLoaded',
}

export const events = {
	change: 'change'
}



/* ----------- App routes --------------------- */

export const urls = {
	locations	: '/api/locations',
	movies		: '/api/movies',
	districts	: '/api/districts',
	actors		: '/api/actors',
	directors	: '/api/directors',
	writers		: '/api/writers',
	locationDetails: 'api/locationDetails'
}
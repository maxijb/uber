export const mapboxApiKey 			 = "pk.eyJ1IjoibWJlbmVkZXR0byIsImEiOiJnUWxUS0MwIn0.SiA0N-P9Bdn_KltM8D_V_w";
export const googleApiKey			 = 'AIzaSyCwet2EyOpO1Fz4wRu9tF3YGFS43zbQft4';
export const googleResponseDefaultSF = {
		lat: 37.77493,
		lng: -122.419416,
		place_id : "ChIJIQBpAG2ahYAR_6128GcTUEo",
		zoom: 12
	};

export const actions = {
	appLoad: 'appLoad',
	changeItemsType: 'changeItemsType'
}

export const events = {
	stateChanged: 'stateChanged',
	moviesLoaded: 'moviesLoaded',
	locationsLoaded: 'locationsLoaded',
	districtsLoaded: 'districtsLoaded',

	setSidebarItems: 'setSidebarItems',
	addSidebarItems: 'addSidebarItems',

	sidebarStateChange: 'sidebarStateChange',
	sidebarItemsWillBeSet: 'sidebarItemsWillBeSet',

	mapStateChange: 'mapStateChange'
}

export const urls = {
	locations	: '/api/locations',
	movies		: '/api/movies',
	districts	: '/api/districts',
	actors		: '/api/actors',
	directors	: '/api/directors',
	writers		: '/api/writers',
}
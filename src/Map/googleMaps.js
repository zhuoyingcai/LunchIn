
/*global google*/
import React from "react"
import { compose, withProps, withHandlers, withState } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow} from "react-google-maps";
import { Link } from 'react-router-dom';
import './map.css';

const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");
const _ = require("lodash");

const MapComponent = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyDTt1Jc5WrfPTz4_Q3jE0A3pG-lcnB5cbk&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: '600px', width: '600px' }} />,
        containerElement: <div style={{ height: '400px' }} />,
        mapElement: <div style={{ height: '600px', width: '600px' }} />,
    }),
    withScriptjs,
    withGoogleMap,
    withState('rest', 'resID', ''),
    withState('places', 'updatePlaces', ''),
    withState('center', '', ''),
    withState('selectedPlace', 'updateSelectedPlace', null),
    withHandlers(() => {
            const refs = {
                map: undefined,
                searchBox: undefined,
            }
            return {
                onMapMounted: () => (ref) => {
                  refs.map = ref
                },
                onSearchBoxMounted: () => (ref) => {
                  refs.searchBox = ref;
                },
                onBoundsChanged: () => () => {
                  this.setState({
                    bounds: refs.map.getBounds(),
                    center: refs.map.getCenter(),
                  })
                },
                onPlacesChanged: () => () => {
                  const places = refs.searchBox.getPlaces();
                  const bounds = new window.google.maps.LatLngBounds();

                  places.forEach(place => {
                      if (place.geometry.viewport) {
                        bounds.union(place.geometry.viewport)
                      } else {
                        bounds.extend(place.geometry.location)
                      }
                  });
                  const nextMarkers = places.map(place => ({
                      position: place.geometry.location,
                      placeId: place
                    }));
                    console.log(nextMarkers.position);
                  const nextCenter = _.get(nextMarkers, '0.position', refs.map.getCenter());
                  refs.map.fitBounds(bounds);
                },

                fetchPlaces: ({ updatePlaces }) => () => {
                    let places;
                    const service = new window.google.maps.places.PlacesService(refs.map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED);
                    const request = {
                      location: refs.map.getCenter(),
                      radius: '450',
                      keyword: 'pizza',
                      name: 'Pizza',
                      type: 'restaurant',
                    };
                service.nearbySearch(request, (results, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        console.log(results);
                        updatePlaces(results);
                    }
                })
              },

            onToggleOpen: ({ updateSelectedPlace }) => key => {
                updateSelectedPlace(key);
            }

        }
    }),

)((props) => {
    return (
      <div>
        <GoogleMap
              onTilesLoaded={props.fetchPlaces}
              ref={props.onMapMounted}
              defaultZoom={14}
              defaultCenter={{ lat: 40.758896, lng: -73.985130 }} >

              <SearchBox
                ref={props.onSearchBoxMounted}
                controlPosition={google.maps.ControlPosition.TOP_LEFT}
                onPlacesChanged={props.onPlacesChanged} >

                <input
                  type="text"
                  placeholder="Search Pizza To Find The One"
                  style={{
                    boxSizing: `border-box`,
                    border: `1px solid transparent`,
                    width: `240px`,
                    height: `32px`,
                    marginTop: `27px`,
                    padding: `0 12px`,
                    borderRadius: `3px`,
                    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                    fontSize: `14px`,
                    outline: `none`,
                    textOverflow: `ellipses`,
                  }} />

            </SearchBox>

            {props.places && props.places.map((place, i) =>
                <Marker
                  onClick={() => props.onToggleOpen(i)}
                  key={i}
                  position={{ lat: place.geometry.location.lat(),
                              lng: place.geometry.location.lng() }} >

               {props.selectedPlace === i && <InfoWindow onCloseClick={props.onToggleOpen}>
                    <div>
                        {props.places[props.selectedPlace].name}
                        <br/>
                        {props.places[props.selectedPlace].formatted_address}
                      </div>
                  </InfoWindow>
               }
                </Marker>
            )}
          </GoogleMap>
        </div>
    )
})

export default class GoogleMapComponent extends React.PureComponent {
    render() {
        return (
          <div>
              <MapComponent />
          </div>
        )
    }
}

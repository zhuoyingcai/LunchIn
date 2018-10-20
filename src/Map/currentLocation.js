/*global google*/
import React from "react"
import { compose, withProps, withHandlers, withState } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow, SearchBox} from "react-google-maps";
import { Route, Link } from 'react-router-dom';
import Geocode from 'react-geocode';

import './map.css';


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
    withState('selectedPlace', 'updateSelectedPlace', null),
    withHandlers((props) => {
            const refs = {
                map: undefined,
            }
            return {
                onMapMounted: () => (ref) => {
                    refs.map = ref
                },
                fetchPlaces: ({ updatePlaces }) => () => {
                    let places;
                    // const bounds = refs.map.getBounds();
                    const latlng = new window.google.maps.LatLng(props.lat, props.lng);
                    console.log('from map' + latlng);
                    const service = new window.google.maps.places.PlacesService(refs.map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED);
                const request = {
                    location: latlng,
                    radius: '10',
                    query: 'pizza'
                };
                service.textSearch(request, (results, status) => {
                    window.google.maps.places.RankBy.Distance;

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
              onBoundsChanged={props.fetchPlaces}
              defaultZoom={14}
              defaultCenter={{ lat: 40.758896, lng: -73.985130 }}
          >
              <SearchBox
                ref={props.onSearchBoxMounted}
                controlPosition={google.maps.ControlPosition.TOP_LEFT}
                onPlacesChanged={props.onPlacesChanged}
              >
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
                  }}
                />
              </SearchBox>

              {props.places && props.places.map((place, i) =>

                  <Marker onClick={() => props.onToggleOpen(i)} key={i} position={{ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }}>
                      {props.selectedPlace === i && <InfoWindow onCloseClick={props.onToggleOpen}>
                          <div>
                              {props.places[props.selectedPlace].name}
                              <br/>
                              {props.places[props.selectedPlace].formatted_address}
                          </div>
                      </InfoWindow>}
                  </Marker>

              )}
          </GoogleMap>
              {props.places && props.places.map((place, resID) =>
                    <Link to={'/restaurant/' + resID} name='linkbtn' key={resID} value={resID}>
                      <li>{place.name}</li>
                    </Link>)}
        </div>
    )
})

export default class GoogleMapComponent extends React.PureComponent {
    state ={
      address: '350 5th Ave, New York, NY 10118',
      lat: '',
      lng: ''
    };

    locationChangeHandler = (event) => {
      // update the userInput as the user inputs something
      this.setState({address: event.target.value});

        Geocode.fromAddress(this.state.address).then(
            response => {
              const lat = response.results[0].geometry.location.lat;
              const lng = response.results[0].geometry.location.lng;
              this.setState({lat: lat});
              this.setState({lng: lng})
            },
            error => {
              console.error(error);
            }
          );
    };
    render() {

        return (
          <div>
              <input type='text' placeholder="Enter your address:"
                onChange={this.locationChangeHandler} value={this.state.address}></input>
              <p>{this.state.address}</p>
              <p>{this.state.lat}</p>
              <p>{this.state.lng}</p>
              <MapComponent lat={this.state.lat} lng={this.state.lng} />
              {console.log(this.state.lat, this.state.lng )}
          </div>
        )
    }
}

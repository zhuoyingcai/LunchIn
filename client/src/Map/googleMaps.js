import React from "react"
import { compose, withProps, withHandlers, withState } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow} from "react-google-maps";
import Card from '@material-ui/core/Card';
import './map.css';
import Geocode from 'react-geocode';

// const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");
const _ = require("lodash");

const MapComponent = compose(
    withProps({
        googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&v=3.exp&libraries=geometry,drawing,places`,
        loadingElement: <div style={{ height: '450px', width: '800px' }} />,
        containerElement: <div style={{ height: '450px' }} />,
        mapElement: <div style={{ height: '450px', width: '800px' }} />,
    }),
    withScriptjs,
    withGoogleMap,
    withState('rest', 'resID', ''),
    withState('places', 'updatePlaces', ''),
    withState('center', '', ''),
    withState('selectedPlace', 'updateSelectedPlace', null),
    withHandlers((props) => {

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
                  _.get(nextMarkers, '0.position', refs.map.getCenter());
                  refs.map.fitBounds(bounds);
                },

                fetchPlaces: ({ updatePlaces }) => () => {
                    // let places;
                    const service = new window.google.maps.places.PlacesService(refs.map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED);
                    const request = {
                      location: refs.map.getCenter(),
                      radius: '450',
                      keyword: props.food,
                      name: props.food,
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
      // Displays Gmap with specific user location and restaurant based on randomly selected food.
        <GoogleMap
              onTilesLoaded={props.fetchPlaces}
              ref={props.onMapMounted}
              defaultZoom={16}
              defaultCenter={{ lat: props.lat, lng: props.lng }} >

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
    constructor(props) {
        super(props);
        this.state = {
            randomFoodName: props.food,
            addressName: props.address,
            lat: props.lat,
            lng: props.lng,
        };
        this.renderMaps = this.renderMaps.bind(this);
    }

    renderMaps() {
        return (
            <Card>
                <MapComponent food={this.state.randomFoodName}
                address={this.state.addressName}
                lng={this.state.lng}
                lat={this.state.lat}
                key={this.state.randomFoodName}
                />
            </Card>

        );
      }
    render() {
        return (
          <div>
              {!!this.props.food
                ? (this.renderMaps(this.props.food))
                : null
              }
          </div>
        )
    }
}

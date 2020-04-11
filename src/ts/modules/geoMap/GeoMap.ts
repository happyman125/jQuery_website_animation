const {InfoBox} = require('google-maps-infobox-window')
import {IFreeGeoIPLocation} from '../../models/map/IFreeGeoIPLocation'
import {IGeoLocation} from '../../models/map/IGeoLocation'
import {IMarkerData} from '../../models/map/IMarkerData'
import {snazzyMapsStyles} from '../../models/map/SnazzyMaps'
import {google} from '../../shims/Google'
import {infoBox} from '../../shims/InfoBox'
import {Promise} from 'es6-promise'
import {forEach} from '../../utils'
import * as localForage from 'localforage'
var classie = require("classie");
const PubSub = require('pubsub-js');

export default class GeoMap {
    static CENTER: Object = {lat: 56.1512393, lng: 10.1043946}
    static STYLES: any = snazzyMapsStyles

    static CLOSEST_FARMS: string = 'CLOSEST_FARMS'

    private _mapEl: Element
    private _filters: Object = {
        hosttype: 'false',
        opendays: 'false',
        food: 'false',
        handicapvenlig: 'false',
        cykelforhold: 'false'
    }
    private _filterMap: any
    private _map: any
    private _markerData: any
    private _markers: Object = {}
    private _markersList: Array<any> = new Array<any>()
    private _entireMarkersList: Array<any> = new Array<any>()

    private _currentGeoLocation: IGeoLocation
    private _currentIPLocation: IFreeGeoIPLocation

    private _currentLocation: any

    private _openInfoWindow: any
    private _clickedMarker: any
    private _timer: any

    // @todo: Make this more dynamic
    private _overlay: Element
    private _search: Element
    private _filterElm: Element
    private _sliderElm: Element

    constructor(elementId: string) {
        this._mapEl = document.getElementById(elementId)
    }

    public init(): void {
        this._map = new google.maps.Map(this._mapEl, {
            center: GeoMap.CENTER,
            scrollwheel: false,
            styles: GeoMap.STYLES,
            mapTypeControl: false,
            streetViewControl: false,
            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.LARGE,
                position: google.maps.ControlPosition.RIGHT_TOP
            },
            zoom: 8
        })

        const emptyDiv: any = document.createElement('div')
        emptyDiv.className = 'map_controls'
        emptyDiv.index = 0
        this._map.controls[google.maps.ControlPosition.TOP_RIGHT].push(emptyDiv)

        // @todo: Make this more dynamic
        this._overlay = document.querySelector('.MapSection-overlay')
        this._search = document.querySelector('.MapSection-search')
        this._filterElm = document.querySelector('.MapSection-filters')
        this._sliderElm = document.querySelector('.MapSection-farms')

        this.initAutocomplete()
        this.initFilterMap()
        this.initClickHandler()
        this.initDragging()
    }

    private initDragging(): void {
        this._map.addListener('dragend', () => {
            localForage.removeItem('city')
            this.updateClosest()
        })
    }

    private initClickHandler() {
        google.maps.event.addListener(this._map, 'click', () => {
            if (this._openInfoWindow) {
                this._openInfoWindow.close()
            }
            if (this._clickedMarker) {
                this._markers[this._clickedMarker].setMap(this._map)
                this._clickedMarker = null
            }
        })
    }

    private initFilterMap(): void {
        this._filterMap = {
            hosttype: (value: any) => {
                return this.filterByString('hosttype', value)
            },
            opendays: (value: any) => {
              return this.filterByOpenDays(value)
            },

            food: (value: any) => {
                return this.filterByString('food', value)
            },
            handicapvenlig: (value: any) => {
                return this.filterByString('handicapvenlig', value)
            },
            cykelforhold: (value: any) => {
                return this.filterByString('cykelforhold', value)
            },
            animals: (value: any) => {
                return this.filterByString('animals', value)
            }
        }
    }

    public setCurrentLocation(location: any) {
        const latitude = location.latitude
        const longitude = location.longitude
        this._currentLocation = new google.maps.LatLng(latitude, longitude)

        this._map.setCenter(this._currentLocation)
    }

    public getCurrentLocation(): any {
        return this._currentLocation
    }

    public initFilters(filterElements: Array<string>): void {
        forEach(
            filterElements,
            (index, filter) => {
                const filterEl = document.getElementById(filter)
                const filterType: any = filterEl.dataset['filterType']

                filterEl.addEventListener('change', (e: any) => {
                    // Check if checkbox and convert boolean value to int.toString()
                    if (e.target.type === 'checkbox') {
                        const checkboxValue = e.target.checked.toString()
                        this.filterCtrl(filterType, checkboxValue)
                    } else {
                        this.filterCtrl(filterType, e.target.value)
                    }
                })
            },
            this
        )
    }

    public initCurrentLocation(): Promise<string> {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position: any) => {
                        this.getCurrentGeoLocation(position)
                        resolve(position)
                    },
                    error => {
                        this.getIPLocation().then(status => {
                            resolve(status)
                        })
                        // reject('Geolocation error: ' + error.message)
                    }
                )
            } else {
                // Gets IP location if Geolocation is unavailable
                this.getIPLocation().then(status => {
                    resolve(status)
                })
            }
        })
    }

    private getCurrentGeoLocation(position: any): void {
        this._currentGeoLocation = <IGeoLocation>position
        this._map.setZoom(10)
        this.showControls()
        this._currentLocation = new google.maps.LatLng(
            this._currentGeoLocation.coords.latitude,
            this._currentGeoLocation.coords.longitude
        )
        this._map.setCenter(this._currentLocation)
        //console.log('got GEO location')
    }

    public hideFilters(): void {
        setTimeout(() => {
            if (!classie.has(this._sliderElm, 'is-open')) {
                classie.remove(this._filterElm, 'is-open')
            }
        }, 2000)
    }

    private getIPLocation(): Promise<string> {
        return new Promise((resolve, reject) => {
            let xhttp: XMLHttpRequest = new XMLHttpRequest()
            xhttp.onload = () => {
                if (xhttp.status >= 200 && xhttp.status < 300) {
                    this._currentIPLocation = <IFreeGeoIPLocation>JSON.parse(xhttp.responseText)
                    this._currentLocation = new google.maps.LatLng(
                        this._currentIPLocation.location.latitude,
                        this._currentIPLocation.location.longitude
                    )
                    this._map.setZoom(10)
                    this.showControls()
                    this._map.setCenter(this._currentLocation)
                    //console.log('got IP location')
                    resolve(xhttp.responseText)
                } else {
                    reject({
                        status: xhttp.status,
                        statusText: xhttp.statusText
                    })
                }
            }
            xhttp.onerror = () => {
                reject({
                    status: xhttp.status,
                    statusText: xhttp.statusText
                })
            }
            xhttp.open('GET', '//geoip.nekudo.com/api/', true)
            xhttp.send()
        })
    }

    public initMarkers(url): Promise<string> {
        return new Promise((resolve, reject) => {
            let xhttp: XMLHttpRequest = new XMLHttpRequest()
            xhttp.onload = () => {
                if (xhttp.status >= 200 && xhttp.status < 300) {
                    let markerData: Array<IMarkerData> = JSON.parse(xhttp.responseText)
                    this._markerData = markerData
                    this.setMarkersOnMap(markerData)
                    resolve(xhttp.responseText)
                } else {
                    reject({
                        status: xhttp.status,
                        statusText: xhttp.statusText
                    })
                }
            }
            xhttp.onerror = () => {
                reject({
                    status: xhttp.status,
                    statusText: xhttp.statusText
                })
            }
            xhttp.open('GET', url, true)
            xhttp.send()
        })
    }

    private setMarkersOnMap(markerData: Array<IMarkerData>): void {
       this._entireMarkersList = [];
        let icon: any = {
            size: new google.maps.Size(57, 57),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(57 / 2, 57),
            scaledSize: new google.maps.Size(57, 57)
        }
        /*const icon: any = {
         path: 'M28.7 1.8c-11.9 0-21.5 9.6-21.5 21.5 0 9.8 6.6 18.4 16.1 20.8l5.4 5.4 5.3-5.4c9.5-2.4 16.2-11 16.2-20.8 0-11.8-9.6-21.5-21.5-21.5zm13.1 23c-2.2 2.7-3.7 1-3.9 1s-.7.5-1.3 1.3c-.3.4-.5.7-.8 1.1-.2.3-.2.7-.1 1 .2.5-.9.8-1.2 1.3s0 1.2 0 1.8c0 .9-.1 1-.9 1.4-.8.3-1 .6-1-.2 0-.9 1.5-2.3 1.5-3 0-.7-.2-1.4-.4-2.2-.1.1-.9.1-1 .2 0 .3-.1.6-.2.8.4.3.6.8.4.9-.2.1-.5-.2-.7-.5-.1.1-.2.1-.2.2.3.5.2 1 0 1s-.4-.4-.5-.8c-.2.1-.4.1-.6.1h-.5c-.1.5-.5 1.1-.7.9-.2-.3 0-.7.2-1-.1-.1-.2-.2-.3-.2-.2.4-.7.6-.8.4s.1-.4.3-.6c-1.3.2-2.5.2-3.8.2-.5 0-1-.1-1.5-.3-.2.3-.3.7-.3 1.1.1.5 1 .2 1.4.2.4-.1.9 0 1.3.3.5.4 1.1 1.1.5 1-.6-.1-3.9.4-4.3-.2-.5-.6-.2-2.8-.2-2.8l-.7.1c-.9.2-1.8.5-2.6.9-1 .4-.7.9-1.2 1.8s-2.5.9-2.7.2 2.2-2.2 3.3-2.9 2.7-1.9 2.7-1.9c-1.1-1-.3-2.7.9-4.4.7-1 1-2.2.6-3.4-1.4-1-2.7-3.8-2.9-4.8-.2-1 2.9-1.5 3.3-.9.4.6 0 1.1.5 1.6s1.2 0 1.7-.1c.4-.1.5.1.8.8s.4.5.6.8-.1.5-.1.5c.9.4 1.8 1.2.9 1.8-.9.6-1.7-.7-1.7-.6s-.7 1.1-.7 1.1c.2.9.7 1.8 1.3 2.5 1.3 1.8 3.1 1.2 4.3.5.8-.5 1.4-1.2 1.8-2 .3-.3.6.3.9.5.2-.4.3-.9.2-1.4-.3-.9-.9-.7-2.1-2.3 0-.1-.1-.1-.1-.2-.8-1.2-.4-2.8.8-3.5 1.2-.9 1.4-2.2 1.6-2.2.6 0 .6 2.9-.7 2.9-.6 0-1 .2-1.4 1.2-.3 1 1.1 2.4 1.9 3 .6.5.9 1.3.7 2 .1-.1.2-.2.3-.2.3-.2 1 .3 1.6 1.6.4.7.4 1.6.1 2.4 1.9-1.9 1.7-1.2 2-.9.3.3.4 1.1.8 1.2s.7-1.3 1.1-1.7c.8-.3 3 .3 1.8 1.6z',
         fillColor: '#15464B',
         fillOpacity: .8,
         anchor: new google.maps.Point(28, 56),
         strokeWeight: 0,
         scale: .8
         }*/


      for (let i: number = 0, max: number = markerData.length; i < max; i++) {
            const currentMarkerData: IMarkerData = markerData[i]
            //icon.url = currentMarkerData.hosttype === 'gaard' ? '/svg/pinicon-orange.svg' : '/svg/pinicon-white.svg';
            icon.url = currentMarkerData.hosttype === 'gaard' ? '/svg/pinicon-orange.svg' : '/svg/pinicon-orange.svg';

            let markerObject: any = {
                position: new google.maps.LatLng(currentMarkerData.google_coordinate_x, currentMarkerData.google_coordinate_y),
                icon: icon,
                map: this._map,
                optimized: false,
                animation: google.maps.Animation.DROP,
                markerData: currentMarkerData,
                filter: currentMarkerData.filter,
                id: currentMarkerData.umbracoID,
                infoWindow: this.getInfoWindow(currentMarkerData, currentMarkerData.hosttype)
            }
            this._entireMarkersList.push(markerObject);

            if (this._markersList.indexOf(currentMarkerData.umbracoID) !== -1) {
              continue;
            }

            this.addMarkerWithTimeout(i, i * 10)
        }


        // @todo: init MarkerClusterer

        google.maps.event.trigger(this._map, 'resize')
    }

    private updateClosest(): void {
        const lat = this._map.getCenter().lat()
        const lng = this._map.getCenter().lng()

        const storedLocation = {
            latitude: lat,
            longitude: lng
        }

        localForage.setItem('location', storedLocation).then(value => {
            //
        })

        this._currentLocation = new google.maps.LatLng(lat, lng)
        const closestFarms = this.findClosest(8)

        PubSub.publish(GeoMap.CLOSEST_FARMS, closestFarms)
    }

    public findClosest(numberOfResults: number): any {
        const currentLocation = this._currentLocation
        const closest: Array<any> = new Array<any>()

        for (let i: number = 0, max: number = this._entireMarkersList.length; i < max; i++) {
            this._entireMarkersList[i].markerData.distance = (
                google.maps.geometry.spherical.computeDistanceBetween(currentLocation, this._entireMarkersList[i].position) /
                1000
            ).toFixed(1)
            closest.push(this._entireMarkersList[i])
        }

        closest.sort(this.sortByDist)
        return closest.splice(0, numberOfResults)
    }

    private sortByDist(a: any, b: any): any {
        return a.markerData.distance - b.markerData.distance
    }

    public clearMarkers(): void {
        for (let i: number = 0, max: number = this._markersList.length; i < max; i++) {
            this._markersList[i].setMap(null)
        }
        this._markersList = []
    }

    private addMarkerWithTimeout(markerIndex: any, timeout: number): void {
          let marker: any = new google.maps.Marker(this._entireMarkersList[markerIndex])

          marker.addListener(
            'click',
            () => {
              this._markers[marker.id].setMap(null)
              if (this._openInfoWindow) {
                this._openInfoWindow.close()
              }

              if (this._clickedMarker) {
                this._markers[this._clickedMarker].setMap(this._map)
              }

              this._clickedMarker = marker.id
              marker.infoWindow.open(this._map, marker)
              this._openInfoWindow = marker.infoWindow
            },
            false
          );

          this._markers[marker.id] = marker
          this._markersList.push(marker.id)
    }

    private initAutocomplete(): void {
        const input: HTMLElement = document.getElementById('map-search')
        const options = {
            componentRestrictions: {country: 'dk'}
        }
        const autocomplete: any = new google.maps.places.Autocomplete(input, options)

        // this._map.controls[google.maps.ControlPosition.CENTER].push(input)
        autocomplete.bindTo('bounds', this._map)

        autocomplete.addListener('place_changed', () => {
            const place: any = autocomplete.getPlace()

            localForage.setItem('city', (input as any).value).then(() => {
                //
            })

            if (!place.geometry) {
                window.alert('Vælg venligst en adresse eller postnummer i dropdown')
                return
            }

            if (place.geometry.viewport) {
                this._map.fitBounds(place.geometry.viewport)
            } else {
                this._map.setCenter(place.geometry.location)
            }
            this.updateClosest()
            this._map.setZoom(10)
            this.showControls()
        })
    }

    // @todo: Make this more dynamic
    private showControls(): void {
        this._overlay.classList.add('u-hidden')
        this._search.classList.add('is-searched')
        this._sliderElm.classList.add('is-active')
        this._filterElm.classList.add('is-active')
        this._mapEl.classList.add('is-active')
    }

    private transformHostType(hostType: string): string {
      if (hostType === 'gaard') {
        return 'landbrug'
      }
      return hostType;
    }

    private getInfoWindow(markerData: IMarkerData, hostType: any): any {
        //const iconPath: string = hostType === 'gaard' ? '/svg/straw.svg' : '/svg/straworange.svg'
        const iconPath: string = hostType === 'gaard' ? '/svg/straw.svg' : '/svg/straw.svg'

        let infoWindowTemplate: string = `<div class="InfoBox-content">
                                        <img class="Icon-cowDancing" src="${iconPath}" />
                                        <h3 class="InfoBox-header">${markerData.navn}</h3>
                                        <h3 class="InfoBox-header InfoBox-subheader">${this.transformHostType(markerData.hosttype)}</h3>
                                        <div class="InfoBox-body">
                                          <p>${markerData.owner}</p>
                                          <p>${markerData.address}, ${markerData.city}</p>
                                        </div>
                                        <a class="Button" href="${markerData.link}">Læs mere</a>
                                      </div>`

        //const infoWindowClass = hostType === 'gaard' ? 'infoBox' : 'infoBox infoBox-white';
        const infoWindowClass = hostType === 'gaard' ? 'infoBox' : 'infoBox';


        const infoWindow: any = new infoBox({
            content: infoWindowTemplate,
            disableAutoPan: false,
            maxWidth: 'auto',
            pixelOffset: new google.maps.Size(-135, -302),
            infoBoxClearence: new google.maps.Size(1, 1),
            closeBoxURL: '',
            boxClass: infoWindowClass
        });

        //console.log(infoWindowClass);
        return infoWindow
    }

    private initMarkerClusterer() {
        // ...
    }

    private isInt(n): boolean {
        return n % 1 === 0
    }

    private reduceArray(a): Array<any> {
        const r: Array<any> = a.shift().reduce((res, v) => {
            if (
                res.indexOf(v) === -1 &&
                a.every(a => {
                    return a.indexOf(v) !== -1
                })
            )
                res.push(v)
            return res
        }, [])
        return r
    }

    private filterCtrl(filterType: string, value: string): boolean {
        // result array
        let results: Array<any> = Array<any>();

        this._filters[filterType] = value;

        for (let k in this._filters) {
            if (!this._filters.hasOwnProperty(k) && !(this._filters[k] !== 'false')) {
                // all the filters are off

                this.setMarkersOnMap(this._markerData)

                return false;
            } else if (this._filters[k] !== 'false') {
                // call filterMap function and append to r array
                results.push(this._filterMap[k](this._filters[k]))
            } else {
                // fail silently
            }
        }

        if (this._filters[filterType] === 'false') {
            results.push(this._markerData)
        }

        /*
         if there is 1 array (1 filter applied) set it,
         else find markers that are common to every results array (pass every filter)
         */
        if (results.length === 1) {
            results = results[0]
        } else {
            results = this.reduceArray(results)
        }

        this.setMarkersOnMap(results)
    }

    private filterByString(dataProperty, value): Array<any> {
        const farms: Array<any> = Array<any>()

        this._clickedMarker = null

        for (let i: number = 0, max: number = this._markerData.length; i < max; i++) {
            const farm = this._markerData[i]

            if (String(farm[dataProperty]) === value) {
                farms.push(farm)
            } else {
                this.removeMarker(farm.umbracoID)
            }
        }
        return farms
    }

    private filterByOpenDays(dataProperty) {
      const farms: Array<any> = Array<any>();

      this._clickedMarker = null;

      for (let i: number = 0, max: number = this._markerData.length; i < max; i++) {
        const farm = this._markerData[i]

        if (dataProperty === 'openbothdays') {
          if (String(farm[dataProperty]) === 'true') {
            farms.push(farm)
          } else {
            this.removeMarker(farm.umbracoID)
          }
        } else {
          const otherDay = dataProperty === 'opensaturday' ? 'opensunday' : 'opensaturday';

          if (String(farm[dataProperty]) === 'true' && String(farm[otherDay]) === 'false') {
            farms.push(farm)
          } else {
            this.removeMarker(farm.umbracoID)
          }
        }
      }
      return farms
    }


    private removeMarker(id: number): void {
        if (this._markers[id]) {
            this._markers[id].setMap(null)
            const loc = this._markersList.indexOf(id)
            if (loc > -1) {
                this._markersList.splice(loc, 1)
            }
            delete this._markers[id]
        }
    }
}

import GeoMap from './GeoMap'
import Slider from '../Slider'
import Filter from '../Filter'
// import Gallery from './modules/Gallery'
// import AjaxForm from './modules/AjaxForm'
import FarmsNear from '../FarmsNear'
// import FlipClock from './modules/FlipClock'
// import Scrollbar from './modules/Scrollbar'
import {Promise} from 'es6-promise'
import * as localForage from 'localforage'
// const Barba = require('barba.js')
// const { TimelineLite, Power3 } = require('gsap')
var classie = require("classie");
import {forEach} from '../../utils'
import $ = require("jquery");


document.addEventListener('DOMContentLoaded', event => {
    const mainElm: Element = document.getElementById('main')
    const myText: Element = document.querySelector('.showMapText')
    const showMap: Element = document.getElementById('showMap')
    const mapSection = document.querySelector('.MapSection');
    const contentWrapper = document.querySelector('.content_wrapper');
    const closeMapButton = document.getElementById('closeMap');

    const showNav: any = document.getElementById('showNav')
    const slidesSpinner: Element = document.querySelector('.Slider-wrapper .Spinner')
    const newsletterSpinner: Element = document.querySelector('.Newsletter .Spinner')
    const farmsNearSpinner: Element = document.querySelector('.js-farmsNear .Spinner')
    const utilButtons: any = document.querySelectorAll('.js-UtilButton')
    const activityButton: any = document.querySelector('.Button--activities')
    const modal: any = document.querySelector('.Subscription-modal')
    const overlay: any = document.querySelector('.Overlay')
    const farmsNearEl: any = document.querySelector('.js-farmsNear')

    const cookieNotification: any = document.querySelector('.cookie-notification')
    const cookieButton: any = document.querySelector('.Cookies-button')

    const modalClose: any = document.querySelector('.js-closeModal')

    const fbEvent: any = document.querySelector('.fb-event')
    const fbDescription: any = document.querySelector('.fb-description')
    const fbAttendingCount: any = document.querySelector('.fb-attending_count')
    const fbPlace: any = document.querySelector('.fb-place')
    const fbTime: any = document.querySelector('.fb-time')
    const fbTitle: any = document.querySelector('.fb-title')
    const fbDay: any = document.querySelector('p.fb-day')
    const fbMonth: any = document.querySelector('span.fb-month')
    const fbDate: any = document.querySelector('span.fb-date')

    const filterToggle: Element = document.querySelector('.MapSection-filters .js-toggleButton')
    const sliderToggle: Element = document.querySelector('.MapSection-farms .js-toggleButton')

    const subNavToggles: any = document.getElementsByName('subnav')

    const mapFarms = document.querySelector('.MapSection-farms')
    const mapFilters = document.querySelector('.MapSection-filters')

    const apiUrl = location.host === 'localhost:5050' ? '' : location.host

    let value: any
    let params: any
    let closestFarms: any
    let timer: any
    let timeout: number = 1000
    let setChecked

    var months = {
        '0': 'Januar',
        '1': 'Februar',
        '2': 'Marts',
        '3': 'April',
        '4': 'Maj',
        '5': 'Juni',
        '6': 'Juli',
        '7': 'August',
        '8': 'September',
        '9': 'Oktober',
        '10': 'November',
        '11': 'December'
    }

    // const tl = new TimelineLite({delay: 0.8})
    // const tl2 = new TimelineLite()
    const map: GeoMap = new GeoMap('map')
    const slider: Slider = new Slider('.main-carousel')
    const filter: Filter = new Filter('.js-farmFilter')
    // const gallery: Gallery = new Gallery('.js-gallery')
    const farmsNear: FarmsNear = new FarmsNear('.js-farmsNear')
    // const flipClock: FlipClock = new FlipClock('.your-clock')

    //Scrollbar stuff.
    // const scrollbar: Scrollbar = new Scrollbar('main')
    // scrollbar.init()
    // const navscrollbar: Scrollbar = new Scrollbar('navsection')
    // navscrollbar.init()

    if (!!window.performance && window.performance.navigation.type == 2) {
        window.location.reload()
    }

    // const activityForm: AjaxForm = new AjaxForm('.økodagsignup', '.Spinner-activities', {
    //     onSubmit: form => {
    //         classie.remove(activityForm.loadSpinner, 'u-hidden')
    //         classie.add(activityForm.formBody, 'u-hidden')
    //         activityForm.submitForm().then(() => {
    //             classie.add(activityForm.loadSpinner, 'u-hidden')
    //             activityForm.formBody.innerHTML = 'Tak for din tilmelding'
    //             classie.remove(activityForm.formBody, 'u-hidden')
    //         })
    //     }
    // })

    if (document.querySelector('.simform')) {
        const theForm = document.querySelector('.simform').querySelector('form')

        new window['stepsForm'](theForm, {
            onSubmit: function (form) {
                // hide form
                classie.remove(newsletterSpinner, 'u-hidden')
                classie.addClass(theForm.querySelector('.simform-inner'), 'hide')
                getElementValues(form)
                submitForm(form.method, form.action).then(() => {
                    classie.add(newsletterSpinner, 'u-hidden')
                    const messageEl: any = theForm.querySelector('.final-message')
                    classie.addClass(messageEl, 'show')
                })
            }
        })
    }

    const getElementValues = form => {
        const formElements: any = form.elements
        for (let i = 0; i < formElements.length; i++) {
            if (formElements[i].tagName === 'SELECT') {
                value = formElements[i].options[formElements[i].selectedIndex].value
            } else {
                value = formElements[i].value
            }
            params += formElements[i].name + '=' + encodeURIComponent(value) + '&'
        }
    }

    const submitForm = (method, action) => {
        return new Promise((resolve, reject) => {
            let xhttp: XMLHttpRequest = new XMLHttpRequest()
            xhttp.onload = () => {
                if (xhttp.status >= 200 && xhttp.status < 300) {
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
            xhttp.open(method, action, true)
            xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
            xhttp.send(params)
        })
    }

    map.init()
    map.initFilters(['farm-business-filter', 'open-days-filter', 'food-filter', 'disabled-filter', 'bicycle-filter', 'animals-filter'])

    // gallery.init()

    filter.init()

    // flipClock.init()

    //const p1 = map.initMarkers(`//${apiUrl}/getjson`)
    // TODO Milos check what can be refactored here we do not need apiURL?
    //const p1 = map.initMarkers(`/getjson.html`)
    const p1 = map.initMarkers(`https://hostmarked.dk/getjson`)

    const p2 = map.initCurrentLocation()

    Promise.all([p1, p2]).then(
        () => {
            localForage.getItem('location').then(location => {
                if (location) {
                    map.setCurrentLocation(location)
                }
            })

            localForage.getItem('city').then(city => {
                if (city) {
                    const mapSearch = document.getElementById('map-search')
                    ;(mapSearch as any).value = city
                }
            })

            if (closestFarms === undefined) {
                closestFarms = map.findClosest(8)
                slider.init()
                slider.populateSlides(closestFarms)
                classie.add(slidesSpinner, 'u-hidden')
            }
        },
        error => {
            console.log(error)
        }
    );

    closeMapButton.addEventListener('click', () => {
        classie.toggle(mapSection, 'show');
        classie.toggle(contentWrapper, 'hide');
    });

    showMap.addEventListener('click', () => {
        classie.toggle(mapSection, 'show');
        classie.toggle(contentWrapper, 'hide');
        map.hideFilters()
    });

    $('.map-open, a[href="#sekort"]').click(() => {
      classie.toggle(mapSection, 'show');
      classie.toggle(contentWrapper, 'hide');
      map.hideFilters();
    });

    /* remove hash from url if #sekort */
    $(window).on('hashchange', function(e){
        if(window.location.hash == "#sekort"){
            window.history.pushState("", document.title, window.location.pathname);
        }
    });


  sliderToggle.addEventListener(
    'click',
    () => {
      if (classie.has(mapFilters, 'is-open') && !classie.has(mapFarms, 'is-open')) {
        classie.add(mapFarms, 'is-open')
        sliderToggle.innerHTML = 'Luk liste med værter nær dig'
      } else if (!classie.has(mapFilters, 'is-open') && !classie.has(mapFarms, 'is-open')) {
        classie.add(mapFarms, 'is-open')
        sliderToggle.innerHTML = 'Luk liste med værter nær dig'
        classie.add(mapFilters, 'is-open')
      } else if (classie.has(mapFilters, 'is-open') && classie.has(mapFarms, 'is-open')) {
        classie.remove(mapFarms, 'is-open')
        sliderToggle.innerHTML = 'Se liste med værter nær dig'
      }
    },
    false
  );

    // @todo: Refactor
    filterToggle.addEventListener('click', () => {
        if (classie.has(mapFilters, 'is-open') && !classie.has(mapFarms, 'is-open')) {
            classie.remove(mapFilters, 'is-open')
        } else if (!classie.has(mapFilters, 'is-open') && !classie.has(mapFarms, 'is-open')) {
            classie.add(mapFilters, 'is-open')
        } else if (classie.has(mapFilters, 'is-open') && classie.has(mapFarms, 'is-open')) {
            classie.remove(mapFarms, 'is-open')
        }
    });

    Promise.all([p1, p2]).then(() => {
        if (farmsNearEl) {
            farmsNear.init()
            const _currentFarmPosition = {
                latitude: farmsNearEl.dataset['latitude'],
                longitude: farmsNearEl.dataset['longitude']
            }
            map.setCurrentLocation(_currentFarmPosition)
            const _closestFarms = map.findClosest(4)
            farmsNear.populateFarms(_closestFarms)
            classie.add(farmsNearSpinner, 'u-hidden')
        }
    })
});

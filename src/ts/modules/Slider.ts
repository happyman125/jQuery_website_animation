import {forEach} from '../utils'
const PubSub = require('pubsub-js')
const Flickity = require('flickity')

export default class Slider {
    static CLOSEST_FARMS: string = 'CLOSEST_FARMS'

    private _sliderEl: Element
    private _slider: any
    private _slideContent: Array<any> = new Array<any>()

    constructor(sliderClassName: string) {
        this._sliderEl = document.querySelector(sliderClassName)
    }

    public init(): void {
        this._slider = new Flickity(this._sliderEl, {
            cellAlign: 'center',
            wrapAround: true,
            percentPosition: false,
            pageDots: false,
            /*arrowShape:  'M 0,50 L 60,00 L 50,30 L 80,30 L 80,70 L 50,70 L 60,100 Z'*/
            arrowShape: {
            x0: 10,
            x1: 60, y1: 40,
            x2: 60, y2: 20,
            x3: 40
            }
        })

        this.initSubscriber()
    }

    private initSubscriber(): void {
        const mySubscriber = (msg, data) => {
            this._slider.remove(this._slideContent)
            this._slideContent = []
            this.populateSlides(data)
        }

        PubSub.subscribe(Slider.CLOSEST_FARMS, mySubscriber)
    }


    private transformHostType(hostType: string): string {
      if (hostType === 'gaard') {
        return 'landbrug'
      }
      return hostType;
    }

    public populateSlides(farms: Array<any>): void {
        forEach(farms, (index, farm) => {
            let food: string = ''
            let disabled: string = ''
            let bicycle: string = ''
            let type: string = ''
            let element: any
            const doc = document.createElement('div')

            const prefix = (location.host !== 'localhost:5050') ? '' : '';

            if (farm.markerData.food) {
                food = `
                <svg class="Icon-cutlery">
                    <svg viewBox="0 0 40.25 53.69" width="100%" height="100%">
                        <path d="M5.79 53.66c-.17 0-2.77-.17-3.22-2.12-.24-1 0-3.7.52-8 .2-1.75.41-3.56.53-5.05.36-4.47.66-15.93.6-17.24 0-.32-.84-.67-1.5-.94-1.05-.44-2.25-.94-2.6-2-.53-1.69.79-13.38 1.06-15.7L1.25 2l1.48.18v11.46a1.49 1.49 0 0 0 .18.82 2 2 0 0 0 .22-1l.4-11.37.84-.09.89.09.39 11.39a4.17 4.17 0 0 0 .12.95 3.7 3.7 0 0 0 .14-.95L6.3 2.09 7.14 2l.86.09.39 11.33a2.48 2.48 0 0 0 .19 1 2.23 2.23 0 0 0 .21-1.07V2.19L10.26 2l.07.6c.27 2.33 1.6 14 1.05 15.71-.35 1.1-1.55 1.59-2.6 2-.66.28-1.48.62-1.5.94-.05 1.32.24 12.77.6 17.24.12 1.49.33 3.3.53 5.05.49 4.26.76 6.92.52 8-.44 1.95-3.03 2.11-3.14 2.12zM21 53.66c-.17 0-2.77-.17-3.22-2.12-.27-1.17 0-4.69.47-9.54.11-1.23.22-2.42.31-3.47.23-2.85.38-8.33.43-10.73a2.62 2.62 0 0 0-1-1 3.9 3.9 0 0 1-1.61-1.73C14.27 21 17.51 6.3 18.42 2.87 19 .59 20.18-.1 21.06 0c1 .13 1.7 1.3 1.7 3v19.71c0 3.5.31 12.15.6 15.82.08 1 .18 2 .28 3.17.45 5 .75 8.64.47 9.84-.46 1.95-3.05 2.11-3.11 2.12zM34.18 53.69c-.18 0-2.83-.17-3.29-2.16-.25-1.06 0-3.79.54-8.17.21-1.8.42-3.66.54-5.18.37-4.59.68-16.36.62-17.71 0-.14-.07-.32-.46-.58-2.77-.59-4.13-2.66-4.13-6.3 0-4.17 1.28-12.11 6.1-12.26a3.82 3.82 0 0 1 2.9 1.2c2.24 2.17 3.24 7.12 3.24 11.06 0 3.62-1.33 5.67-4.06 6.28-.41.27-.48.45-.48.6-.06 1.35.25 13.12.62 17.71.12 1.53.34 3.39.54 5.19.5 4.37.78 7.11.54 8.17-.45 1.98-3.1 2.15-3.22 2.15z"></path>
                    </svg>
                </svg>`
            }
            if (farm.markerData.handicapvenlig) {
                disabled = `
                <svg class="Icon-disabled">
                    <svg viewBox="0 0 56.69 56.69" width="100%" height="100%">
                        <path d="M49.21,42.85,46.61,34a2.07,2.07,0,0,0-2-1.49H23.36L22.2,26.18H41.06a1.67,1.67,0,0,0,0-3.35H21.59L18.07,3.59a2.07,2.07,0,0,0-.83-1.31,1.25,1.25,0,0,0-.89-.39H5.86A1.44,1.44,0,0,0,4.52,3.41,1.44,1.44,0,0,0,5.86,4.94H14.1l1.8,9.82A20.49,20.49,0,1,0,43.41,37.82l1.77,6a6.46,6.46,0,1,0,4-1ZM16.54,18.31l1.79,9.79-6.63-6.62A16.82,16.82,0,0,1,16.54,18.31Zm-5.61,3.94L18.68,30l.61,3.31H6.36A16.88,16.88,0,0,1,10.94,22.25ZM6.36,34.39H19.48l.1.57a2.07,2.07,0,0,0,.66,1.17l-9.31,9.32A16.89,16.89,0,0,1,6.36,34.39ZM23.85,50.8V36.68H22.76V50.8a16.91,16.91,0,0,1-11.05-4.59l9.58-9.58a2.07,2.07,0,0,0,.34,0h3.73l9.55,9.56A16.9,16.9,0,0,1,23.85,50.8Zm11.83-5.36-8.79-8.78H40A16.89,16.89,0,0,1,35.68,45.44Zm13.09,6.77a2.9,2.9,0,1,1,2.9-2.9A2.9,2.9,0,0,1,48.76,52.21Z"></path>
                    </svg>
                </svg>`
            }
            if (farm.markerData.cykelforhold) {
                bicycle = `
                <svg class="Icon-bicycle">
                    <svg viewBox="0 0 54.26 33.36" width="100%" height="100%">
                        <path d="M43.29 11.43a10.88 10.88 0 0 0-4.54 1l-4.42-7.8 5-2.82a1 1 0 0 0-1-1.69l-5.82 3.3a1 1 0 0 0-.37 1.32l2 3.47-6.28 11a3.31 3.31 0 0 0-.72-.09 3.28 3.28 0 0 0-.7.08L18.51 5.24h3.23a1 1 0 0 0 0-1.94H12a1 1 0 0 0 0 1.94h4.24l1.65 2.91-2.39 4.28a11 11 0 1 0 6.38 10.92H24a3.28 3.28 0 1 0 5.52-3.2l5.71-10 1.82 3.21a11 11 0 1 0 6.23-2zm-27.06 3.65a9 9 0 0 1 3.71 6.33h-7.3zM11 31.42a9 9 0 1 1 3.58-17.31l-4.46 7.79a1 1 0 0 0 .88 1.45h9a9 9 0 0 1-9 8.07zm13-10h-2.12a11 11 0 0 0-4.69-8L19 10.11l5.69 10a3.27 3.27 0 0 0-.69 1.3zm3.13 2.31a1.35 1.35 0 1 1 1.35-1.35 1.35 1.35 0 0 1-1.35 1.34zm16.16 7.7A9 9 0 0 1 38 15.08l4.42 7.78a1 1 0 1 0 1.69-1l-4.42-7.79a9 9 0 1 1 3.58 17.3z"></path>
                    </svg>
                </svg>`
            }/*
            if (farm.markerData.type === 28710) {
                type = `<img src="${prefix}/svg/mejeri-arla.svg" class="Icon-dairy" />`
            }
            if (farm.markerData.type === 28711) {
                type = `<img src="${prefix}/svg/mejeri-thise.svg" class="Icon-dairy thise" />`
            }
            if (farm.markerData.type === 28712) {
                type = `<img src="${prefix}/svg/mejeri-naturmaelk.svg" class="Icon-dairy" />`
            }
            if (farm.markerData.type === 28713) {
                type = `<img src="${prefix}/svg/mejeri-them.svg" class="Icon-dairy" />`
            }
            if (farm.markerData.type === 28714) {
                type = `<img src="${prefix}/svg/mejeri-logismose.svg" class="Icon-dairy" />`
            }
            if (farm.markerData.type === 28715) {
                type = `<img src="${prefix}/svg/mejeri-ollingegaard.svg" class="Icon-dairy ollingegaard" />`
            }
            if (farm.markerData.type === 28716) {
                type = `<img src="${prefix}/svg/mejeri-hansens.svg" class="Icon-dairy" />`
            }
            if (farm.markerData.type === 28717) {
                type = `<img src="${prefix}/svg/mejeri-glaserne.svg" class="Icon-dairy" />`
            }
            */

            const slideTemplate: string = `<div class="carousel-cell">
                                      <div class="Farm">
                                        <div class="Farm-header">
                                          <h3 class="u-subheadline">${farm.markerData.navn}</h3>
                                          <h3 class="u-subheadline subsubheadline">${this.transformHostType(farm.markerData.hosttype)}</h3>
                                          <p>${farm.markerData.distance} km væk fra dig</p>
                                        </div>
                                        <p class="Farm-owner">${farm.markerData.owner}</p>
                                        <p>${farm.markerData.address}, ${farm.markerData.zip_code} ${farm.markerData.city}</p>
                                        <div class="Farm-facilities">
                                          ${type}
                                          ${disabled}
                                          ${food}
                                          ${bicycle}
                                        </div>
                                        <a href="${farm.markerData.link}" class="Button">Læs mere</a>
                                      </div>
                                    </div>`

            // this._slideContent += slideTemplate
            doc.innerHTML = slideTemplate
            element = doc

            this._slideContent.push(element.firstChild)
        }, this)
        this._slider.append(this._slideContent)
    }
}

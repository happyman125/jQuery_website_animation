import { forEach } from '../utils'

export default class FarmsNear {
  private _farmsEl: Element
  private _farmsElInner: Element

  constructor(farmsClassName: string) {
    this._farmsEl = document.querySelector(farmsClassName)
  }

  public init(): void {
    this._farmsElInner = this._farmsEl.querySelector('.other-box')
  }

  public populateFarms(farms: Array<any>): void {
    let farmsContent: string = ''

    forEach(farms, (index, farm) => {
      let food: string = ''
      let disabled: string = ''
      let bicycle: string = ''
      let type: string = ''
      const prefix = (location.host !== 'localhost:5050') ? '' : '';

      if (farm.markerData.food) {
        food = `<i class="icon icon-eat"></i>`
      }
      if (farm.markerData.handicapvenlig) {
          disabled = `</i><i class="icon icon-ba"></i>`
      }
      if (farm.markerData.cykelforhold) {
          bicycle = `<i class="icon icon-vel"></i>`
      }
      
      const farmTemplate: string = `    
      <div class="other-box__item">
      <div class="name">${farm.markerData.navn}</div>
      <div class="dist">${farm.markerData.distance} km væk fra dig</div>
      <div class="address">
        <span>
          ${farm.markerData.owner}
        </span>
        <span>
          ${farm.markerData.address}, ${farm.markerData.city}
        </span>
      </div>
      <div class="icon-wrp">
        ${type}
        ${disabled}
        ${food}
        ${bicycle}
      </div>
      <a href="${farm.markerData.link}" class="btn btn--other">Læs mere</a>
    </div>`
      farmsContent += farmTemplate
    }, this)

    this._farmsElInner.innerHTML = farmsContent
  }
}

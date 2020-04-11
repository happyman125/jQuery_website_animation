const Choices = require('choices.js');

export default class Filter {
  private _filterClassName: string
  private _filterEl: any

  constructor(filterClassName: string) {
    this._filterClassName = filterClassName
  }

  public init(): void {
    this._filterEl = new Choices(this._filterClassName, {
      search: false,
      itemSelectText: ''
    })
  }
}



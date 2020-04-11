import { IMarker }  from './IMarker';

/**
 * Marker with more data than default.
 *
 * @interface IMarkerData
 */
export interface IMarkerData extends IMarker {
  filter: any;
  navn: string;
  owner: string;
  address: string;
  link: string;
  zip_code: string;
  city: string;
  locationID: number;
  umbracoID: number;
  hosttype: string;
}

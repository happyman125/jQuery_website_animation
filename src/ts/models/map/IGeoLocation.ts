/**
 * This is the response we will get from
 * navigator.geolocation.getCurrentPosition - to make it typesafe & sure
 *
 * @interface IGeoLocation
 */

interface Coords {
  accuracy: number
  altitude: number
  altitudeAccuracy: number
  heading: string
  latitude: number
  longitude: number
  speed: number
}

export interface IGeoLocation {
  coords: Coords
  timestamp: number
}

/**
 * Public Home Page types
 */

export interface PublicJumbotronData {
  file: string
  status: 'active' | 'inactive'
}

export interface PublicJumbotronResponse {
  data: PublicJumbotronData[]
}

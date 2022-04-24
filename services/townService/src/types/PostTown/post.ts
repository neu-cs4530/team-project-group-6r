export interface Post {
  _id?: string,
  title: string,
  postContent: string,
  ownerID: string,
  file?: {
    filename: string,
    contentType: string
  }
  isVisible: boolean,
  timeToLive: number,
  comments?: string[],
  coordinates: {
    x: number,
    y: number,
  },
  createdAt?: Date,
  updatedAt?: Date
}
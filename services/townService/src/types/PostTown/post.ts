export interface Post {
  _id?: string,
  title: string,
  postContent: string,
  ownerID: string,
  filename?: string,
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
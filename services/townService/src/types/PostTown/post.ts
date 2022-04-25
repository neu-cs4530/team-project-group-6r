enum PostSkin {
  POST = 'POST',
  WARNING = 'WARNING',
  TOMB = 'TOMB',
  FLOWER = 'FLOWER',
}

/**
 * A Post is a type of message a player can make, that can last for several hours, and be commented on by everybody in the town
 */
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
  numberOfComments: number,
  comments?: string[],
  postSkin: PostSkin,
  coordinates: {
    x: number,
    y: number,
  },
  createdAt?: Date,
  updatedAt?: Date
}
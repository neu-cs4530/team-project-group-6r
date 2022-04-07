export type Post = {
    _id?: String,
    title: String,
    postContent: String,
    ownerID: String,
    isVisible: Boolean,
    coordinates: {
        x: Number,
        y: Number,
    }
}
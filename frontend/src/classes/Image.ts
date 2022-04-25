import { bottle, tomb, post } from '../assets';

export const postAssetPath = '../../public/assets/post/';

export enum PostSkin {
    'POST',
    'WARNING',
    'TOMB',
    'FLOWER',
    'BOTTLE',
};

export interface PostNameMapType {
    [key: string]: {
        num: PostSkin,
        png: string,
    }
};

export type PostSkinMapType = {
    [key in PostSkin]: string;
};

export type PostSkinSpriteMapType = {
    postSkin: string;
    path: string;
};

export const postNameMap: PostNameMapType = {
    'Post': {
        num: PostSkin.POST,
        png: post,
    },
    'Bottle': {
        num: PostSkin.BOTTLE,
        png: bottle,
    },
    'Tomb': {
        num: PostSkin.TOMB,
        png: tomb,
    }
};

export const postSkinMap: PostSkinMapType = {
    [PostSkin.POST]: 'Post',
    [PostSkin.BOTTLE]: 'Bottle',
    [PostSkin.TOMB]: 'Tomb',
    1: "",
    3: ""
};

export const postSkinSpriteMap: PostSkinSpriteMapType[] = [
    {
        postSkin: (PostSkin.POST).toString(10),
        path: `${postAssetPath}post.png`,
    },
    {
        postSkin: (PostSkin.BOTTLE).toString(10),
        path: `${postAssetPath}bottle.png`,
    },
    {
        postSkin: (PostSkin.TOMB).toString(10),
        path: `${postAssetPath}tomb.png`,
    },
];
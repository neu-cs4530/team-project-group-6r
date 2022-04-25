import { bottle, tomb, post, chest, flower } from '../assets';

export const postAssetPath = '/assets/post/';

export enum PostSkin {
    POST = 'POST',
    CHEST = 'CHEST',
    TOMB = 'TOMB',
    FLOWER = 'FLOWER',
    BOTTLE = 'BOTTLE',
};

export type PostSkinMapType = {
    [key in PostSkin]: string;
};;

export type PostSkinSpriteMapType = {
    postSkin: PostSkin;
    path: string;
};

export const postSkinPngMap: PostSkinMapType = {
    [PostSkin.POST]: post,
    [PostSkin.BOTTLE]: bottle,
    [PostSkin.TOMB]: tomb,
    [PostSkin.CHEST]: chest,
    [PostSkin.FLOWER]: flower
};

export const postSkinSpriteMap: PostSkinSpriteMapType[] = [
    {
        postSkin: PostSkin.POST,
        path: `${postAssetPath}post.png`,
    },
    {
        postSkin: PostSkin.BOTTLE,
        path: `${postAssetPath}bottle.png`,
    },
    {
        postSkin: PostSkin.TOMB,
        path: `${postAssetPath}tomb.png`,
    },
    {
        postSkin: PostSkin.CHEST,
        path: `${postAssetPath}chest.png`,
    },
    {
        postSkin: PostSkin.FLOWER,
        path: `${postAssetPath}flower.png`,
    }
];
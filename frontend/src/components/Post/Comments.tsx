import React from 'react';
import { VStack, StackDivider } from '@chakra-ui/react';
import Comment, { CommentType } from './Comment';
import { ServerComment } from '../../classes/TownsServiceClient';

interface CommentsProps {
    comments: ServerComment[];
}

const dummyComments: CommentType[] = [
    {
        "_id": "6253bbb14a7080ec4a853ff9",
        "rootPostID": "6253bb0c4a7080ec4a853ff6",
        "parentCommentID": "",
        "ownerID": "test",
        "commentContent": "hehexd",
        "isDeleted": false,
        "createdAt": "2022-04-11T05:25:05.780Z",
        "updatedAt": "2022-04-11T05:28:18.251Z",
        "comments": [
            {
                "_id": "6253bbf84a7080ec4a854002",
                "rootPostID": "6253bb0c4a7080ec4a853ff6",
                "parentCommentID": "6253bbb14a7080ec4a853ff9",
                "ownerID": "test",
                "commentContent": "hohoxd",
                "isDeleted": false,
                "createdAt": "2022-04-11T05:26:16.920Z",
                "updatedAt": "2022-04-11T05:26:16.920Z",
                "comments": []
            },
            {
                "_id": "6253bc724a7080ec4a854012",
                "rootPostID": "6253bb0c4a7080ec4a853ff6",
                "parentCommentID": "6253bbb14a7080ec4a853ff9",
                "ownerID": "test",
                "commentContent": "hohoxd ~",
                "isDeleted": false,
                "createdAt": "2022-04-11T05:28:18.229Z",
                "updatedAt": "2022-04-11T05:28:18.229Z",
                "comments": []
            }
        ]
    },
    {
        "_id": "6253bbbb4a7080ec4a853ffc",
        "rootPostID": "6253bb0c4a7080ec4a853ff6",
        "parentCommentID": "",
        "ownerID": "test",
        "commentContent": "hehexd2",
        "isDeleted": false,
        "createdAt": "2022-04-11T05:25:15.778Z",
        "updatedAt": "2022-04-11T05:28:31.660Z",
        "comments": [
            {
                "_id": "6253bc034a7080ec4a854005",
                "rootPostID": "6253bb0c4a7080ec4a853ff6",
                "parentCommentID": "6253bbbb4a7080ec4a853ffc",
                "ownerID": "test",
                "commentContent": "hohoxd 2",
                "isDeleted": false,
                "createdAt": "2022-04-11T05:26:27.595Z",
                "updatedAt": "2022-04-11T05:26:27.595Z",
                "comments": []
            },
            {
                "_id": "6253bc7f4a7080ec4a854015",
                "rootPostID": "6253bb0c4a7080ec4a853ff6",
                "parentCommentID": "6253bbbb4a7080ec4a853ffc",
                "ownerID": "test",
                "commentContent": "hohoxd ~2",
                "isDeleted": false,
                "createdAt": "2022-04-11T05:28:31.639Z",
                "updatedAt": "2022-04-11T05:28:31.639Z",
                "comments": []
            }
        ]
    },
    {
        "_id": "6253bbbe4a7080ec4a853fff",
        "rootPostID": "6253bb0c4a7080ec4a853ff6",
        "parentCommentID": "",
        "ownerID": "test",
        "commentContent": "hehexd3",
        "isDeleted": false,
        "createdAt": "2022-04-11T05:25:18.284Z",
        "updatedAt": "2022-04-11T05:28:40.840Z",
        "comments": [
            {
                "_id": "6253bc0c4a7080ec4a854008",
                "rootPostID": "6253bb0c4a7080ec4a853ff6",
                "parentCommentID": "6253bbbe4a7080ec4a853fff",
                "ownerID": "test",
                "commentContent": "hohoxd 3",
                "isDeleted": false,
                "createdAt": "2022-04-11T05:26:36.524Z",
                "updatedAt": "2022-04-11T07:56:25.239Z",
                "comments": [
                    {
                        "_id": "6253df296a73af40f4ceec2a",
                        "rootPostID": "624ffc2f17691bfae913c7d1",
                        "parentCommentID": "6253bc0c4a7080ec4a854008",
                        "ownerID": "test",
                        "commentContent": "is that a rock ill jump over it",
                        "isDeleted": false,
                        "createdAt": "2022-04-11T07:56:25.198Z",
                        "updatedAt": "2022-04-11T07:56:25.198Z",
                        "comments": []
                    }
                ]
            },
            {
                "_id": "6253bc884a7080ec4a854018",
                "rootPostID": "6253bb0c4a7080ec4a853ff6",
                "parentCommentID": "6253bbbe4a7080ec4a853fff",
                "ownerID": "test",
                "commentContent": "hohoxd ~3",
                "isDeleted": false,
                "createdAt": "2022-04-11T05:28:40.819Z",
                "updatedAt": "2022-04-11T05:28:40.819Z",
                "comments": []
            }
        ]
    }
]

export default function Comments({ comments }: CommentsProps): JSX.Element {

    function buildCommentsRecursive(comment: ServerComment, depth: number, accum: JSX.Element[]): void {
        accum.push(<Comment key={comment._id} comment={comment} depth={depth} />)
        if (comment.comments) {
            comment.comments.forEach(c => buildCommentsRecursive(c, depth + 1, accum));
        }
    }

    function buildComments(): JSX.Element[] {
        const result: JSX.Element[] = [];
        comments.forEach(c => buildCommentsRecursive(c, 0, result));
        return result;
    }
    // Pull the comments 
    // Start a socket for the comments
    // Build the comments from the comments
    return (
        <VStack
            flex='2'
            overflow='auto'
            overflowX='hidden'
            divider={<StackDivider borderColor='gray.200' />}
            space='5'
            paddingRight='5px'>
            {buildComments()}
        </VStack>
    )
}
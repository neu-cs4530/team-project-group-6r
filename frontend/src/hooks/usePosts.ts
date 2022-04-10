import assert from 'assert';
import { useContext } from 'react';
import Post from '../classes/Post';
import PostContext from '../contexts/PostContext';

// TODO
export default function useConversationAreas(): Post[] {
  const ctx = useContext(PostContext);
  assert(ctx, 'Post context should be defined.');
  return ctx;
}

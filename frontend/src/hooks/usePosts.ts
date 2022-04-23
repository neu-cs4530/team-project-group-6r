import assert from 'assert';
import { useContext } from 'react';
import Post from '../classes/Post';
import PostContext from '../contexts/PostContext';

// TODO
/**
 * Provides access to the posts in coveytown
 */
export default function usePosts(): Post[] {
  const ctx = useContext(PostContext);
  assert(ctx, 'Post context should be defined.');
  return ctx;
}

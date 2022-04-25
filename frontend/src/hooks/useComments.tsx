import assert from 'assert';
import { useContext } from 'react';
import CommentContext, {CommentContextType} from '../contexts/CommentContext';

// TODO
/**
 * Provides access to comments in coveytown
 */
export default function useComments(): CommentContextType {
  const ctx = useContext(CommentContext);
  assert(ctx, 'Comment context should be defined.');
  return ctx;
}

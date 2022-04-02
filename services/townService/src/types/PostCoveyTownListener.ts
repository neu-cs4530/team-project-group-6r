import CoveyTownListener from "./CoveyTownListener";
import Player from "./Player";
import Post from "./Post";

/**
 * A listener that extends CoveyTownListener to include post/administrator update/remove events
 */
// TODO modify: townSocketAdapter
export default interface PostCoveyTownListener extends CoveyTownListener {
    onPostUpdated(post: Post): void;
    onPostRemoved(post: Post): void;
    onAdministratorUpdated(player: Player): void;
}
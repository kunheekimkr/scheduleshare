import { Indexable } from "yorkie-js-sdk";

/**
 * display each peer's name
 */
export function displayPeers(
  peers: Array<{ clientID: string; presence: Indexable }>
) {
  const users = [];
  for (const { presence } of peers) {
    users.push(presence.userName);
  }

  return users;
}

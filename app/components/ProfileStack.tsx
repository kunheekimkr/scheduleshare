import Image from "next/image.js";
import React, { useState, useEffect } from "react";
import "../styles/style.css";
import { ProfileStackProps, CreatePeerProps } from "../utils/types";

const MAX_PEER_VIEW = 4;

const createPeer = (props: CreatePeerProps) => {
  const { name, type } = props;
  if (type == "main")
    return (
      <div className="peer">
        <div className="profile">
          <Image
            src="/scheduleshare/profile.svg"
            alt="profile"
            className="profile-img"
            width={30}
            height={30}
          />
        </div>
        <div className="name speech-bubbles">{name}</div>
      </div>
    );
  else if (type == "other")
    return (
      <div className="peer">
        <Image
          src="/profile.svg"
          alt="profile"
          className="profile-img"
          width={30}
          height={30}
        />
        <span className="name">{name}</span>
      </div>
    );
};

export default function ProfileStack(props: ProfileStackProps) {
  const { presences, myClientID } = props;
  const [userName, setUserName] = useState("");
  const [otherUserNames, setOtherUserNames] = useState<Array<string>>([]);

  useEffect(() => {
    if (Array.isArray(presences)) {
      let transformed = presences.reduce((result, item) => {
        const { clientID, presence } = item;
        const { userName } = presence;
        result[clientID] = userName;
        return result;
      }, {});

      setUserName(transformed[myClientID]);
      delete transformed[myClientID];
      setOtherUserNames(Object.values(transformed));
    }
  }, [presences]);

  // create list of createPeer for each otherUserNames
  const peerCount = otherUserNames.length + 2;
  const hasMorePeers = peerCount > MAX_PEER_VIEW;

  let peerList = [];
  let peerMoreList = [];
  peerList.push(createPeer({ name: userName, type: "main" }));
  if (hasMorePeers) {
    // list of jsx elements
    peerList.push(createPeer({ name: otherUserNames[0], type: "main" }));
    peerList.push(createPeer({ name: otherUserNames[1], type: "main" }));
    for (let i = 2; i < otherUserNames.length; i++) {
      peerMoreList.push(createPeer({ name: otherUserNames[i], type: "other" }));
    }
    peerList.push(
      <div className="peer more">
        <div className="profile">+{peerCount - MAX_PEER_VIEW}</div>
        <div className="peer-more-list speech-bubbles">{peerMoreList}</div>
      </div>
    );
  } else {
    for (let i = 0; i < otherUserNames.length; i++) {
      peerList.push(createPeer({ name: otherUserNames[i], type: "main" }));
    }
  }

  return <div id="peerList">{peerList}</div>;
}

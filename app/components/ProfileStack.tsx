import Image from "next/image.js";
import React, { useState, useEffect } from "react";
import "../styles/style.css";

const MAX_PEER_VIEW = 4;

interface ProfileStackProps {
  presences: any;
  myClientID: string;
}

const createPeer = (name: string, type: string) => {
  if (type == "main")
    return (
      <div className="peer">
        <div className="profile">
          <Image
            src="/profile.svg"
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
  const [userName, setUserName] = useState("");
  const [otherUserNames, setOtherUserNames] = useState<Array<string>>([]);

  useEffect(() => {
    // Check if props.presences is an array
    if (Array.isArray(props.presences)) {
      // Now you can safely use map
      let transformed = props.presences.reduce((result, item) => {
        const { clientID, presence } = item;
        const { userName } = presence;
        result[clientID] = userName;
        return result;
      }, {});

      setUserName(transformed[props.myClientID]);
      delete transformed[props.myClientID];
      setOtherUserNames(Object.values(transformed));
    }
  }, [props.presences]);

  // create list of createPeer for each otherUserNames
  const peerCount = otherUserNames.length + 2;
  const hasMorePeers = peerCount > MAX_PEER_VIEW;

  let peerList = [];
  let peerMoreList = [];
  peerList.push(createPeer(userName, "main"));
  if (hasMorePeers) {
    // list of jsx elements
    peerList.push(createPeer(otherUserNames[0], "main"));
    peerList.push(createPeer(otherUserNames[1], "main"));
    for (let i = 2; i < otherUserNames.length; i++) {
      peerMoreList.push(createPeer(otherUserNames[i], "other"));
    }
    peerList.push(
      <div className="peer more">
        <div className="profile">+{peerCount - MAX_PEER_VIEW}</div>
        <div className="peer-more-list speech-bubbles">{peerMoreList}</div>
      </div>
    );
  } else {
    for (let i = 0; i < otherUserNames.length; i++) {
      peerList.push(createPeer(otherUserNames[i], "main"));
    }
  }

  return <div id="peerList">{peerList}</div>;
}

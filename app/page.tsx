"use client";
import yorkie, { Document, JSONArray, DocEventType } from "yorkie-js-sdk";
import React, { use, useEffect, useState } from "react";
import { ContentTypes, ENVtypes } from "./utils/types";
import { parseDate } from "./utils/parseDate";
import { displayPeers } from "./utils/handlePeers";
import ReactModal from "react-modal";
import Scheduler from "./components/Scheduler";
import CustomModal from "./components/modal";
import DisplayPeerList from "./components/ProfileStack";

const ENV: ENVtypes = {
  url: process.env.NEXT_PUBLIC_YORKIE_API_ADDR!,
  apiKey: process.env.NEXT_PUBLIC_YORKIE_API_KEY!,
};
const customModalStyles: ReactModal.Styles = {
  overlay: {
    backgroundColor: " rgba(0, 0, 0, 0.4)",
    width: "100%",
    height: "100vh",
    zIndex: "10",
    position: "fixed",
    top: "0",
    left: "0",
  },
  content: {
    width: "80%",
    height: "80%",
    zIndex: "150",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "10px",
    boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.25)",
    backgroundColor: "white",
    justifyContent: "center",
    overflow: "auto",
  },
};

const documentKey = `next.js-Scheduler-${parseDate(new Date())}`;

export default function Home() {
  const [content, setContent] = useState<Array<ContentTypes>>([]);
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [userName, setUserName] = useState("");
  const [myClientID, setMyClientID] = useState<any>();
  const [presences, setPresences] = useState<any>({});

  // Create Yorkie Documnet with useState
  const [doc] = useState<Document<{ content: JSONArray<ContentTypes> }>>(
    () => new yorkie.Document<{ content: JSONArray<ContentTypes> }>(documentKey)
  );

  const actions = {
    addContent(date: string, text: string) {
      doc.update((root) => {
        root.content.push({ date, text });
      });
    },

    deleteContent(date: string) {
      doc.update((root) => {
        let target;
        for (const item of root.content) {
          if (item.date === date) {
            target = item as any;
            break;
          }
        }

        if (target) {
          root.content.deleteByID!(target.getID());
        }
      });
    },

    updateContent(date: string, text: string) {
      doc.update((root) => {
        let target;
        for (const item of root.content) {
          if (item.date === date) {
            target = item;
            break;
          }
        }

        if (target) {
          target.text = text;
        }
      });
    },
  };

  // Setup Client with useEffect
  useEffect(() => {
    if (!userName) {
      setModalIsOpen(true);
      return;
    }

    const client = new yorkie.Client(ENV.url, {
      apiKey: ENV.apiKey,
    });

    doc.subscribe("presence", (event) => {
      if (event.type !== DocEventType.PresenceChanged) {
        setMyClientID(client.getID());
        setPresences(doc.getPresences());
      }
    });

    /**
     * `attachDoc` is a helper function to attach the document into the client.
     */
    async function attachDoc(
      doc: Document<{ content: JSONArray<ContentTypes> }>,
      callback: (props: any) => void
    ) {
      // 01. activate client
      await client.activate();
      // 02. attach the document into the client with presence
      await client.attach(doc, {
        initialPresence: {
          userName: userName,
        },
      });

      // 04. subscribe doc's change event from local and remote.
      doc.subscribe((event) => {
        callback(doc.getRoot().content);
      });

      // 05. set content to the attached document.
      callback(doc.getRoot().content);
    }

    attachDoc(doc, (content) => setContent(content));
  }, [modalIsOpen]);

  const handleUsernameInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const handleModalSubmit = () => {
    setModalIsOpen(false);
  };

  return (
    <main>
      <CustomModal
        isOpen={modalIsOpen}
        userName={userName}
        handleUsernameInput={handleUsernameInput}
        onModalSubmit={handleModalSubmit}
      />
      {!modalIsOpen ? (
        <>
          <DisplayPeerList presences={presences} myClientID={myClientID} />
          <div className="clear-both"></div>
          <Scheduler content={content} actions={actions} />
        </>
      ) : null}
    </main>
  );
}

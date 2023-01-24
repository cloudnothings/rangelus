import { type NextPage } from "next";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Chat from "../features/Chat/Chat";
import { useSession } from "next-auth/react";

const Home: NextPage = () => {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>Websocket Chat</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#008080] to-[#000000]">
        <Navbar title="WebSockets" loggedIn={session?.user ? true : false} />
        {session?.user ? (
          <ChatView />
        ) : (
          <AnonymousView />
        )}
      </main>
    </>
  );
};
const ChatView = () => {
  return (
    <div className="mt-24">
      <Chat />
    </div>
  )
}
const AnonymousView = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-4 mt-24">
      <h1 className="text-white font-bold text-4xl">Websocket Evaluation Chatroom</h1>
      <h2 className="text-white font-medium text-2xl">Sign in to start chatting</h2>
    </div>
  )
}

export default Home;


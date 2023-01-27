import { type NextPage } from "next";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Chat from "../features/Chat/Chat";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Websocket Chat</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#008080] to-[#000000]">
        <Navbar title="WebSockets" />
        <ChatView />
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

export default Home;


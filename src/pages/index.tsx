import { type NextPage } from "next";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Chat from "../features/Chat/Chat";
import { useSession } from "next-auth/react";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  if (status === "loading") return <></>
  return (
    <>
      <Head>
        <title>Cloud</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#008080] to-[#000000]">
        <Navbar loggedIn={session?.user ? true : false} />
        {session?.user ? (
          <div className="min-w-full items-center mt-24">
            <Chat />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 p-4 mt-24">
            <h1 className="text-white font-bold text-4xl">Welcome to Cloud</h1>
            <h2 className="text-white font-medium text-2xl">Sign in to start chatting</h2>
          </div>
        )}
      </main>
    </>
  );
};

export default Home;


import { type NextPage } from "next";
import Head from "next/head";
import Navbar from "../features/Stripe/Navbar";
import Chat from "../features/Chat/Chat";
import { useSession } from "next-auth/react";
import StripePage from "../features/Stripe/Stripe";

const Home: NextPage = () => {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>Stripe Payments</title>
        <meta name="description" content="Developer Site" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-black">
        <Navbar loggedIn={session?.user ? true : false} />
        {session?.user ? (
          <StripePage />
        ) : (
          <AnonymousView />
        )}
      </main>
    </>
  );
};

const AnonymousView = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-4 mt-24">
      <h1 className="text-white font-bold text-4xl">Stripe Playground</h1>
      <h2 className="text-white font-medium text-2xl">Sign in to start</h2>
    </div>
  )
}

export default Home;


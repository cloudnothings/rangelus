import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Navbar from "../components/Navbar";

const Home: NextPage = () => {
  const { data: session } = useSession();
  return (
    <>
      <Head>
        <title>Development Lab</title>
        <meta name="description" content="Sign in" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-black">
        <Navbar title="Development Lab" loggedIn={session?.user ? true : false} />
      </main>
    </>
  );
};

export default Home;


import { useEffect, useState } from "react";
import PusherJS from "pusher-js";
import { env } from "../../env/client.mjs";
import { api } from "../../utils/api";
import type { Message, User } from "@prisma/client";
import { boolean } from "zod";

const MESSAGE_LIMIT = 100
const ChatBox = ({ chatChannel }: { chatChannel: string }) => {
  const utils = api.useContext();
  const [cursor, setCursor] = useState<number>(0);
  const [chats, setChats] = useState<(Message & { author: User })[]>(
    utils.soketi.getMessages.getInfiniteData({
      channel: chatChannel, limit: MESSAGE_LIMIT
    })?.pages.flatMap(page => page.messages) || []
  );
  // setup infinite query for socketi get messages
  api.soketi.getMessages.useInfiniteQuery(
    { channel: chatChannel, limit: MESSAGE_LIMIT },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.messages.length < MESSAGE_LIMIT) return undefined;
        return cursor + MESSAGE_LIMIT;
      },
      enabled: !!chatChannel,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      refetchIntervalInBackground: false,
      onSuccess: (data) => {
        setCursor((prevState) => prevState + MESSAGE_LIMIT);
        setChats((prevState) => [...prevState, ...data.pages.flatMap((page) => page.messages)]);
      },
    },
  );
  useEffect(() => {
    // Potential Security Issue? Exposed Environment Variables?
    const pusher = new PusherJS(
      env.NEXT_PUBLIC_SOKETI_APP_KEY, {
      wsHost: env.NEXT_PUBLIC_SOKETI_HOST,
      wsPort: parseInt(env.NEXT_PUBLIC_SOKETI_PORT),
      wssPort: parseInt(env.NEXT_PUBLIC_SOKETI_PORT),
      cluster: "mt1",
      forceTLS: true,
      enabledTransports: ["ws", "wss"],
    });
    const channel = pusher.subscribe(chatChannel);
    channel.bind("chat-event", function (data: Message & { author: User }) {
      setChats((prevState) => [
        data, ...prevState,
      ]);
    });
    return () => {
      pusher.unsubscribe(chatChannel);
    };
  }, [chatChannel]);

  const { mutate } = api.soketi.sendMessage.useMutation();
  const [input, setInput] = useState('');
  // Submit if enter key only
  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      mutate({ message: input, channel: chatChannel })
      setInput('');
    }
  }
  // Update input value and update height of textarea element
  function handleInput(event: React.ChangeEvent<HTMLTextAreaElement>) {
    let value = event.target.value;
    if (!value.trim().length) {
      value = value.replace(/\r?\n/g, '');
    }
    setInput(value);
  }
  return (
    <div className="container flex flex-col w-96">
      <div className="bg-gray-800 border-0 h-96 overflow-scroll scrollbar-thin scrollbar-thumb-rounded-xl scrollbar-thumb-slate-900  rounded-md rounded-b-none p-2">
        <div className="flex flex-col gap-2 ">
          {chats.map((message, index) => (
            <ChatLine key={index} message={message} />
          ))}
        </div>
      </div>
      <textarea
        rows={4}
        className="block p-2.5 w-full text-sm rounded-t-none
       text-gray-900 bg-gray-50 rounded-lg border
        border-gray-300 focus:ring-blue-500
         focus:border-blue-500 dark:bg-gray-700
          dark:border-gray-600 dark:placeholder-gray-400
           dark:text-white dark:focus:ring-blue-500
            dark:focus:border-blue-500"
        placeholder="Write your thoughts here..."
        value={input}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
      />
    </div >
  )
}
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
const ChatLine = ({ message }: { message: Message & { author: User } }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex flex-row items-start gap-2">
      {/* Profile Picture Filler */}
      <img
        src={message.author.image || '/favicon.ico'}
        className="w-8 h-8 mt-1 rounded-full"
      />
      <button
        onClick={() => setOpen(!open)}
        className={classNames(
          open ? '' : 'max-h-32',
          "flex flex-col w-full overflow-ellipsis cursor-pointer hover:rounded-md px-2 overflow-hidden hover:transition-opacity hover:bg-opacity-20 hover:bg-black"
        )}>
        <div className="text-gray-500 text-xs font-medium">
          {message.author.name} - {new Date(message.createdAt).toLocaleTimeString()}
        </div>
        <div className="text-gray-50 text-start break-all">
          {message.content}
        </div>
      </button>
    </div>
  )
}


export default ChatBox
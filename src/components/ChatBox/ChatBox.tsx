import { useEffect, useState } from "react";
import PusherJS from "pusher-js";
import { api } from "../../utils/api";
import type { Message, User } from "@prisma/client";
import { useAutoAnimate } from '@formkit/auto-animate/react'
export type ChatBoxMessage = Message & { author: User }

const MESSAGE_LIMIT = 20
const ChatBox: React.FC<{ chatChannel: string }> = ({ chatChannel }: { chatChannel: string }) => {
  ///////
  // DATA
  ///////

  const [pusherKeys, setPusherKeys] = useState<{ key: string; wsHost: string; wsPort: string; }>();
  api.soketi.getClientKeys.useQuery(undefined, {
    onSuccess: setPusherKeys,
    refetchOnWindowFocus: false,
  });

  const [chats, setChats] = useState<ChatBoxMessage[]>([]);
  api.soketi.getMessages.useQuery(
    { channel: chatChannel, limit: MESSAGE_LIMIT },
    {
      enabled: !!chatChannel,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      refetchIntervalInBackground: false,
      onSuccess: setChats,
    },
  );

  // Inititialize Websocket
  useEffect(() => {
    if (pusherKeys) {
      const pusher = new PusherJS(pusherKeys.key, {
        wsHost: pusherKeys.wsHost,
        wsPort: parseInt(pusherKeys.wsPort),
        wssPort: parseInt(pusherKeys.wsPort),
        cluster: "mt1",
        forceTLS: true,
        enabledTransports: ["ws", "wss"],
      });
      const channel = pusher.subscribe(chatChannel);
      channel.bind("chat-event", function (data: ChatBoxMessage) {
        setChats((prevState) => [
          ...prevState, data
        ]);
      });
      return () => {
        pusher.unsubscribe(chatChannel);
      };
    }
  }, [pusherKeys, chatChannel]);

  const { mutate: sendMessage, isLoading: sendLoading } = api.soketi.sendMessage.useMutation({
    onSuccess: () => {
      setInput('')
      handleReturnToBottomClick()
    }
  });
  const [input, setInput] = useState('');
  // Submit if enter key only
  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      if (input.trim().length) {
        sendMessage({ message: input.trim(), channel: chatChannel })
      }
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

  //////////////
  // ANIMATION
  //////////////
  const [animationParent] = useAutoAnimate({ duration: 200, easing: 'ease-in-out' })
  const [autoScroll, setAutoScroll] = useState(true);
  useEffect(() => {
    // Listen for changes in scroll position
    const handleScroll = (event: Event) => {
      const target = event.target as HTMLElement;
      if (autoScroll) {
        setAutoScroll(false);
      }
    };

    const chatBox = document.getElementById('chat-box');
    if (chatBox) {
      chatBox.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (chatBox) {
        chatBox.removeEventListener('scroll', handleScroll);
      }
    };
  }, [autoScroll]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (chats.length > 0 && autoScroll) {
      const chatBox = document.getElementById('chat-box');
      if (chatBox) {
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    }
  }, [chats, autoScroll]);

  const handleReturnToBottomClick = () => {
    const chatBox = document.getElementById('chat-box');
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
    setAutoScroll(true);
  }

  return (
    <div className="container">
      <div className="flex flex-col" >
        <div id="chat-box" className="bg-gray-800 border-0 w-96 z-0 h-96 overflow-scroll scroll-smooth scrollbar-thin scrollbar-thumb-rounded-xl scrollbar-thumb-slate-900  rounded-md rounded-b-none p-2">
          {/* @ts-expect-error - auto-animate */}
          <div className="flex flex-col gap-2 z-0" ref={animationParent}>
            {chats.map((message, index) => (
              <ChatLine key={index} message={message} />
            ))}
          </div>
          {/* <button
            className="bg-opacity-20 text-xs z-20 bg-gray-300 hover:bg-opacity-40 text-white rounded-md px-2 py-1"
            onClick={handleReturnToBottomClick}>???</button> */}
        </div>
        <textarea
          rows={4}
          disabled={sendLoading}
          className="block p-2.5 w-full text-sm rounded-t-none rounded-lg focus: border-none focus:outline-none bg-gray-700 placeholder-gray-400 text-white"
          placeholder="Write your thoughts here..."
          value={input}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
        />
      </div >
    </div>
  )
}
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
const ChatLine = ({ message }: { message: Message & { author: User } }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex flex-row items-start gap-2 z-0">
      {/* Profile Picture Filler */}
      <img
        alt="profile pic"
        src={message.author?.image || '/favicon.ico'}
        className="w-8 h-8 mt-1 rounded-full"
      />
      <button
        onClick={() => setOpen(!open)}
        className={classNames(
          open ? '' : 'max-h-32',
          "flex flex-col w-full overflow-ellipsis cursor-pointer hover:rounded-md px-2 overflow-hidden hover:transition-opacity hover:bg-opacity-20 hover:bg-black"
        )}>
        <div className="text-gray-500 text-xs font-medium">
          {message.author?.name || 'Anonymouse'} - {new Date(message.createdAt).toLocaleTimeString()}
        </div>
        <div className="text-gray-50 text-start break-all">
          {message.content}
        </div>
      </button>
    </div>
  )
}


export default ChatBox
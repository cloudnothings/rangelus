const MESSAGE_LIMIT = 10
const ChatBox = ({
  messages
}: { messages: string[] }) => {

  return (
    <div className="flex flex-col">
      <div className="bg-white border-2 border-black rounded-xl rounded-b-none p-2">
        <div className="flex flex-col gap-2 ">
          {messages.slice(-MESSAGE_LIMIT).map((message, index) => (
            <ChatLine key={index} message={message} />
          ))}

        </div>
      </div>
      <div className="bg-white border-2 border-t-0 border-black rounded-xl rounded-t-none p-2">
        <textarea ></textarea>
      </div>
    </div>
  )
}

const ChatLine = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-row items-center gap-2">
      {/* Profile Picture Filler */}
      <div className="w-8 h-8 bg-black rounded-full"></div>
      <div className="text-black ">{message}</div>
    </div>
  )
}

export default ChatBox
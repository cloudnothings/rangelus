import type { Channel } from '@prisma/client';
import { useState } from 'react';
import ChatBox from '../../components/ChatBox/ChatBox';
import { api } from '../../utils/api';

const Chat = () => {
  const [currentChannel, setCurrentChannel] = useState<Channel>()
  const { data: channels, isLoading, isInitialLoading, isSuccess } = api.channel.getPublicChannels.useQuery(undefined, {
    onSuccess: (data) => {
      setCurrentChannel(data[0])
    },
    refetchOnReconnect: false,
  })
  if (isLoading || isInitialLoading) return <></>
  if (isSuccess) {
    return (
      <div className='container flex justify-evenly items-center'>
        <div>
          {currentChannel?.id ? (
            <>
              <div className='flex flex-row justify-between'>
                <select className="bg-transparent border-0 rounded-md p-1 m-1 focus:border-0 focus:ring-0 focus:ring-transparent focus:outline-0 text-white font-medium "
                  onChange={(e) => setCurrentChannel(channels?.find(channel => channel.id === e.target.value))}>
                  {channels?.map(channel => (
                    <option key={channel.id} value={channel.id}>{channel.name}</option>
                  ))}
                </select>
              </div>
              <ChatBox chatChannel={currentChannel.id} /></>
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  }
  return <></>
}

export default Chat
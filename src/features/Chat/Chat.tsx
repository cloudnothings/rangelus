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
    refetchOnWindowFocus: false,
  })
  if (isLoading || isInitialLoading) return <div className='container bg-black text-white text-xl items-center flex justify-center'>No Channels found</div>
  if (isSuccess) {
    return (
      <div className='container flex justify-evenly items-center'>
        <div>
          {currentChannel?.id ? (
            <div className='flex flex-col items-end'>
              <select className="bg-transparent border-0 rounded-md p-1 m-1 focus:border-0 focus:ring-0 focus:ring-transparent focus:outline-0 text-white font-medium w-22"
                onChange={(e) => setCurrentChannel(channels?.find(channel => channel.id === e.target.value))}>
                {channels?.map(channel => (
                  <option className='bg-black text-white' key={channel.id} value={channel.id}>{channel.name}</option>
                ))}
              </select>
              <ChatBox chatChannel={currentChannel.id} /></div>
          ) : (
            <>Here</>
          )}
        </div>
      </div>
    );
  }
  return <div className='container flex justify-center items-center bg-black text-white text-xl '>Ruh Roh</div>
}

export default Chat
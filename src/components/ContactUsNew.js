import React, {useEffect} from 'react'
import Image from '../commonComponents/Image'
import Text from '../commonComponents/Text'
import fb from '../assets/gmobileSocial/fb.png'
import ig from '../assets/gmobileSocial/ig.png'
import twitter from '../assets/gmobileSocial/twitter.png'
import gmobile from '../assets/gmobileSocial/gmobile.png'
import yt from '../assets/gmobileSocial/yt.png'
import {SendGuiDataEvents} from '../commonScript';


export default function ContactUsNew() {
    useEffect(() => {
    let guiDataEvent = {}
    guiDataEvent['page'] = 'contactus';
    guiDataEvent['event'] = 'open';
    SendGuiDataEvents(guiDataEvent);
  }, []);

  return (
    <div className="bg-white min-w-screen px-2 min-h-screen">
        <a href='https://www.facebook.com/GMobile' target="_blank" rel="noreferrer" className='flex px-2 border-b-2 pb-1 my-2  pt-10 '>
            <Image 
                url = {fb}
                styles = {"w-12 h-12"}
            />
            <Text 
                tag='h6'
                text= {"http://www.facebook.com/GMobile"}
                styles = {"my-auto ml-2"}
                
            />
        </a>
        <a href='https://www.twitter.com/GmobileOfficial' target="_blank" rel="noreferrer" className='flex px-2 border-b-2 pb-1 my-2'>
            <Image 
                url = {twitter}
                styles = {"w-12 h-10"}
            />
            <Text 
                tag='h6'
                text= {"www.twitter.com/GmobileOfficial"}
                styles = {"my-auto ml-2"}
            />
        </a>
        <a href='https://www.youtube.com/user/GmobileOfficial' target="_blank" rel="noreferrer" className='flex px-2 border-b-2 pb-1 my-2'>
            <Image 
                url = {yt}
                styles = {"w-12 h-12"}
            />
            <Text 
                tag='h6'
                text= {"www.youtube.com/user/GmobileOfficial"}
                styles = {"my-auto ml-2"}
            />
        </a>
        <a href='https://www.instagram.com/gmobile_official' target="_blank" rel="noreferrer" className='flex px-2 border-b-2 pb-1 my-2'>
            <Image 
                url = {ig}
                styles = {"w-12 h-12"}
            />
            <Text 
                tag='h6'
                text= {"https://instagram.com/gmobile_official"}
                styles = {"my-auto ml-2"}
            />
        </a>
        <a href='https://gmobile.mn/' target="_blank" rel="noreferrer" className='flex px-2 border-b-2 pb-1 my-2'>
            <Image 
                url = {gmobile}
                styles = {"w-12 h-12"}
            />
            <Text 
                tag='h6'
                text= {"https://gmobile.mn/"}
                styles = {"my-auto ml-2"}
            />
        </a>
        <div className='mt-10'>
            <div>
                <span className='font-bold'>"Хаяг: </span>
                Жимобайл ХХК, Бага тойруу - 3/9, Ш/х-2783, Улаанбаатар-15160, Монгол улс
            </div>
            <div>
                <span className='font-bold'>"Утас: </span>
                    98103636, 3636 /Жимобайлын дугаараас үнэгүй/\
            </div>
           
        </div>
    </div>
  )
}

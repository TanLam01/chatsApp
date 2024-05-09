import LogoImage from '@logos/chat-logo.svg'
import Link from 'next/link'
import { AspectRatio } from './ui/aspect-ratio'
import Image from 'next/image'

function Logo() {
    return (
        <Link href="/" prefetch={false} className='overflow-hidden'>
            <div className='flex items-center w-12 h-14'>
                <AspectRatio
                    ratio={12 / 9}
                    className="flex items-center justify-center"
                >
                    <Image
                        priority
                        src={LogoImage}
                        alt="logo"
                        className='dark:filter dark:invert'
                    />
                </AspectRatio>
            </div>
        </Link>
    )
}

export default Logo
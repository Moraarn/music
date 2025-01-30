import { FC } from 'react'
import SongForm from './form'


const Page: FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-4xl p-8 bg-white shadow-lg rounded-lg">
        <SongForm />
      </div>
    </div>
  )
}

export default Page

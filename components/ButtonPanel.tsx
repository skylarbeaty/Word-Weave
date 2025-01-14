import React from 'react'

const ButtonPanel = () => {
  return (
    <div className='bg-indigo-200 mt-2 mb-2 p-4 rounded shadow-lg flex justify-between'>
        <button className='bg-indigo-800 text-white p-3 mr-1 min-w-24 rounded-lg'>Restart</button>
        <button className='bg-indigo-800 text-white p-3 ml-1 mr-1 min-w-24 rounded-lg'>Return</button>
        <button className='bg-indigo-800 text-white p-3 ml-1 mr-1 min-w-24 rounded-lg'>Shuffle</button>
        <button className='bg-indigo-800 text-white p-3 ml-1 min-w-24 rounded-lg'>Move</button>
    </div>
  )
}

export default ButtonPanel
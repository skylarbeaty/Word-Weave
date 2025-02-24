import React from 'react'

const InputPanel = () => {
  return (
    <div className='bg-indigo-100 mt-2 mb-2 p-4 rounded shadow-lg flex justify-between'>
        <input className='p-2 mr-1 rounded-lg min-w-max'></input>
        <button className='bg-indigo-800 text-white p-3 mr-1 ml-1 min-w-24 rounded-lg'>Enter</button>
        <button className='bg-indigo-800 text-white p-3 ml-1 min-w-24 rounded-lg'>Cycle</button>
    </div>
  )
}

export default InputPanel
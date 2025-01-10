import React from 'react'

interface BoardSpaceProps {
    children?: React.ReactNode;
}

const BoardSpace = ({ children }: BoardSpaceProps) => {
    return (
        <div className="border border-dashed border-indigo-400 w-10 h-10 flex items-center justify-center">
            {children}
        </div>
    )
}

export default BoardSpace
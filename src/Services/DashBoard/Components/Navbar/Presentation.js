import React from 'react'

function Presentation(props) {
    const{onSignout}=props
    return (
        <div>
            Hello Signedin user
            <button onClick={onSignout} className="flex w-200 bg-indigo-700 hover:bg-indigo-900 text-white font-medium py-2 px-2 mt-5 rounded focus:outline-none focus:shadow-outline">Signout</button>
        </div>
    )
}

export default Presentation

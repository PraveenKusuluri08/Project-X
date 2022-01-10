import React from 'react'
import Presentation from './Presentation'
import {onSignout} from "../../../Authentication/middleware/index"
import { connect } from 'react-redux'



function Container(props) {
    const{onSignout}= props
    return (
        <div>
            <Presentation onSignout={onSignout}/>
        </div>
    )
}

const mapDispatchToProps=(dispatch)=>{
    return{
        onSignout:()=>dispatch(onSignout())
    }
}

export default connect(null,mapDispatchToProps) (Container)

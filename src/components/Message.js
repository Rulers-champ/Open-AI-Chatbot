import React from 'react';
import Person from './Images/person.png';
import Robot from './Images/robot.png';
import Bookmark from './Images/bookmark.png';
import Unbookmark from './Images/unbookmark.png';
import Delete from './Images/delete.png';
import './Message.css';


function Message(props)
{
    
    

    function handleDelete()
    {
        props.deleteData(props.id);
    }

    function handleSave()
    {
       props.saveData(props.prompt,props.response,props.id);
    }

    function handleUnsave()
    {
        props.unsaveData(props.id);
    }


    return <div className='message-container'>     
                
                
                
                <div className='message-text text-1'>
                    <img src={Person} className="message-img msg-img-1" />
                    <p>{props.prompt}</p>
                </div>


                <div className='message-text text-2'>
                    <img src={Robot} className="message-img msg-img-2" />
                    <p>
                       {props.response}
                    </p>   
                </div>

                <div className='message-footer'>
                   <button onClick={handleDelete} ><img className='message-icon' src={Delete}  /></button>
                   <button onClick={props.isSave?handleUnsave:handleSave}><img className='message-icon' src={props.isSave?Bookmark:Unbookmark} /></button>                   
                </div>
            </div>
                
            
                        
            
}

export default Message;
import React from 'react';

function Header(props)
{
  function handleSaveItems()
  {
    props.showsaveitem();
  }

  function handleHOmelink()
  {
    console.log("clicked");
    props.showHome();
  }


    return <div className="header">
             <h1 className='home-link' onClick={handleHOmelink}>Fun With AI</h1>
             <button className='form-btn-2' onClick={handleSaveItems}>Saved</button>
           </div>
}

export default Header;
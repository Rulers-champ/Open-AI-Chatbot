import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Message from './components/Message';
import Settings from './components/Images/settings.png';
import './App.css';
import { Prev } from 'react-bootstrap/esm/PageItem';


const { Configuration, OpenAIApi } = require("openai");



const getAllfromLS=()=>{

  const othersdata=localStorage.getItem('allData');
  if (othersdata)
    return JSON.parse(othersdata);
  else 
    return [];
}


const getSavedfromLS=()=>{

  const saveddata=localStorage.getItem('saveItems');

  if (saveddata)
    return JSON.parse(saveddata);
  else
    return [];  
}

function App() {
   
  const [inputData,setinputData]=useState("");
  const [allData,setallData]=useState(getAllfromLS());
  const [saveItems,setsaveItems]=useState(getSavedfromLS());
  const [isLoaded,setisLoaded]=useState(true);  
  const [dropvisible,setdropvisible]=useState(false);
  const [engine,setengine]=useState("text-davinci-002");

  const [prevmark,setprevmark]=useState(0);
  const [displaysave,setdisplaysave]=useState(false);
  
  const [enginemark,setenginemark]=useState([true,false,false,false]);
  
  console.log(saveItems);
  
  
  //console.log(process.env.REACT_APP_OPENAI_KEY);

  //console.log(enginemark);
  

  function updateText(event)
  {
    setinputData(event.target.value);
  }


  function handleSubmit()
  {
    console.log(inputData);
    const configuration = new Configuration({
      apiKey:process.env.REACT_APP_OPENAI_KEY ,
    });

    
    setisLoaded(false);
    //console.log(allData);


    const openai = new OpenAIApi(configuration);

      openai.createCompletion(`${engine}` , {
      prompt: `${inputData}`,
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })
    .then((response)=>{
          
      setallData([{prompt:`${inputData}`,response:`${response.data.choices[0].text}`,isSave:false},...allData]);
      setisLoaded(true);
      setinputData("");
     
    });

    

    
  }

  function handleDrop()
  {
    setdropvisible((prev)=>{
      return !prev;
    })
  }
  
  function selectDrop(event)
  {
   // console.log(event.target.name);
      let idx;
      if (event.target.name=="text-davinci-002")
      {
        setengine("text-davinci-002");
        idx=0;
      }
      else if (event.target.name=="text-curie-001")
      {
        setengine("text-curie-001");
        idx=1;
      }
      else if (event.target.name=="text-babbage-001")
      {
        setengine("text-babbage-001");
        idx=2;
      }
      else
      {
        setengine("text-ada-001");
        idx=3;
      }

      
      let arr=[...enginemark];
      arr[prevmark]=!arr[prevmark];      
      arr[idx]=!arr[idx];
      setprevmark(idx);
      setenginemark(arr);

  }

  
  

  function deleteData(pin)
  {
     setallData((prev)=>{
       return prev.filter((iten,idx)=>{
          return idx!=pin;
       });
     });
     
     setsaveItems((prev)=>{
      return prev.filter((item)=>{
        return item.key!=pin;
      });
    });
     
  }


  function saveData(sender,receiver,pin)
  {
    let arr=[...allData];
    arr[pin].isSave=true;
    setallData(arr);

    setsaveItems((prev)=>{
      return [...prev,{key:pin,prompt:`${sender}`,response:`${receiver}`,isSave:true}];
    });
  }
  
  function unsaveData(pin)
  {
    setsaveItems((prev)=>{
      return prev.filter((item)=>{
        return item.key!=pin;
      });
    });


    let arr=[...allData];
    arr[pin].isSave=false;
    setallData(arr);
  }

  function showsaveitem()
  {
     setdisplaysave(!displaysave);
  }

  function  showHome()
  {
    console.log("received");
    if (displaysave)
    {
      setdisplaysave(!displaysave);
    }
  }
  
 



  useEffect(()=>{
      
    localStorage.setItem('allData',JSON.stringify(allData));

  },[allData]);
  
  useEffect(()=>{
    localStorage.setItem('saveItems',JSON.stringify(saveItems));
  },[saveItems]);


  return (
    <div>
       <Header showsaveitem={showsaveitem} showHome={showHome}/>
      
      {displaysave?
        <div className='saved-container'>
          <h6> Saved Items</h6>
          <div className='saved-wrapper'>
            {
              saveItems.map((item,idx)=>{
                return <Message key={item.key} id={item.key} prompt={item.prompt} response={item.response} isSave={item.isSave} deleteData={deleteData} saveData={saveData} unsaveData={unsaveData}  /> 
              })
            }

          </div>
        </div>:
        <></>
      }
     
      <div className='main-content'>
         
          {displaysave?<></>:
          <><div className='form-container'>
                
                <textarea onChange={updateText} rows="10" placeholder="Enter Your Question" value={inputData}/>
                <div className='form-footer'>
                    <button className='form-btn-1' onClick={handleDrop}><img  src={Settings} /></button>       
                    <button className="form-btn-2" onClick={handleSubmit}>Submit</button>
                </div>
                
                <div className={dropvisible?"":"notvisible"}>
                  <div className="btn-dropdown-content">
                      <button name="text-davinci-002" onClick={selectDrop} className={"drop-btn "+(enginemark[0]?"setgreen":"")}>text-davinci-002</button>
                      <button name="text-curie-001" onClick={selectDrop}  className={"drop-btn "+(enginemark[1]?"setgreen":"")}>text-curie-001</button>
                      <button name="text-babbage-001" onClick={selectDrop}  className={"drop-btn "+(enginemark[2]?"setgreen":"")}>text-babbage-001</button>
                      <button name="text-ada-001" onClick={selectDrop}  className={"drop-btn "+(enginemark[3]?"setgreen":"")}>text-ada-001</button>      
                  </div>  
                </div>
                          
                
            </div>
            
            <div className="all-item-wrapper">
                {
                    isLoaded?<></>:
                    <div className='center'>
                        <div className='ring'></div>
                        <span>Fetching...</span>
                    </div>
                    
                }
                
                {
                  allData.map((item,idx)=>{
                    return <Message key={idx} id={idx} prompt={item.prompt} response={item.response} isSave={item.isSave} deleteData={deleteData} saveData={saveData} unsaveData={unsaveData}/>
                  })
                
                }
            </div></>
                
          }




      </div>
      
      
      

      

    </div>
  );
}

export default App;

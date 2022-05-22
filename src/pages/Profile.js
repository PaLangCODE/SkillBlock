import React from "react";
import "./Profile.css";
import { Link } from "react-router-dom";
import { Icon, ConnectButton, useNotification } from "web3uikit";
import { useState, useRef } from "react";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import User from "../components/User";


const Profile = () => {
  const { Moralis, account } = useMoralis();
  const user = Moralis.User.current();
  const contractProcessor = useWeb3ExecuteFunction();

  const inputFile = useRef(null);
  const [selectedFile, setSelectedFile] = useState();
  const [theFile, setTheFile] = useState();
  

  const [nameS, setNameS] = useState('');
  const [cityS, setCityS] = useState('');
  const [latS, setLatS] = useState();
  const [longS, setLongS] = useState();
  const [unoDescriptionS, setUnoDescriptionS] = useState('');
  const [dosDescriptionS, setDosDescriptionS] = useState('');
  const [pricePerDayS, setPricePerDayS] = useState();
  const [datesBookedS, setDatesBookedS] = useState([]);
  const [idS]=useState();
  const[laboursS]=useState([]);
  const dispatch = useNotification();

  const handleSuccess = () => {
    dispatch({
      type: "success",
      message: `Nice! You have booked your service!!`,
      title: "Details provided Succesfully",
      position: "bottomL",
    });
  };

  async function maticTweet() {
    

    if (!nameS) return;
    if (!cityS) return;
    if (!latS) return;
    if (!longS) return;
    if (!dosDescriptionS) return;
    if (!unoDescriptionS) return;
    if (!pricePerDayS) return;
    if (!datesBookedS) return;

    let img;
    if (theFile) {
      const data = theFile;
      const file = new Moralis.File(data.name, data);
      await file.saveIPFS();
      img = file.ipfs();
    } else {
      img = "No Img";
    }

    let options = {
      contractAddress: "0x467ebad6bb13566d8f722bc1Af72c7Ef2C65765b",
      functionName: "addRentals",
      chain: "polygon",
      abi: [
        {
          inputs: [
            {
              internalType: "string",
              name: "_name",
              type: "string",
            },
            {
              internalType: "string",
              name: "_city",
              type: "string",
            },
            {
              internalType: "string",
              name: "_lat",
              type: "string",
            },
            {
              internalType: "string",
              name: "_long",
              type: "string",
            },
            {
              internalType: "string",
              name: "_unoDescription",
              type: "string",
            },
            {
              internalType: "string",
              name: "_dosDescription",
              type: "string",
            },
            {
              internalType: "string",
              name: "_imgUrl",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "_pricePerDay",
              type: "uint256",
            },
            {
              internalType: "string[]",
              name: "_datesBooked",
              type: "string[]",
            },
          ],
          name: "addRentals",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      params: {
        
        _name: nameS,
        _city: cityS,
        _lat: latS,
        _long: longS,
        _unoDescription: unoDescriptionS,
        _dosDescription: dosDescriptionS,
        _imgUrl: img,
        _pricePerDay: pricePerDayS,
        _datesBooked: datesBookedS,
        counter: 0,
        id: idS,
        labours: laboursS,
      },
      
    };

    await contractProcessor.fetch({
      params: options,
      onSuccess: () => {
        handleSuccess();
      },
      onError: (error) => {
        console.log(error.message);
      },
    });
  }

  const onImageClick = () => {
    inputFile.current.click();
  };

  const changeHandler = (event) => {
    const img = event.target.files[0];
    setTheFile(img);
    setSelectedFile(URL.createObjectURL(img));
  };

  return (
    <>
      <div className="pageIdentify"><Link to="/"><span className="brand">Home</span></Link> 
      <div className="lrContainers">
        {account && <User account={account} />}
        <ConnectButton />
      </div></div>
     
      <div className="mainContent">
        <div className="profileTweet">
          <div className="vectorContainer">
            <div className="vector1"></div>
            <div className="vector2"></div>
          </div>
          <div className="tweetBox">
            <div className="imgDiv" onClick={onImageClick}>
                <input
                  type="file"
                  name="file"
                  ref={inputFile}
                  onChange={changeHandler}
                  style={{ display: "none" }}
                />
                <Icon fill="#1DA1F2" size={20} svg="image"></Icon>
              {selectedFile && (
              <img src={selectedFile} className="tweetImg"></img>
            )}
              </div>
            <input
              label="name"
              name="name"
              placeholder="Name"
              type="text"
              onChange={(e) => setNameS(e.target.value)}
              class="innput"
              
            ></input>
            <input
              label="city"
              name="tweetTxtArea"
              placeholder="Enter City"
              type="text"
              onChange={(e) => setCityS(e.target.value)}
              
            ></input>
            <div class="position">
            <input
              label="lat"
              name="tweetTxtArea"
              placeholder="Enter Lattitude"
              type="text"
              onChange={(e) => setLatS(e.target.value)}
              className="pos"
              
            ></input>
            <input
              label="long"
              name="tweetTxtArea"
              placeholder="Enter Longitude"
              type="text"
              onChange={(e) => setLongS(e.target.value)}
              className="pos"
            
            ></input>

            </div>
            <input
              label="unoDescription"
              name="tweetTxtArea"
              placeholder="Enter Description"
              type="text"
              onChange={(e) => setUnoDescriptionS(e.target.value)}
              
            ></input>
            <input
              label="dosDescription"
              name="tweetTxtArea"
              placeholder="More details"
              type="text"
              onChange={(e) => setDosDescriptionS(e.target.value)}
              
            ></input>

            <input
              label="pricePerDay"
              name="tweetTxtArea"
              placeholder="Enter Price/day"
              type="text"
              onChange={(e) => setPricePerDayS(e.target.value)}
              
            ></input>

            <div className="imgOrTweet">
              
              <div className="tweetOptions">
                <div
                  className="tweet"
                  onClick={maticTweet}
                  style={{ backgroundColor: "#8247e5" }}
                >
                  <Icon fill="#ffffff" size={40} svg="matic" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

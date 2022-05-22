import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import {ConnectButton, Icon, Select, DatePicker, Input, Button} from "web3uikit";
import {useState} from "react";


const Home = () => {
  const [checkIn, setCheckIn]=useState(new Date());
  const [checkOut, setCheckOut]=useState(new Date());
  const [destination, setDestination]= useState("Bhubaneswar");
  

  return (
    <>
      <div className="container">
        <div className="containerGradient"></div>
      </div>
      <div className="topBanner">
        <div className="labourforce">
          <span class="navBrandContainer">🛠️SkillBlock</span>
          
        </div>


        <div className="lrContainers">
          
          <span class = "lmk" > < Link to = "Profile">
          <Button
          text = " Labours Profile"
          onClick = {
            () => console.log(checkOut)
          }
          /></Link> 
          </span>

          <span><ConnectButton /></span>

        </div>


      </div>
      
      <div className="randomLocation">

        

      </div>
            <div className="tabContent">
        <div className="searchFields">
          <div className="inputs">
            Location
            <Select
                defaultOptionIndex={0}
                onChange={(data) => setDestination(data.label)}
                options={[
                  {
                    id: "ab",
                    label: "Enter City"
                  },
                  {
                    id: "ny",
                    label: "Delhi"
                  },
                  {
                    id: "Pt",
                    label: "Patna"
                  },
                  {
                    id: "Rn",
                    label: "Ranchi"
                  },
                  {
                    id: "Kk",
                    label: "Kolkata"
                  },
                ]}
              />
          </div>
          
          <div className="inputs">
            Rent From
            <DatePicker
                id="date-picker"
                onChange={(event) => setCheckIn(event.date)}
            />
          </div>
          
          <div className="inputs">
            Rent To
            <DatePicker
                id="date-picker"
                onChange={(event) => setCheckOut(event.date)}
            />
          </div>
          
          
          <Link to={"/rentals"} state={{
            destination: destination,
            checkIn: checkIn,
            checkOut: checkOut,
            
          }}>
          <div className="searchButton">
            <Icon fill="#ffffff" size={24} svg="search" />
          </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;

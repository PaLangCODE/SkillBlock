import React from "react";
import "./Rentals.css";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import { Button, ConnectButton, useNotification } from "web3uikit";
import RentalsMap from "../components/RentalsMap";
import { useState, useEffect } from "react";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import {Icon} from '@iconify/react';
import User from "../components/User";

const Rentals = () => {

  const { state: searchFilters } = useLocation();
  const [highLight, setHighLight] = useState();
  const { Moralis, account } = useMoralis();
  const [rentalsList, setRentalsList] = useState();
  const [coOrdinates, setCoOrdinates] = useState();
  const contractProcessor = useWeb3ExecuteFunction();
  const dispatch = useNotification();

  const handleSuccess = () => {
    dispatch({
      type: "success",
      message: `Nice! You have booked a Labour at ${searchFilters.destination}!!`,
      title: "Booking Succesful",
      position: "bottomL",
    });
  };
  const handleError = (msg) => {
    dispatch({
      type: "error",
      message: `${msg}`,
      title: "Booking Failed",
      position: "bottomL",
    });
  };

  const handleNoAccount = () => {
    dispatch({
      type: "error",
      message: `You need to connect your wallet to book a Labour Service`,
      title: "Not Connected",
      position: "bottomL",
    });
  };



  useEffect(() => {
    async function fetchRentalsList() {
      const Rentals = Moralis.Object.extend("Services");
      const query = new Moralis.Query(Rentals);
      query.equalTo("city", searchFilters.destination);
      

      const result = await query.find();
      let cords = [];
      result.forEach((e) => {
        cords.push({ lat: e.attributes.lat, lng: e.attributes.long });
      });

      setCoOrdinates(cords);
      setRentalsList(result);
    }
    fetchRentalsList()
  }, [searchFilters])

  const bookRental = async function (start, end, id, dayPrice) {

    for (
      var arr=[], dt = new Date(start);
      dt<=end;
      dt.setDate(dt.getDate() + 1)
    ) {
      arr.push(new Date(dt).toISOString().slice(0, 10)); //yyyy-mm-dd
    }

    let options = {
      contractAddress: "0xd78B1544cCe372d72e58d1CD5aB76021Abe33e11",
      functionName: "addDatesBooked",
      abi: [
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string[]",
              "name": "newBookings",
              "type": "string[]"
            }
          ],
          "name": "addDatesBooked",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        }
      ],
      params: {
        id: id,
        newBookings: arr,
      },
      msgValue: Moralis.Units.ETH(dayPrice * arr.length),
    }

    await contractProcessor.fetch({
      params: options,
      onSuccess: () => {
        handleSuccess();
      },
      onError: (error) => {
        handleError(error.data.message)
      }
    });

  }








  return (
    <>
      
      <div className="topBanner2">
        <div>
          <Link to="/">
            <div className="labourforce">
              <span className="brand">🛠️SkillBlock</span>
            </div>
          </Link>
        </div>
        <div className="lrContainers">
          {account &&
            <User           
            account={account} />
          }
          <ConnectButton />
        </div>
        
      </div>
      

    
      <div className="rentalsContent">
        
        <div className="rentalsContentL">
          
          {rentalsList &&
            rentalsList.map((e, i) => {
              return (
                <>
        
                  <div className = "rentalDiv"
                  style = {
                    {
                      backgroundImage: `url(${e.attributes.imgUrl})`
                    }
                  }>
                  <div className ={highLight ==i ?"rentalMaskH" : 'rentalMask'}>
                    <div className="rentalInfo">
                      <div className="batanCunt">
                        <Button 
                        onClick={
                          () => {
                            if (account) {
                              bookRental(
                                searchFilters.checkIn,
                                searchFilters.checkOut,
                                e.attributes.uid_decimal.value.$numberDecimal,
                                Number(e.attributes.pricePerDay_decimal.value.$numberDecimal)
                              )
                            } else {
                              handleNoAccount()
                            }
                          }
                        }
                        text="+"
                      />
                      </div>
                      </div>
                      <div class="bottom">
                        <div class="buttumCuntainer">
                      <div className="rentalTitle">{e.attributes.name}</div>
                      <div className="rentalDesc">
                        {e.attributes.unoDescription}
                      </div>
                      <div className="rentalDesc">
                        {e.attributes.dosDescription}
                        
                      </div>
                      </div>
                      </div>

                      <div className = "price" ><div className="iconify">< div className = "ICocunt" > < Icon icon = "cryptocurrency:matic"
                      color = "blueviolet" / >
                      
                    {
                        e.attributes.pricePerDay
                    }
                    /Day
                      </div>
                      </div>
                      
                      
                      
                      </div >

                    </div>
                  </div>
                </>

              )
            })}
        </div>
        <div className="rentalsContentR">
          <div className="mapContainer">
          {/* <RentalsMap locations={coOrdinates} setHighLight={setHighLight}/> */}
          <div className="btnToggle"></div>
          </div>
        </div>
      </div>
    </>
  );
};



export default Rentals;

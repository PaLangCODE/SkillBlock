// SPDX-License-Identifier: GNU
pragma solidity ^0.8.7;

contract labour {

    address public owner;
    uint256 public counter;
    address payable[] public labours;

    constructor() {
        counter = 0;
        owner = msg.sender;
     }

    struct rentalInfo {
        string name;
        string city;
        string lat;
        string long;
        string unoDescription;
        string dosDescription;
        string imgUrl;
        
        uint256 pricePerDay;
        string[] datesBooked;
        uint256 id;
        address renter;
    }

    event rentalCreated (
        string name,
        string city,
        string lat,
        string long,
        string unoDescription,
        string dosDescription,
        string imgUrl,
        
        uint256 pricePerDay,
        string[] datesBooked,
        uint256 id,
        address renter
    );

    event newDatesBooked (
        string[] datesBooked,
        uint256 id,
        address booker,
        string city,
        string imgUrl 
    );

    mapping(uint256 => rentalInfo) rentals;
    uint256[] public rentalIds;


    function addRentals(
        string memory _name,
        string memory _city,
        string memory _lat,
        string memory _long,
        string memory _unoDescription,
        string memory _dosDescription,
        string memory _imgUrl,
        
        uint256 _pricePerDay,
        string[] memory _datesBooked
    ) public {
        
        rentalInfo storage newRental = rentals[counter];
        newRental.name = _name;
        newRental.city = _city;
        newRental.lat = _lat;
        newRental.long = _long;
        newRental.unoDescription = _unoDescription;
        newRental.dosDescription = _dosDescription;
        newRental.imgUrl = _imgUrl;
        
        newRental.pricePerDay = _pricePerDay;
        newRental.datesBooked = _datesBooked;
        newRental.id = counter;
        newRental.renter = msg.sender;
        labours.push(payable(msg.sender));
        rentalIds.push(counter);

        emit rentalCreated(
                _name, 
                _city, 
                _lat, 
                _long, 
                _unoDescription, 
                _dosDescription, 
                _imgUrl, 
               
                _pricePerDay, 
                _datesBooked, 
                counter, 
                msg.sender);
        counter++;
    }

    function checkBookings(uint256 id, string[] memory newBookings) private view returns (bool){
        
        for (uint i = 0; i < newBookings.length; i++) {
            for (uint j = 0; j < rentals[id].datesBooked.length; j++) {
                if (keccak256(abi.encodePacked(rentals[id].datesBooked[j])) == keccak256(abi.encodePacked(newBookings[i]))) {
                    return false;
                }
            }
        }
        return true;
    }
   

    function addDatesBooked(uint256 id, string[] memory newBookings) public payable {
        
        require(id < counter, "No such Labour");
        require(checkBookings(id, newBookings), "Already Booked For Requested Date");
        require(msg.value == (rentals[id].pricePerDay * 1 ether * newBookings.length) , "Please submit the asking price in order to complete the purchase");
    
        for (uint i = 0; i < newBookings.length; i++) {
            rentals[id].datesBooked.push(newBookings[i]);
        }

        labours[id].transfer(msg.value);
        
        emit newDatesBooked(newBookings, id, msg.sender, rentals[id].city,  rentals[id].imgUrl);
    
    }

    function getRental(uint256 id) public view returns (string memory, uint256, string[] memory){
        require(id < counter, "No such Labour");

        rentalInfo storage s = rentals[id];
        return (s.name,s.pricePerDay,s.datesBooked);
    }
}

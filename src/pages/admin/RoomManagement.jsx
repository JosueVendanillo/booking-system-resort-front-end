import React, { useEffect, useState } from 'react';
import axios from 'axios';

function RoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/api/rooms/inventory')
      .then(res => setRooms(res.data))
      .catch(err => console.error('Error fetching room inventory:', err));
  }, []);

  // 🔹 Filter rooms by search
  const filteredRooms = rooms.filter(
    room =>
      room.roomType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className="card">
        <div className="card-header d-flex justify-content-between">
          <h5>Room Inventory</h5>
          <input
            className="form-control w-25"
            type="text"
            placeholder="Search by room type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-responsive text-nowrap">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Room Type</th>
                <th className="text-center">Total Rooms</th>
                <th className="text-center">Available Rooms</th>
              </tr>
            </thead>
            <tbody className="table-border-bottom-0">
              {filteredRooms.length > 0 ? (
                filteredRooms.map((room) => (
                  <tr key={room.roomType}>
                    <td>{room.roomType}</td>
                    <td className="text-center">{room.totalRooms}</td>
                    <td className="text-center">{room.availableRooms}</td>
                  </tr>
                ))
              ) : (
                <tr className="text-bg-secondary">
                  <td colSpan="3" className="text-center">
                    <div className="alert alert-light mb-0" role="alert">
                      No room inventory available
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RoomManagement;

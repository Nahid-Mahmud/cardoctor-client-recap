import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import BookingRow from "./BookingRow";
import useAxiosBaseUrl from "../../hooks/useAxiosBaseUrl";

const Bookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);

  // const url = `https://car-doctor-server-lac-five.vercel.app/bookings?email=${user?.email}`;
  // useEffect(() => {
  //   fetch(url, { credentials: "include" })
  //     .then((res) => res.json())
  //     .then((data) => setBookings(data));
  // }, [url]);

  // useing axios
  const axisBaseUrl = useAxiosBaseUrl();
  const url = `/bookings?email=${user?.email}`;
  useEffect(() => {
    axisBaseUrl
      .get(url)
      .then((res) => {
        setBookings(res.data);
      })
      .catch((err) => console.log(err));
  }, [axisBaseUrl, url]);

  const handleDelete = (id) => {
    const proceed = confirm("Are You sure you want to delete");
    if (proceed) {
      fetch(`https://car-doctor-server-lac-five.vercel.app/bookings/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.deletedCount > 0) {
            alert("deleted successful");
            const remaining = bookings.filter((booking) => booking._id !== id);
            setBookings(remaining);
          }
        });
    }
  };

  const handleBookingConfirm = (id) => {
    fetch(`https://car-doctor-server-lac-five.vercel.app/bookings/${id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ status: "confirm" }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.modifiedCount > 0) {
          // update state
          const remaining = bookings.filter((booking) => booking._id !== id);
          console.log("Remaining", remaining);
          const updated = bookings.find((booking) => booking._id === id);
          console.log("Updated", updated);
          updated.status = "confirm";
          const newBookings = [updated, ...remaining];
          console.log("New Bookings", newBookings);
          setBookings(newBookings);
        }
      });
  };

  return (
    // Complete Web Development Course With Jhankar Mahbub
    <div>
      <h2 className="text-5xl">Your bookings: {bookings?.length || 0}</h2>
      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          {/* head */}
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>Image</th>
              <th>Service</th>
              <th>Date</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings?.length > 0 &&
              bookings?.map((booking) => (
                <BookingRow
                  key={booking._id}
                  booking={booking}
                  handleDelete={handleDelete}
                  handleBookingConfirm={handleBookingConfirm}
                ></BookingRow>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bookings;

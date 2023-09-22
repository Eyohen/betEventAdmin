// import React,{useState} from 'react'
// import newRequest from '../utils/newRequest'
// import { useQuery } from "@tanstack/react-query";
// import { Link, useNavigate } from "react-router-dom";

// const Home = () => {

//     const [input, setInput] = useState("");
//     const [search, setSearch] = useState("")

//     const currentUser = JSON.parse(localStorage.getItem("currentUser"));

//     const navigate = useNavigate();
//     const { isLoading, error, data } = useQuery({
//         queryKey: ["users"],
//         queryFn: () =>
//           newRequest.get(`events/participant`).then((res) => {
//             return res.data;
//           }),
//       });

//       const handleSearch = () => {

//       }

//   return (
// <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-16">

// <div className='flex justify-between'>
// <Link to={"/tribepage"}><button className='bg-[#2C5C4B] p-2 text-white rounded-lg'>Tribe Participants</button></Link>

//           <div>
//             <input type='text' placeholder='Search name' className=' h-10 border border-gray-500' onChange={e=>setInput(e.target.value)}/>
//             <button className='bg-[#2C5C4B] p-2 text-white' onClick={handleSearch}>Search</button>
//           </div>
//           </div>

//     <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 mt-5">
//         <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">

//             <tr>

//                 <th scope="col" class="px-6 py-3">
//                     first name
//                 </th>
//                 <th scope="col" class="px-6 py-3">
//                     last name
//                 </th>
//                 <th scope="col" class="px-6 py-3">
//                     email
//                 </th>
//                 <th scope="col" class="px-6 py-3">
//                     phone
//                 </th>
//                 {/* <th scope="col" class="px-6 py-3">
//                     Action
//                 </th> */}
//             </tr>
//         </thead>
//         <tbody>
//             {data?.data?.participants?.map((user)=>(
//                  <tr class="bg-white border-b dark:bg-gray-900 dark:border-gray-700" key={user.id}>
//                  {/* <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
//                    <img className='w-11 h-11' src={user.image} alt=""/>
//                  </th> */}
//                  <td class="px-6 py-4">
//                  {user.firstName}
//                  </td>
//                  <td class="px-6 py-4">
//                  {user.lastName}
//                  </td>
//                  <td class="px-6 py-4">
//                      {user.email}
//                  </td>
//                  <td class="px-6 py-4">
//                      {user.phone}
//                  </td>
//                  {/* <td class="px-6 py-4">
//                      <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
//                  </td> */}
//              </tr>
//             ))}

//         </tbody>
//     </table>
// </div>

//   )
// }

// export default Home

import React, { useState } from "react";
import newRequest from "../utils/newRequest";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import ConfirmationPopup from "../components/popup";

const Home = () => {
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedParticipantEmail, setSelectedParticipantEmail] = useState("");

  const queryConfig = search
    ? {
        queryKey: ["users", { q: search }],
        queryFn: () =>
          newRequest
            .get(`events/participant`, {
              params: {
                q: search,
              },
            })
            .then((res) => {
              return res.data;
            }),
      }
    : {
        queryKey: ["users"],
        queryFn: () =>
          newRequest.get(`events/participant`).then((res) => {
            return res.data;
          }),
      };

  const { isLoading, error, data } = useQuery(queryConfig);

  const handleSearch = () => {
    setSearch(input);
  };

    const queryClient = useQueryClient();
    const mutation = useMutation({
      mutationFn: (checkdata) => {
        console.log("this is regdata", checkdata);

        return newRequest.post("events/tribe/mark/participant", checkdata);
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["users"]);
        window.alert("Participant marked successfully");
        // refresh this page
        navigate("/tribepage");
      },
    });

    const handleCheck = (e, email) => {
      e.preventDefault();
      // const betwinnerId = e.target[0].value;
      setSelectedParticipantEmail(email);
      setShowConfirmation(true);
    };

    const toggleConfirmation = (email) => {
      setSelectedParticipantEmail(email);
      setShowConfirmation(!showConfirmation);
    };

    const confirmParticipant = () => {
      const email = selectedParticipantEmail;
      mutation.mutate({ email });
      toggleConfirmation("");
    };

  return (
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-16">
      <div className="flex justify-between">
        <Link to={"/tribepage"}>
          <button className="bg-[#2C5C4B] p-2 text-white rounded-lg">
            Tribe Participants
          </button>
        </Link>
        <div>
          <input
            type="text"
            placeholder="Search name"
            className="h-10 border border-gray-500"
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            className="bg-[#2C5C4B] p-2 text-white"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 mt-5">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">
              first name
            </th>
            <th scope="col" class="px-6 py-3">
              last name
            </th>
            <th scope="col" class="px-6 py-3">
              email
            </th>
            <th scope="col" class="px-6 py-3">
              phone
            </th>
            <th scope="col" class="px-6 py-3">
              mark
            </th>
          </tr>
        </thead>
        {/* <tbody> */}
        {data?.data?.participants?.map((user) => (
          <tr
            class="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
            key={user.id}
          >
            <td class="px-6 py-4">{user.firstName}</td>
            <td class="px-6 py-4">{user.lastName}</td>
            <td class="px-6 py-4">{user.email}</td>
            <td class="px-6 py-4">{user.phone}</td>
            <td class="px-6 py-4">
              {user.isChecked ? (
                <input
                  type="checkbox"
                  disabled // Disable the checkbox for checked participants
                  checked={user.isChecked}
                />
              ) : (
                <input
                  type="checkbox"
                  onChange={(e) => handleCheck(e, user.email)}
                  id="email"
                  name="email"
                  checked={user.isChecked}
                />
              )}
            </td>
          </tr>
        ))}
        {/* </tbody> */}
      </table>
      {showConfirmation && (
        <ConfirmationPopup
          email={selectedParticipantEmail}
          onCancel={() => setShowConfirmation(false)}
          onConfirm={confirmParticipant}
        />
      )}
    </div>
  );
};

export default Home;

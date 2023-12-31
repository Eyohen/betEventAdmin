import React, { useState } from "react";
import newRequest from "../utils/newRequest";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import ConfirmationPopup from "../components/popup";
const TribePage = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedParticipantEmail, setSelectedParticipantEmail] = useState("");

  const [input, setInput] = useState("");

  const [search, setSearch] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const navigate = useNavigate();
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
    mutation.mutate({ email, isCompeting: true });
    toggleConfirmation("");
  };

  return (
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-16">
      <div className="flex justify-between">
        <Link to={"/home"}>
          <button className="bg-[#2C5C4B] p-2 text-white rounded-lg">
            All Participants
          </button>
        </Link>

        <div>
          <input
            type="text"
            placeholder="Search name"
            className=" h-10 border border-gray-500"
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

      <h1 className="font-bold text-xl mt-10 text-center">
        Tribe Participants Table
      </h1>

      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 mt-5">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
          <th scope="col" class="px-6 py-3">
              id
            </th>
            <th scope="col" class="px-6 py-3">
              image
            </th>
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
              shirt size
            </th>
            <th scope="col" class="px-6 py-3">
              gender
            </th>
            <th scope="col" class="px-6 py-3">
              socials
            </th>
            <th scope="col" class="px-6 py-3">
              betwinner ID
            </th>
            <th scope="col" class="px-6 py-3">
              bettrybe
            </th>
            <th scope="col" class="px-6 py-3">
              check
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.data?.participants
            .filter((user) => user.BetTribeLog !== null)
            .map((user, index) => (
              <tr
                class="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
                key={user.id}
              >
                 <td class="px-6 py-4">{index + 1}</td>
                <th
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  
                  <img
                    className="w-11 h-11"
                    src={user?.BetTribeLog?.profileImage}
                    alt=""
                  />
                </th>
                <td class="px-6 py-4">{user.firstName}</td>
                <td class="px-6 py-4">{user.lastName}</td>
                <td class="px-6 py-4">{user.email}</td>
                <td class="px-6 py-4">{user.phone}</td>
                <td class="px-6 py-4">{user.BetTribeLog.shirtSize}</td>
                <td class="px-6 py-4">{user.BetTribeLog.gender}</td>
                <td class="px-6 py-4">{user.BetTribeLog.socials}</td>
                <td class="px-6 py-4">{user.BetTribeLog.betwinnerId}</td>
                <td class="px-6 py-4">{user.BetTribeLog.BetTribe.name}</td>
                <td class="px-6 py-4">
                  {user.BetTribeLog.isVerified ? (
                    <input
                      type="checkbox"
                      disabled // Disable the checkbox for checked participants
                      checked={user.BetTribeLog.isVerified}
                    />
                  ) : (
                    <input
                      type="checkbox"
                      onChange={(e) => handleCheck(e, user.email)}
                      id="email"
                      name="email"
                      checked={user.BetTribeLog.isVerified}
                    />
                  )}
                </td>
              </tr>
            ))}
        </tbody>
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

export default TribePage;

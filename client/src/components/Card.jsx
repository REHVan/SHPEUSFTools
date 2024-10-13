import React from 'react';

function Card(props) {
    const displayNameMapping = {
        userMentorOrMentee: "Participate Type",
        menteeFullName: "Mentee Full Name",
        menteeUsfEmail: "Mentee USF Email",
        menteePhoneNumber: "Mentee Phone Number",
        menteeMajor: "Mentee Major",
        menteeYear: "Mentee Year",
        rbYesNoMenteePrior: "Mentee Prior Experience",
        menteeGoals: "Mentee Goals",
        menteeSong: "Mentee Song",
        menteeInterest: "Mentee Interests",
        menteeFunFact: "Mentee Fun Fact",
        mentorFullName: "Mentor Full Name",
        mentorUsfEmail: "Mentor USF Email",
        mentorPhoneNumber: "Mentor Phone Number",
        mentorMajor: "Mentor Major",
        mentorYear: "Mentor Year",
        mentorMenteeCount: "Mentor Mentee Count",
        rbYesNoMentorPrior: "Mentor Prior Experience",
        mentorGoals: "Mentor Goals",
        mentorSong: "Mentor Song",
        mentorInterest: "Mentor Interests",
        mentorFunFact: "Mentor Fun Fact"
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md w-96 h-auto flex flex-col">
            <h2 className="text-xl font-semibold mb-3">User Details</h2>
            <div className="flex-1">
                {props.detailInfo.userInfo.map((userInfo, index) => {
                    const displayName = displayNameMapping[userInfo.detail];
                    return (
                        <div key={index} className="mb-2 border-b pb-2">
                            <p className="font-medium text-gray-800">{displayName}:</p>
                            <p className="text-gray-600">{userInfo.value}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Card;

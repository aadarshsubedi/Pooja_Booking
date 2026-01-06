export const getPanditDashboard = async () => {
  // 🔴 Backend will replace this
  return {
    pandit: {
      name: "Pandit Ji",
      avatar: "/images/profile.jpg",
      status: "Online"
    },
    stats: [
      { title: "Pending Requests", value: 3 },
      { title: "Today's Bookings", value: 2 },
      { title: "Upcoming (7 Days)", value: 5 },
      { title: "Earnings", value: "Rs. 12,500" }
    ]
  };
};

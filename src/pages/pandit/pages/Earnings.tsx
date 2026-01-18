
import { useEffect, useState } from "react";
import { fetchPanditEarnings } from "../../../api/Api";

const Earnings = () => {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchPanditEarnings().then(d => setTotal(d.total_earnings));
  }, []);

  return <h2>Total Earnings: Rs. {total}</h2>;
};

export default Earnings;

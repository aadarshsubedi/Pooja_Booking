import React from "react";
import "./PoojaCard.css";

interface PoojaCardProps {
  name: string;
  img: string;
}

const PoojaCard: React.FC<PoojaCardProps> = ({ name, img }) => {
  return (
    <div className="pooja-card">
      <img src={img} alt={name} />
      <p>{name}</p>
    </div>
  );
};

export default PoojaCard;

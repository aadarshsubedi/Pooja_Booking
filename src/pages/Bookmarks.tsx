import React from "react";
import "./Bookmarks.css";

const Bookmarks: React.FC = () => {
  const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");

  return (
    <div className="bookmarks-page">
      <div className="bookmarks-main-card">
        <h2>My Bookmarks</h2>

        {bookmarks.length === 0 ? (
          <p className="empty-text">No bookmarks yet</p>
        ) : (
          <div className="bookmark-list">
            {bookmarks.map((item: any, i: number) => (
              <div key={i} className="bookmark-item">
                {item.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;

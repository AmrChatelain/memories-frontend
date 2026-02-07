import React from "react";
import moment from "moment";
import { FaHeart, FaMapMarkerAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

function MemoriesCard({
  imgUrl,
  title,
  date,
  story,
  location,
  isFavorite,
  tags,
  onClick,
  onEdit,
  onFavoriteClick,
}) {
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={imgUrl}
          alt={title}
          className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
          onClick={onClick}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Favorite Button */}
        <button
          className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 z-10"
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteClick();
          }}
        >
          <FaHeart
            className={`text-lg cursor-pointer transition-colors duration-200 ${
              isFavorite ? "text-red-500" : "text-gray-400 hover:text-red-500"
            }`}
          />
        </button>

        {/* Edit Button */}
        <button
          className="absolute top-3 left-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 hover:scale-110 transition-all duration-200 z-10"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <MdEdit className="text-lg text-gray-700" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4" onClick={onClick}>
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
          {title}
        </h3>

        {/* Story Preview */}

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {story?.length > 60 ? story.slice(0, 60) + "..." : story}
        </p>
        {/* Footer Info */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <FaMapMarkerAlt className="text-purple-500" />
            <span className="line-clamp-1">{location || "Unknown"}</span>
          </div>
          <span className="whitespace-nowrap">
            {date ? moment(date).format("DD MMM, YYYY") : "-"}
          </span>
        </div>
      </div>
       {/* Add tags display */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1 p-4 pt-0">
          {tags.map((tag) => (
            <span 
              key={tag._id}
              className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Hover line */}
      <div className="h-1 bg-gradient-to-r from-purple-600 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
    </div>
  );
}

export default MemoriesCard;

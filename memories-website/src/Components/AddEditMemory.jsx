import React, { useState, useEffect } from "react";
import { MdClose, MdAdd, MdEdit } from "react-icons/md";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import DeleteData from "./input/DeleteData";
import axiosInstance from "../utils/axiosInstance";

function AddEditMemory({ isOpen, onClose, type, memoryData, onSave }) {
  // State to store form data
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [location, setLocation] = useState("");
  const [visitedDate, setVisitedDate] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]); 
  const [allTags, setAllTags] = useState([]); 
  const [error, setError] = useState("");

  // Fetch all tags from backend
  const getAllTags = async () => {
    try {
      const response = await axiosInstance.get("/tags");
      if (response.data && response.data.tags) {
        setAllTags(response.data.tags);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  useEffect(() => {
    if (type === "edit" && memoryData) {
      // Fill form with existing memory data
      setTitle(memoryData.title || "");
      setStory(memoryData.story || "");

      // Handle location
      const locationValue = Array.isArray(memoryData.location)
        ? memoryData.location[0] || ""
        : memoryData.location || "";
      setLocation(locationValue);

      setVisitedDate(
        memoryData.visitedDate
          ? new Date(memoryData.visitedDate).toISOString().split("T")[0]
          : ""
      );
      setImagePreview(memoryData.imageUrl || null);

      if (memoryData.tags && Array.isArray(memoryData.tags)) {
        const tagIds = memoryData.tags.map((tag) =>
          typeof tag === "string" ? tag : tag._id
        );
        setSelectedTags(tagIds);
      } else {
        setSelectedTags([]);
      }
    } else {
      setTitle("");
      setStory("");
      setLocation("");
      setVisitedDate("");
      setImagePreview(null);
      setImageFile(null);
      setSelectedTags([]);
    }
    setError("");

    
    if (isOpen) {
      getAllTags();
    }
  }, [memoryData, type, isOpen]);

  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);

      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  
  const handleTagToggle = (tagId) => {
    setSelectedTags((prev) => {
      const isSelected = prev.includes(tagId);
      return isSelected
        ? prev.filter((id) => id !== tagId) 
        : [...prev, tagId];
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const locationString = String(location || "");

    if (!title.trim()) {
      setError("Please enter a title for your memory");
      return;
    }

    if (!story.trim()) {
      setError("Please share your story");
      return;
    }

    if (!locationString.trim()) {
      setError("Please enter a location");
      return;
    }

    if (!visitedDate) {
      setError("Please select a date");
      return;
    }

    // Only require image when adding new memory
    if (type === "add" && !imageFile) {
      setError("Please upload an image");
      return;
    }

    setError("");

    // Collect all form data
    const formData = {
      title,
      story,
      location: locationString,
      visitedDate,
      imageFile,
      tags: selectedTags,
    };

    onSave(formData, type);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            {type === "add" ? (
              <MdAdd className="text-3xl" />
            ) : (
              <MdEdit className="text-3xl" />
            )}
            <h2 className="text-2xl font-bold">
              {type === "add" ? "Add New Memory" : "Edit Memory"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <MdClose className="text-2xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Memory Image
            </label>
            <div className="relative">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <MdClose />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 transition-colors">
                  <span className="text-5xl mb-3">📸</span>
                  <span className="text-gray-600 font-medium">
                    Click to upload image
                  </span>
                  <span className="text-gray-400 text-sm mt-1">
                    JPG, PNG or WEBP
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              placeholder="A memorable moment..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Story */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Story
            </label>
            <textarea
              placeholder="Share the story behind this memory..."
              value={story}
              onChange={(e) => setStory(e.target.value)}
              rows="5"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Location and Date Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500" />
                <input
                  type="text"
                  placeholder="Where was this?"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date
              </label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500" />
                <input
                  type="date"
                  value={visitedDate}
                  onChange={(e) => setVisitedDate(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                Tags (Optional)
              </label>
              <button
                type="button"
                onClick={() => window.open("/tags")}
                className="text-xs text-purple-600 hover:text-purple-800 underline"
              >
                Manage Tags
              </button>
            </div>

            {allTags.length === 0 ? (
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
                <p className="text-gray-500 text-sm mb-2">
                  No tags available yet.
                </p>
                <button
                  type="button"
                  onClick={() => window.open("/tags")}
                  className="text-purple-600 hover:text-purple-800 underline text-sm font-medium"
                >
                  Create your first tag →
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag._id}
                    type="button"
                    onClick={() => handleTagToggle(tag._id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedTags.includes(tag._id)
                        ? "bg-purple-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            )}

            {selectedTags.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                {selectedTags.length} tag{selectedTags.length > 1 ? "s" : ""}{" "}
                selected
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-linear-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              {type === "add" ? "Add Memory" : "Save Changes"}
            </button>
          </div>
        </form>

        {type === "edit" && (
          <div className="px-6 pb-6">
            <DeleteData />
          </div>
        )}
      </div>
    </div>
  );
}

export default AddEditMemory;
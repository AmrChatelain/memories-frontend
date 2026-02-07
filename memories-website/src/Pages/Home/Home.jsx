import React, { useEffect, useState } from "react";
import Navbar from "../../Components/input/Navbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import MemoriesCard from "../../Components/input/Cards/MemoriesCard";
import AddEditMemory from "../../Components/AddEditMemory";
import { MdAdd } from "react-icons/md";

function Home() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allMemories, setAllMemories] = useState([]);
  const [filteredMemories, setFilteredMemories] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [openAddEdit, setOpenAddEdit] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  // Get user info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/auth/verify");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Get all tags
  const getAllTags = async () => {
    try {
      const response = await axiosInstance.get("/tags");
      if (response.data && response.data.tags) {
        setAllTags(response.data.tags);
      }
    } catch (error) {
      console.log("Error fetching tags:", error);
    }
  };

  // Get all memories
  const getAllMemories = async () => {
    try {
      const response = await axiosInstance.get("/memories/all-memories");
      if (response.data && response.data.memories) {
        setAllMemories(response.data.memories);
        setFilteredMemories(response.data.memories); // Initially show all
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Filter memories by tag
  const handleTagFilter = (tagId) => {
    if (selectedTag === tagId) {
      // If clicking the same tag, clear filter (show all)
      setSelectedTag(null);
      setFilteredMemories(allMemories);
    } else {
      // Filter memories that have this tag
      setSelectedTag(tagId);
      const filtered = allMemories.filter((memory) =>
        memory.tags.some((tag) => tag._id === tagId)
      );
      setFilteredMemories(filtered);
    }
  };

  // Clear all filters
  const clearFilter = () => {
    setSelectedTag(null);
    setFilteredMemories(allMemories);
  };

  const handleEdit = (data) => {
    setOpenAddEdit({ isShown: true, type: "edit", data: data });
  };

  const handleViewMemory = (data) => {
    console.log("View memory:", data);
  };

  const updateIsFavorite = async (memoryData) => {
    const memoryId = memoryData._id;

    try {
      const response = await axiosInstance.put(
        `/memories/update-is-favorite/${memoryId}`,
        {
          isFavorite: !memoryData.isFavorite,
        }
      );

      if (response.data && response.data.memory) {
        getAllMemories();
      }
    } catch (error) {
      console.log("Error updating favorite:", error);
    }
  };

  const handleSaveMemory = async (formData, type) => {
    try {
      let imageUrl = "";

      
      if (type === "edit") {
        imageUrl = openAddEdit.data?.imageUrl || "";
      }

      if (formData.imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("image", formData.imageFile);

        const uploadResponse = await axiosInstance.post(
          "/memories/image-upload",
          imageFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (uploadResponse.data && uploadResponse.data.imageUrl) {
          imageUrl = uploadResponse.data.imageUrl;
        }
      }

      
      const payload = {
        title: formData.title,
        story: formData.story,
        location: formData.location,
        visitedDate: formData.visitedDate,
        imageUrl: imageUrl,
        tags: formData.tags, 
      };

      
      if (type === "add") {
        const response = await axiosInstance.post("/memories/memory", payload);

        if (response.data && response.data.memory) {
          getAllMemories();
          setOpenAddEdit({ isShown: false, type: "add", data: null });
        }
      } else {
        const memoryId = openAddEdit.data._id;

        const response = await axiosInstance.put(
          `/memories/memory/${memoryId}`,
          payload
        );

        if (response.data && response.data.memory) {
          getAllMemories();
          setOpenAddEdit({ isShown: false, type: "add", data: null });
        }
      }
    } catch (error) {
      console.log("Error saving memory:", error);
    }
  };

  useEffect(() => {
    getAllMemories();
    getAllTags();
    getUserInfo();
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Memories</h1>
            <p className="text-gray-500 mt-1">
              {filteredMemories.length}{" "}
              {filteredMemories.length === 1 ? "memory" : "memories"}{" "}
              {selectedTag ? "with this tag" : "saved"}
            </p>
          </div>
          <button
            onClick={() =>
              setOpenAddEdit({ isShown: true, type: "add", data: null })
            }
            className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-indigo-600 text-white rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <MdAdd className="text-xl" />
            Add Memory
          </button>
        </div>

        {/* Tag Filter Bar */}
        {allTags.length > 0 && (
          <div className="mb-6 bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-semibold text-gray-700">
                Filter by tag:
              </span>
              
              <button
                onClick={clearFilter}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTag === null
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>

              {allTags.map((tag) => (
                <button
                  key={tag._id}
                  onClick={() => handleTagFilter(tag._id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTag === tag._id
                      ? "bg-purple-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tag.name}
                </button>
              ))}

              <button
                onClick={() => navigate("/tags")}
                className="ml-auto text-sm text-purple-600 hover:text-purple-800 underline"
              >
                Manage Tags
              </button>
            </div>
          </div>
        )}

        {/* Memories Grid */}
        {filteredMemories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMemories.map((item) => {
              return (
                <MemoriesCard
                  key={item._id}
                  imgUrl={item.imageUrl}
                  title={item.title}
                  story={item.story}
                  date={item.visitedDate}
                  location={item.location}
                  isFavorite={item.isFavorite}
                  tags={item.tags}
                  onEdit={() => handleEdit(item)}
                  onClick={() => handleViewMemory(item)}
                  onFavoriteClick={() => updateIsFavorite(item)}
                />
              );
            })}
          </div>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-32 h-32 bg-linear-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-6xl">📸</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              {selectedTag ? "No Memories with This Tag" : "No Memories Yet"}
            </h3>
            <p className="text-gray-500 mb-6 text-center max-w-md">
              {selectedTag
                ? "Try selecting a different tag or clear the filter"
                : "Start capturing your precious moments and create lasting memories"}
            </p>
            {selectedTag ? (
              <button
                onClick={clearFilter}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-all"
              >
                Clear Filter
              </button>
            ) : (
              <button
                onClick={() =>
                  setOpenAddEdit({ isShown: true, type: "add", data: null })
                }
                className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-indigo-600 text-white rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <MdAdd className="text-xl" />
                Create Your First Memory
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AddEditMemory
        isOpen={openAddEdit.isShown}
        onClose={() =>
          setOpenAddEdit({ isShown: false, type: "add", data: null })
        }
        type={openAddEdit.type}
        memoryData={openAddEdit.data}
        onSave={handleSaveMemory}
      />
    </>
  );
}

export default Home;
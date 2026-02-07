import React, { useEffect, useState } from "react";
import Navbar from "../../Components/input/Navbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { MdAdd, MdClose } from "react-icons/md";

function Tags() {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [tags, setTags] = useState([]);
  const [newTagName, setNewTagName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        setTags(response.data.tags);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  // Create new tag
  const handleCreateTag = async (e) => {
    e.preventDefault();
    
    if (!newTagName.trim()) {
      setError("Tag name is required");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/tags", {
        name: newTagName.trim()
      });

      if (response.data && response.data.tag) {
        setTags([response.data.tag, ...tags]);
        setNewTagName("");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to create tag");
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete tag
  const handleDeleteTag = async (tagId) => {
    try {
      await axiosInstance.delete(`/tags/${tagId}`);
      setTags(tags.filter(tag => tag._id !== tagId));
    } catch (error) {
      console.error("Error deleting tag:", error);
      setError("Failed to delete tag");
    }
  };

  useEffect(() => {
    getUserInfo();
    getAllTags();
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Manage Tags</h1>
            <p className="text-gray-600 mt-2">
              Create tags to organize your memories. Tags can be assigned when creating or editing memories.
            </p>
          </div>

          {/* Create Tag Form */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">Create New Tag</h2>
            
            <form onSubmit={handleCreateTag} className="flex gap-3">
              <input
                type="text"
                placeholder="Enter tag name (e.g., Family, Travel, Work)"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 flex items-center gap-2"
              >
                <MdAdd size={20} />
                {loading ? "Creating..." : "Create"}
              </button>
            </form>

            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>

          {/* Tags List */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Your Tags ({tags.length})
            </h2>

            {tags.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No tags yet. Create your first tag above to organize your memories!
              </p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {tags.map((tag) => (
                  <div
                    key={tag._id}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-full"
                  >
                    <span className="font-medium">{tag.name}</span>
                    
                    <button
                      onClick={() => handleDeleteTag(tag._id)}
                      className="hover:bg-purple-200 rounded-full p-1"
                      title="Delete tag"
                    >
                      <MdClose size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Back Button */}
          <div className="mt-6">
            <button
              onClick={() => navigate("/")}
              className="text-purple-600 hover:text-purple-800 underline"
            >
              ← Back to Memories
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

export default Tags;
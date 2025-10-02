import { useEffect, useState } from "react";
import axios from "axios";
import { Edit2, Search, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { categories } from "../components/Catagories";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [filterTitle, setFilterTitle] = useState("");
  const navigate = useNavigate();

  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${apiBaseUrl}/api/posts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(data);
        setFilteredPosts(data);
      } catch (err) {
        console.error("Failed to fetch posts", err);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    let filtered = posts;
    if (filterCategory) {
      filtered = filtered.filter((post) => {
        if (Array.isArray(post.category)) {
          return post.category.some((cat) =>
            cat.toLowerCase().includes(filterCategory.toLowerCase())
          );
        }
        return post.category
          .toLowerCase()
          .includes(filterCategory.toLowerCase());
      });
    }
    if (filterDate) {
      filtered = filtered.filter((post) => {
        const postDate = new Date(post.publish_on).toISOString().split("T")[0];
        return postDate === filterDate;
      });
    }
    if (filterTag) {
      filtered = filtered.filter((post) => {
        if (Array.isArray(post.tags)) {
          return post.tags.some((tag) =>
            tag.toLowerCase().includes(filterTag.toLowerCase())
          );
        }
        return post.tags.toLowerCase().includes(filterTag.toLowerCase());
      });
    }
    if (filterTitle) {
      filtered = filtered.filter((post) =>
        post.title.toLowerCase().includes(filterTitle.toLowerCase())
      );
    }
    setFilteredPosts(filtered);
  }, [filterCategory, filterDate, filterTag, filterTitle, posts]);

  const handleEdit = (post) => {
    navigate("/admin/content-management", { state: { post } });
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (err) {
      console.error("Failed to delete post", err);
      alert("Failed to delete post");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-8 w-full sm:max-w-md">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold mb-2">Total Posts </h2>
          <button
            onClick={() => setShowFilter(!showFilter)}
            aria-label="Toggle filter"
          >
            <Search />
          </button>
        </div>
        <p className="text-4xl font-bold">{filteredPosts.length}</p>
        {showFilter && (
          <div className="mt-4 p-4 border border-gray-300 rounded bg-gray-50 space-y-4">
            <div>
              <label htmlFor="filterTitle" className="block font-semibold mb-1">
                Filter by Title
              </label>
              <input
                id="filterTitle"
                type="text"
                value={filterTitle}
                onChange={(e) => setFilterTitle(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label
                htmlFor="filterCategory"
                className="block font-semibold mb-1"
              >
                Filter by Category
              </label>
              <select
                id="filterCategory"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="filterDate" className="block font-semibold mb-1">
                Filter by Date
              </label>
              <input
                id="filterDate"
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label htmlFor="filterTag" className="block font-semibold mb-1">
                Filter by Tag
              </label>
              <input
                id="filterTag"
                type="text"
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        )}
      </div>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow max-w-full overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4">Recent Posts</h2>
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">
                S/N
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Title
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Status
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Views
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Date Published
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Author
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.slice(0, 8).map((post, index) => (
              <tr key={post._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {index + 1}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {post.title}
                </td>
                <td
                  className={`border border-gray-300 px-4 py-2 ${
                    post.status === "published"
                      ? "text-green-600"
                      : post.status === "draft"
                      ? "text-purple-600"
                      : post.status === "scheduled"
                      ? "text-orange-600"
                      : ""
                  }`}
                >
                  {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {post.viewCount || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(post.publish_on).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {post.author}
                </td>
                <td className="border border-gray-300 px-4 py-2 space-x-4">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    aria-label="Edit post"
                    onClick={() => handleEdit(post)}
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    aria-label="Delete post"
                    onClick={() => handleDelete(post._id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;

import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { categories } from "../components/Catagories";
import BlogCard from "../components/BlogCard";

const BlogViewer = () => {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8;

  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get(`${apiBaseUrl}/api/posts`);
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch posts", err);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  let filteredPosts = posts;
  if (selectedCategory !== "All Categories") {
    filteredPosts = filteredPosts.filter((post) => {
      if (Array.isArray(post.category)) {
        return post.category.includes(selectedCategory);
      }
      return post.category === selectedCategory;
    });
  }
  if (searchQuery) {
    filteredPosts = filteredPosts.filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-[#0C0A25] text-white">
      <nav className="bg-[#0B0B23] p-6">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <button
            className=" top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white max-sm:self-start"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <Menu />
          </button>
          <div className="ml-[5rem] max-sm:ml-1">
            <h1 className="text-white text-3xl font-bold max-sm:text-[15px]">
              Resources and insights
            </h1>
            <p className="text-gray-400 mt-1  max-sm:text-sm">
              The Latest Industry News, Interviews, Technologies And Resources.
            </p>
          </div>
        </div>
      </nav>

      <aside
        className={`fixed top-[7rem] left-0 bg-[#0C0A25] p-6 pt-0 rounded-lg shadow-lg h-[calc(100vh-7rem)] flex flex-col z-40 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0 w-1/4" : "-translate-x-full w-0"
        }`}
      >
        <input
          type="text"
          placeholder="Search"
          className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400 mb-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="mb-4 flex-grow overflow-y-auto">
          <h3 className="font-semibold mb-2">Blog Categories</h3>
          <ul className="space-y-1 max-h-full ">
            <li>
              <button
                className={`w-full text-left px-2 py-1 rounded ${
                  selectedCategory === "All Categories"
                    ? "bg-purple-600"
                    : "hover:bg-gray-700"
                }`}
                onClick={() => setSelectedCategory("All Categories")}
              >
                All Categories
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  className={`w-full text-left px-2 py-1 rounded ${
                    selectedCategory === cat
                      ? "bg-purple-600"
                      : "hover:bg-gray-700"
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div className="sm:container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <main
          className={`col-span-12 space-y-12 ${
            sidebarOpen ? "lg:ml-[25%]" : ""
          }`}
        >
          <div className="grid-container max-sm:gap-1">
            {paginatedPosts.map((post) => (
              <BlogCard key={post._id} post={post} sidebarOpen={sidebarOpen} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 space-x-2 select-none bg-[#2F2F4A] rounded-lg shadow-md px-4 py-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft />
              </button>
              {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1;
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded ${
                      isActive
                        ? "bg-indigo-500 text-white"
                        : "hover:bg-gray-200"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <ChevronRight />
              </button>
            </div>
          )}
        </main>
      </div>
      <footer className="bg-[#0B0B23] text-center py-4 text-gray-400">
        Creator Khalilur Rahman, © {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default BlogViewer;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const YouMayLove = ({ currentCategory, currentPostId }) => {
  const [relatedPosts, setRelatedPosts] = useState([]);

  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        const { data } = await axios.get(
          `${apiBaseUrl}/api/posts/related/${encodeURIComponent(
            currentCategory
          )}/${currentPostId}`
        );
        setRelatedPosts(data);
      } catch (err) {
        console.error("Failed to fetch related posts", err);
      }
    };
    if (currentCategory && currentPostId) {
      fetchRelatedPosts();
    }
  }, [currentCategory, currentPostId]);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#0C0A25]">
      <div className="mt-12 mb-8 max-w-4xl mx-auto">
        <h2 className="text-white text-2xl font-semibold mb-6 text-center">
          Blogs You May Love
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 m-1.5">
          {relatedPosts.slice(0, 3).map((post) => (
            <Link
              key={post._id}
              to={`/post/${post._id}`}
              className="bg-[#0C0A25] rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
            >
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-32 object-cover rounded-t-lg"
                />
              )}
              <div className="p-4 pl-0">
                <p className="text-xs text-[#ADCDFE] mb-1">
                  {Array.isArray(post.category)
                    ? post.category.join(", ")
                    : post.category}
                </p>
                <h3 className="text-sm font-semibold mb-2 text-[#ADCDFE]">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-3">
                  {post.summary || post.content.substring(0, 100) + "..."}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YouMayLove;

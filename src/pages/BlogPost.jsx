import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import YouMayLove from "../components/YouMayLove";
import { ArrowLeft } from "lucide-react";

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`${apiBaseUrl}/api/posts/${id}`);
        setPost(data);
      } catch (err) {
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    const incrementView = async () => {
      try {
        console.log("Incrementing view for post:", id);
        const response = await axios.post(
          `${apiBaseUrl}/api/posts/${id}/increment-view`
        );
        console.log("Increment response:", response.data);
      } catch (err) {
        console.error("Failed to increment view count", err);
      }
    };
    if (id) {
      incrementView();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="flex flex-col">
      <div className="bg-gradient-to-r from-[#D6F4FE] to-white">
        <div className="min-h-screen  text-[#000000] p-6 max-w-4xl mx-auto">
          <div className="mb-4">
            <Link to="/" className="text-blue-400 ">
              <ArrowLeft className="inline mr-0.5" /> Back to Blog
            </Link>
          </div>
          <div className="text-center mb-6">
            <h3 className="mb-1">
              <span className="bg-yellow-100 text-gray-800 rounded-full px-3 py-1 inline-block">
                {Array.isArray(post.category)
                  ? post.category.join(", ")
                  : post.category}
              </span>
            </h3>
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
            <p className="text-gray-600">
              Last Update:{" "}
              {new Date(post.publish_on).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="w-full max-h-100 object-cover rounded-lg mb-6"
            />
          )}
          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>
        </div>
      </div>
      <YouMayLove currentCategory={post.category} currentPostId={post._id} />
    </div>
  );
};

export default BlogPost;

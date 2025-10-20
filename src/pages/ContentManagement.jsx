import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { categories } from "../components/Catagories";

const ContentManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editingPost = location.state?.post;

  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
  const tinymceApiKey =
    import.meta.env.VITE_TINYMCE_API_KEY ||
    "gkjwqp0m9jbpe73ffjpcx2a7yksy90o3laatqmis1xxdvn65";

  const [post, setPost] = useState({
    title: "",
    image: "",
    publish_on: "",
    is_featured: false,
    tags: "",
    category: "",
    author: "",
    summary: "",
    meta_description: "",
    content: "",
    status: "draft",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get username from localStorage or token payload
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.username) {
      setPost((prev) => ({ ...prev, author: user.username }));
    }
  }, []);

  useEffect(() => {
    if (editingPost) {
      setPost({
        ...editingPost,
        publish_on: editingPost.publish_on
          ? new Date(editingPost.publish_on).toISOString().split("T")[0]
          : "",
        tags: editingPost.tags ? editingPost.tags.join(", ") : "",
        category: editingPost.category
          ? Array.isArray(editingPost.category)
            ? editingPost.category.join(", ")
            : editingPost.category
          : "",
      });
    }
  }, [editingPost]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPost((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditorChange = (content) => {
    setPost((prev) => ({
      ...prev,
      content: content,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }
      let response;
      if (editingPost) {
        response = await axios.put(
          `${apiBaseUrl}/api/posts/${editingPost._id}`,
          {
            ...post,
            tags: post.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean),
            category: post.category
              .split(",")
              .map((cat) => cat.trim())
              .filter(Boolean),
            publish_on: new Date(post.publish_on),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await axios.post(
          `${apiBaseUrl}/api/posts`,
          {
            ...post,
            tags: post.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean),
            category: post.category
              .split(",")
              .map((cat) => cat.trim())
              .filter(Boolean),
            publish_on: new Date(post.publish_on),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      if (response.status === 201 || response.status === 200) {
        alert(
          editingPost ? "Post updated successfully" : "Post saved successfully"
        );
        setPost({
          title: "",
          image: "",
          publish_on: "",
          is_featured: false,
          tags: "",
          category: "",
          author: "",
          summary: "",
          meta_description: "",
          content: "",
          status: "draft",
        });
        navigate("/admin");
      } else {
        setError("Failed to save post. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Server error. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {editingPost ? "Edit Post" : "Content Management"}
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 sm:p-6 rounded shadow space-y-4 max-w-3xl w-full"
      >
        <div>
          <label className="block font-semibold mb-1" htmlFor="title">
            Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={post.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1" htmlFor="image">
            Image URL
          </label>
          <input
            id="image"
            name="image"
            type="text"
            value={post.image}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1" htmlFor="publish_on">
            Publish On
          </label>
          <input
            id="publish_on"
            name="publish_on"
            type="date"
            value={post.publish_on}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            id="is_featured"
            name="is_featured"
            type="checkbox"
            checked={post.is_featured}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <label htmlFor="is_featured" className="font-semibold">
            Featured
          </label>
        </div>
        <div>
          <label className="block font-semibold mb-1" htmlFor="tags">
            Tags (comma separated)
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            value={post.tags}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={post.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1" htmlFor="author">
            Author
          </label>
          <input
            id="author"
            name="author"
            type="text"
            value={post.author}
            readOnly
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1" htmlFor="summary">
            Summary
          </label>
          <textarea
            id="summary"
            name="summary"
            value={post.summary}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label
            className="block font-semibold mb-1"
            htmlFor="meta_description"
          >
            Meta Description
          </label>
          <textarea
            id="meta_description"
            name="meta_description"
            value={post.meta_description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1" htmlFor="content">
            Blog Content *
          </label>
          <Editor
            apiKey={tinymceApiKey}
            value={post.content}
            init={{
              height: 300,
              menubar: true,
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste code help wordcount",
              ],
              toolbar:
                "undo redo | formatselect | bold italic backcolor | \
                            alignleft aligncenter alignright alignjustify | \
                            bullist numlist outdent indent | removeformat | help",
            }}
            onEditorChange={handleEditorChange}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={post.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? "Saving..."
            : editingPost
            ? "Update Post"
            : "Save Post"}
        </button>
      </form>
    </div>
  );
};

export default ContentManagement;

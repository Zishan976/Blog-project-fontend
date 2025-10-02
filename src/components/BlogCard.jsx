import { Link } from "react-router-dom";

const BlogCard = ({ post, sidebarOpen }) => {
  return (
    <article
      className={`bg-[#0C0A25] rounded-lg shadow-lg overflow-hidden  flex flex-col cursor-pointer `}
    >
      <Link to={`/post/${post._id}`} className=" flex flex-col flex-grow">
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        )}
        <div className="p-4 pl-0 flex flex-col flex-grow">
          <h3 className="text-sm text-blue-400 mb-1">
            {Array.isArray(post.category)
              ? post.category.join(", ")
              : post.category}
          </h3>
          <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
          <div
            className="prose prose-invert max-w-none text-sm flex-grow"
            dangerouslySetInnerHTML={{
              __html: post.content.substring(0, 150) + "...",
            }}
          />
          <div className="mt-auto flex items-center space-x-3 pt-4">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                post.author
              )}`}
              alt={post.author}
              className="w-8 h-8 rounded-full"
            />
            <div className="text-sm">
              <p className="font-medium">{post.author}</p>
              <p className="text-gray-400">
                {new Date(post.publish_on).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default BlogCard;

// ${sidebarOpen ? 'col-span-6' : 'col-span-12 sm:col-span-6 md:col-span-4'}

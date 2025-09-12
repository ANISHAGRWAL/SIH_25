import {
  Filter,
  AlertTriangle,
} from "lucide-react";

const ForumsPage = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Forum Moderation</h2>
        <p className="text-slate-600">Monitor and moderate community discussions</p>
      </div>
      <div className="flex space-x-2">
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          <Filter className="h-4 w-4" />
          <span>Filter Posts</span>
        </button>
      </div>
    </div>

    {/* Alert Posts */}
    <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
      <div className="flex items-center space-x-3 mb-4">
        <AlertTriangle className="h-6 w-6 text-red-500" />
        <h3 className="text-lg font-semibold text-red-800">Flagged Posts</h3>
      </div>
      <div className="space-y-4">
        {[
          { id: 232, reason: "Suicide mention detected", priority: "High", author: "User47" },
          { id: 231, reason: "Spam content", priority: "Medium", author: "User23" },
          { id: 230, reason: "Inappropriate language", priority: "Low", author: "User91" },
        ].map((flag) => (
          <div key={flag.id} className="bg-white p-4 rounded-xl border border-red-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Flag #{flag.id}</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  flag.priority === 'High' ? 'bg-red-100 text-red-800' :
                  flag.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {flag.priority}
                </span>
              </div>
              <div className="text-sm text-slate-500">{flag.author}</div>
            </div>
            <p className="text-sm text-slate-700 mb-3">{flag.reason}</p>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors">
                Approve
              </button>
              <button className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors">
                Remove
              </button>
              <button className="px-3 py-1 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors">
                Review
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Recent Posts */}
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Posts</h3>
      <div className="space-y-4">
        {[
          { title: "Dealing with exam stress", author: "Student123", replies: 12, time: "2 hours ago" },
          { title: "Anyone else feeling overwhelmed?", author: "Anonymous", replies: 8, time: "4 hours ago" },
          { title: "Tips for better sleep", author: "Wellness_guru", replies: 15, time: "1 day ago" },
        ].map((post, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <h4 className="font-medium text-slate-900">{post.title}</h4>
              <p className="text-sm text-slate-600">by {post.author} • {post.replies} replies</p>
            </div>
            <div className="text-sm text-slate-500">{post.time}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ForumsPage;
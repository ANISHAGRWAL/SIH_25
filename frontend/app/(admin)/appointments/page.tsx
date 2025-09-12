import { Plus } from "lucide-react";

const AppointmentsPage = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Appointment Management</h2>
        <p className="text-slate-600">Schedule and manage counseling sessions</p>
      </div>
      <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold">
        <Plus className="h-4 w-4" />
        <span>New Appointment</span>
      </button>
    </div>

    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Today's Schedule</h3>
        <div className="space-y-4">
          {[
            { time: "09:00 AM", patient: "John Doe", counselor: "Dr. Smith", status: "confirmed" },
            { time: "10:30 AM", patient: "Jane Smith", counselor: "Dr. Johnson", status: "pending" },
            { time: "02:00 PM", patient: "Mike Wilson", counselor: "Dr. Brown", status: "completed" },
          ].map((apt, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                <div>
                  <div className="font-medium">{apt.time}</div>
                  <div className="text-sm text-slate-600">{apt.patient} → {apt.counselor}</div>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-slate-100 text-slate-800'
              }`}>
                {apt.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
        <div className="space-y-4">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <div className="text-2xl font-bold text-blue-600">24</div>
            <div className="text-sm text-slate-600">Today's Sessions</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <div className="text-2xl font-bold text-green-600">18</div>
            <div className="text-sm text-slate-600">Completed</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-xl">
            <div className="text-2xl font-bold text-orange-600">6</div>
            <div className="text-sm text-slate-600">Upcoming</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AppointmentsPage;
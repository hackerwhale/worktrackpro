import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
var ActivityTimeline = function (_a) {
    var activities = _a.activities, users = _a.users;
    // Helper function to get user by ID
    var getUserById = function (userId) {
        return users.find(function (user) { return user.id === userId; });
    };
    // Format activity description
    var formatActivity = function (activity) {
        var user = getUserById(activity.userId);
        if (!user)
            return activity.description;
        return activity.description.replace(/^User/, "".concat(user.firstName));
    };
    return (<div>
      <h2 className="mb-4 text-lg font-semibold text-neutral-800 dark:text-neutral-100">Recent Activity</h2>
      
      <div className="relative space-y-4 pl-4 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-neutral-200 dark:before:bg-neutral-700">
        {activities.map(function (activity, index) { return (<div key={activity.id} className="relative pb-4">
            <span className={cn("absolute -left-[17px] top-1 h-3 w-3 rounded-full", index < 4 ? "bg-primary-500" : "bg-neutral-300 dark:bg-neutral-600")}></span>
            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
              {formatActivity(activity)}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
            </p>
          </div>); })}
      </div>
    </div>);
};
export default ActivityTimeline;

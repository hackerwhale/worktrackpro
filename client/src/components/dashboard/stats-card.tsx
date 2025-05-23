import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: "primary" | "success" | "warning" | "error";
}

const StatsCard = ({ title, value, icon, color }: StatsCardProps) => {
  const getColorClasses = () => {
    switch (color) {
      case "primary":
        return "bg-primary-50 text-primary-500 dark:bg-primary-900 dark:text-primary-300";
      case "success":
        return "bg-success-50 text-success-500 dark:bg-success-900 dark:text-success-300";
      case "warning":
        return "bg-warning-50 text-warning-500 dark:bg-warning-900 dark:text-warning-300";
      case "error":
        return "bg-error-50 text-error-500 dark:bg-error-900 dark:text-error-300";
      default:
        return "bg-primary-50 text-primary-500 dark:bg-primary-900 dark:text-primary-300";
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-card">
      <div className="flex items-center">
        <div className={cn("rounded-md p-3", getColorClasses())}>
          {icon}
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{title}</h3>
          <p className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;

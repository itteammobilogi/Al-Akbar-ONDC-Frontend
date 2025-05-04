export const SkeletonCard = () => (
  <div className="bg-white border border-pink-200 rounded-lg shadow-md p-4 animate-pulse">
    <div className="bg-gray-200 h-52 rounded w-full mb-4"></div>
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
    <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
    <div className="flex items-center space-x-2">
      <div className="h-4 w-16 bg-gray-300 rounded"></div>
      <div className="h-4 w-12 bg-gray-200 rounded"></div>
    </div>
  </div>
);

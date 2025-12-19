export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="w-8 h-8 border-4 border-cyan-700 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-2 text-sm text-gray-500">Preparando acesso...</p>
    </div>
  );
}

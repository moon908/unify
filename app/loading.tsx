export default function Loading() {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-md">
            <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                    {/* Main outer ring */}
                    <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>

                    {/* Inner pulsating dot */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse shadow-lg shadow-blue-200"></div>
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <span className="text-xl font-bold tracking-tighter text-slate-900 italic">UNIFY</span>
                    <div className="flex space-x-1 mt-1">
                        <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

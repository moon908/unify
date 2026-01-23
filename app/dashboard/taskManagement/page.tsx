import TaskManagement from "@/components/taskManagement/TaskManagement"
import { Suspense } from "react"

const page = () => {
    return (
        <div>
            <Suspense fallback={<div className="p-8 text-slate-500 font-medium animate-pulse">Initializing Task Center...</div>}>
                <TaskManagement />
            </Suspense>
        </div>
    )
}

export default page
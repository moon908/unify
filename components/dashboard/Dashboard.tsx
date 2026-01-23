import { SectionCards } from "@/components/dashboard/section-cards"
import { MyPieChart } from "@/components/charts/MyPieChart"
import { MyBarChart } from "@/components/charts/MyBarChart"
import { MemberList } from "@/components/dashboard/member-list"

export default function Page() {
    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col lg:flex-row gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                    {/* Left Column */}
                    <div className="flex flex-1 flex-col gap-4 md:gap-6">
                        <SectionCards />
                        <MemberList />
                    </div>

                    {/* Right Column */}
                    <div className="flex-none w-full lg:w-[400px] flex flex-col gap-4 md:gap-6">
                        <MyPieChart />
                        <MyBarChart />
                    </div>
                </div>

            </div>
        </div>
    )
}

import { SectionCards } from "@/components/dashboard/section-cards"


export default function Page({ orgId }: { orgId: string }) {
    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col lg:flex-row gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                    {/* Left Column */}
                    <div className="flex flex-1 flex-col gap-4 md:gap-6">
                        <SectionCards />
                    </div>

                    {/* Right Column */}
                    <div className="flex-none w-full lg:w-[400px] flex flex-col gap-4 md:gap-6">

                    </div>
                </div>

            </div>
        </div>
    )
}

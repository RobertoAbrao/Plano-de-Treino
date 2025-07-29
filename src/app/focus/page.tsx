
"use client";

import { useWorkoutPlan } from "@/contexts/workout-plan-context";
import { FocusChart } from "@/components/focus-chart";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function FocusPage() {
    const { plan, isLoading } = useWorkoutPlan();

    if (isLoading) {
        return <Skeleton className="w-full h-[400px]" />;
    }

    return (
        <div className="flex justify-center items-start h-full">
             <div className="w-full max-w-lg">
                <FocusChart plan={plan} />
             </div>
        </div>
    )
}

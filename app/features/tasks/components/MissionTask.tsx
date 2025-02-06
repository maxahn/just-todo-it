import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";

type MissionTaskProps = {
    title: string;
    description: string;
    due?: {
        date: string;
        is_recurring: boolean;
        datetime: string;
        string: string;
        timezone: string;
    };
    duration?: {
        amount: number;
        unit: string;
    };
    anxietyLevel?: number;
    difficultyLevel?: number;
};

export function MissionTask({ title, description, due, duration, anxietyLevel, difficultyLevel} : MissionTaskProps) {
    return (
        <Card className="rounded-xl p-6 gap-4">
            <Text className="text-2xl font-bold">Current Mission</Text>
            <Card className="rounded-xl p-6 mt-3 bg-blue-100">
                <Text className="text-xl font-bold">{title}</Text>
                {description ? <Text className="text-lg">{description}</Text> : null}
                {due ? <Text className="text-lg">{due?.datetime}</Text> : null}
            </Card>
            <Text>Time Estimation: {duration ? `${duration.amount} ${duration.unit}` : ""}</Text>
        </Card>
    )

}